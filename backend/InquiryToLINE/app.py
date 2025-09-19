import json
import os
import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Tuple

# Use functions from the shared Lambda Layer
from send_message import send_line_message
from secret_loader import load_secret


logger = logging.getLogger()
logger.setLevel(logging.INFO)


def _get_recipients() -> List[str]:
    try:
        data = load_secret()
    except Exception:
        data = {}
    ids_raw = (
        (data.get("LINE_USER_IDS") if isinstance(data, dict) else None)
        or os.environ.get("LINE_USER_IDS")
        or os.environ.get("LINE_USER_ID")
        or ""
    )
    recipients = [s.strip() for s in str(ids_raw).split(",") if s and str(s).strip()]
    if not recipients:
        raise ValueError("LINE_USER_IDS not found in secret/env")
    return recipients


def _parse_body(event: Dict[str, Any]) -> Tuple[Dict[str, Any], int]:
    """Parse Lambda Function URL event and return payload dict + status."""
    body = event.get("body")
    if body is None:
        return {}, 400
    
    # Handle base64 encoding
    if event.get("isBase64Encoded"):
        import base64
        body = base64.b64decode(body).decode("utf-8", errors="ignore")

    # Determine content type from headers
    headers = event.get("headers", {})
    content_type = ""
    for key, value in headers.items():
        if key.lower() == "content-type":
            content_type = value.lower()
            break

    # Parse JSON
    if "application/json" in content_type or body.strip().startswith("{"):
        try:
            data = json.loads(body)
            if not isinstance(data, dict):
                return {}, 400
            return data, 200
        except Exception as e:
            logger.error(f"JSON parse error: {e}")
            return {}, 400

    # Parse form data
    if "application/x-www-form-urlencoded" in content_type:
        from urllib.parse import parse_qs
        try:
            parsed = {k: v[0] if isinstance(v, list) and v else v for k, v in parse_qs(body).items()}
            return parsed, 200
        except Exception as e:
            logger.error(f"Form parse error: {e}")
            return {}, 400

    # Fallback: try JSON
    try:
        data = json.loads(body)
        return data if isinstance(data, dict) else ({}, 400)
    except Exception:
        logger.error("Failed to parse body as JSON")
        return {}, 400


def _fmt_time_iso_jst(dt: datetime | None = None) -> str:
    try:
        # Convert to Asia/Tokyo
        from zoneinfo import ZoneInfo

        jst = ZoneInfo("Asia/Tokyo")
        dt = (dt or datetime.now(timezone.utc)).astimezone(jst)
    except Exception:
        dt = (dt or datetime.now(timezone.utc)).astimezone()
    return dt.strftime("%Y/%m/%d %H:%M")


def _format_line_text(payload: Dict[str, Any]) -> str:
    name = (payload.get("name") or payload.get("contactName") or "").strip()
    email = (payload.get("email") or "").strip()
    company = (payload.get("company") or payload.get("organization") or "").strip() or "個人"
    subject = (payload.get("subject") or payload.get("topic") or "").strip() or "(未選択)"
    message = str(payload.get("message") or payload.get("content") or "").strip()
    t_raw = (payload.get("timestamp") or payload.get("time") or "").strip()
    try:
        ts = _fmt_time_iso_jst(datetime.fromisoformat(t_raw)) if t_raw else _fmt_time_iso_jst()
    except Exception:
        ts = _fmt_time_iso_jst()

    lines = [
        "＜お問い合わせ内容＞",
        f"お名前：{name}さん" if name else "お名前：(未入力)",
        f"問い合わせ時間：{ts}",
        f"メールアドレス：{email or '(未入力)'}",
        f"組織名：{company}",
        f"件名：{subject}",
        f"メッセージ：{message}" if message else "メッセージ：(未入力)",
    ]
    body = "\n".join(lines)
    return body


def _response(status: int, body: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "statusCode": status,
        "headers": {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": os.environ.get("CORS_ORIGIN", "*") or "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST",
            "Access-Control-Allow-Headers": "Content-Type,Authorization",
        },
        "body": json.dumps(body, ensure_ascii=False),
    }


def lambda_handler(event, context):
    """Lambda Function URL handler for contact form submissions."""
    logger.info(f"Received event: {json.dumps(event, default=str)}")
    
    # Handle CORS preflight
    request_context = event.get("requestContext", {})
    http_method = request_context.get("http", {}).get("method", "").upper()
    
    if http_method == "OPTIONS":
        return _response(204, {"message": "CORS preflight"})

    # Only allow POST for actual submissions
    if http_method != "POST":
        return _response(405, {"ok": False, "error": "Method not allowed. Use POST."})

    # Parse request body
    payload, status = _parse_body(event)
    if status != 200:
        return _response(400, {"ok": False, "error": "Invalid request body format"})

    logger.info(f"Parsed payload: {payload}")

    # Validate required fields
    required_fields = ["name", "email", "subject", "message"]
    missing = [k for k in required_fields if not str(payload.get(k) or "").strip()]
    if missing:
        return _response(400, {
            "ok": False, 
            "error": f"Missing required fields: {', '.join(missing)}"
        })

    # Format message for LINE
    system_name = os.environ.get("SYSTEM_NAME", "PortfolioInquiry")
    text = _format_line_text(payload)
    logger.info(f"Formatted LINE message: {text}")

    # Send to LINE
    try:
        recipients = _get_recipients()
        sent_count = 0
        results = []
        
        for uid in recipients:
            try:
                send_line_message(uid, text, system_name)
                sent_count += 1
                results.append({"user": uid, "status": "sent"})
                logger.info(f"Successfully sent to user: {uid}")
            except Exception as e:
                logger.error(f"Failed to send to {uid}: {str(e)}")
                results.append({"user": uid, "status": "failed", "error": str(e)})

        if sent_count > 0:
            return _response(200, {
                "ok": True,
                "message": "お問い合わせを受け付けました。ありがとうございます。",
                "sent": sent_count,
                "details": results
            })
        else:
            return _response(500, {
                "ok": False,
                "error": "Failed to send notifications",
                "details": results
            })
            
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return _response(500, {
            "ok": False,
            "error": "Internal server error occurred"
        })

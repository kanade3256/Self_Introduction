import os
import json
import logging
import sys
import boto3
from typing import Tuple, List

try:
    import requests  # provided by Lambda Layer
except Exception:
    # Allow local execution without Layer if installed in venv
    pass


logger = logging.getLogger()
logger.setLevel(logging.INFO)


def _load_secret(secret_name: str) -> dict:
    client = boto3.client("secretsmanager")
    resp = client.get_secret_value(SecretId=secret_name)
    text = resp.get("SecretString")
    if not text and "SecretBinary" in resp:
        # Binaryは想定外だが一応サポート
        text = resp["SecretBinary"].decode("utf-8")
    return json.loads(text or "{}")


def _get_settings() -> Tuple[str, List[str]]:
    secret_name = os.environ.get("SECRET_NAME")
    if not secret_name:
        raise ValueError("SECRET_NAME is required to load LINE settings from Secrets Manager")
    data = _load_secret(secret_name)
    access_token = data.get("LINE_ACCESS_TOKEN")
    # LINE_USER_IDS は Secrets 側を優先し、なければ env をフォールバック
    ids_raw = data.get("LINE_USER_IDS") or os.environ.get("LINE_USER_IDS") or os.environ.get("LINE_USER_ID") or ""
    recipients = [s.strip() for s in str(ids_raw).split(",") if s and str(s).strip()]
    if not access_token:
        raise ValueError("LINE_ACCESS_TOKEN not found in secret")
    if not recipients:
        raise ValueError("LINE_USER_IDS not found in secret/env")
    return access_token, recipients


def _send_line(access_token: str, to: str, text: str) -> None:
    url = "https://api.line.me/v2/bot/message/push"
    headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": f"Bearer {access_token}",
    }
    payload = {
        "to": to,
        "messages": [{"type": "text", "text": text[:5000]}],
    }
    # Use requests if available, else fall back to urllib
    try:
        if 'requests' in sys.modules:
            r = requests.post(url, headers=headers, json=payload, timeout=10)  # type: ignore[name-defined]
            if not r.ok:
                raise RuntimeError(f"LINE API error {r.status_code}: {r.text}")
        else:
            import urllib.request
            req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="POST")
            with urllib.request.urlopen(req, timeout=10) as res:  # noqa: S310
                if res.status != 200:
                    body = res.read().decode("utf-8", errors="ignore")
                    raise RuntimeError(f"LINE API error {res.status}: {body}")
    except Exception as e:
        raise


def _format_sns_record(record: dict) -> str:
    subject = record.get("Sns", {}).get("Subject")
    message = record.get("Sns", {}).get("Message", "")
    # Try parse JSON for common alarms
    try:
        obj = json.loads(message)
        if isinstance(obj, dict) and obj.get("AlarmName"):
            parts = [
                f"Alarm: {obj.get('AlarmName')}",
                f"State: {obj.get('NewStateValue')}",
                obj.get("NewStateReason", ""),
            ]
            return "\n".join([p for p in parts if p])
        return json.dumps(obj, ensure_ascii=False, indent=2)
    except Exception:
        pass
    return f"[{subject}] {message}" if subject else message


def lambda_handler(event, context):
    # デバッグ用：環境変数を確認
    logger.info(f"環境変数確認 - LINE_USER_IDS: {os.environ.get('LINE_USER_IDS')}")
    logger.info(f"環境変数確認 - LINE_USER_ID: {os.environ.get('LINE_USER_ID')}")
    logger.info(f"環境変数確認 - SECRET_NAME: {os.environ.get('SECRET_NAME')}")
    
    system_name = os.environ.get("SYSTEM_NAME", "ErrorNotifier")
    access_token, recipients = _get_settings()

    messages: list[str] = []

    # SNS event (preferred route)
    if isinstance(event, dict) and isinstance(event.get("Records"), list):
        for rec in event["Records"]:
            if rec.get("EventSource") == "aws:sns":
                messages.append(_format_sns_record(rec))
    # Fallback: direct invocation with 'message'
    elif isinstance(event, dict) and event.get("message"):
        messages.append(str(event["message"]))
    else:
        messages.append(json.dumps(event, ensure_ascii=False))

    body = "\n\n---\n\n".join(messages)

    # Send to all recipients
    results = []
    for uid in recipients:
        try:
            prefix = f"[{system_name}] " if system_name else ""
            _send_line(access_token, uid, prefix + body)
            results.append({"user": uid, "result": "ok"})
        except Exception as e:
            logger.error(f"LINE send failed for {uid}: {e}")
            results.append({"user": uid, "error": str(e)})

    return {
        "ok": True,
        "sent": len(results),
        "results": results,
    }

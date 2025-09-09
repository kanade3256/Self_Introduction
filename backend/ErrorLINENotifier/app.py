import os
import json
import logging
import sys
from datetime import datetime, timezone
import boto3
from typing import Tuple, List
from send_message import send_line_message
from secret_loder import load_secret

try:
    import requests  # provided by Lambda Layer
except Exception:
    # Allow local execution without Layer if installed in venv
    pass


logger = logging.getLogger()
logger.setLevel(logging.INFO)


def _get_recipients() -> List[str]:
    try:
        data = load_secret()
    except Exception:
        data = {}
    ids_raw = (
        data.get("LINE_USER_IDS")
        or os.environ.get("LINE_USER_IDS")
        or os.environ.get("LINE_USER_ID")
        or ""
    )
    recipients = [s.strip() for s in str(ids_raw).split(",") if s and str(s).strip()]
    if not recipients:
        raise ValueError("LINE_USER_IDS not found in secret/env")
    return recipients


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
    recipients = _get_recipients()

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

    # 要約作成: 各メッセージの先頭行を集約し、長すぎる場合は省略
    def _summarize_messages(msgs: List[str]) -> str:
        heads: List[str] = []
        for m in msgs:
            try:
                first_non_empty = next((ln.strip() for ln in str(m).splitlines() if ln.strip()), "")
            except Exception:
                first_non_empty = str(m)[:200]
            if first_non_empty:
                heads.append(first_non_empty)
        if not heads:
            return "(詳細情報なし)"
        summary = " / ".join(heads)
        return summary if len(summary) <= 280 else summary[:277] + "..."

    # 送信メッセージ: 日時 + 概要
    now_str = datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds")
    summary = _summarize_messages(messages)
    text_to_send = f"エラー通知\n日時: {now_str}\n概要: {summary}"

    # Send to all recipients
    results = []
    for uid in recipients:
        try:
            prefix = f"[{system_name}] " if system_name else ""
            send_line_message(uid, prefix + text_to_send, system_name)
            results.append({"user": uid, "result": "ok"})
        except Exception as e:
            logger.error(f"LINE send failed for {uid}: {e}")
            results.append({"user": uid, "error": str(e)})

    return {
        "ok": True,
        "sent": len(results),
        "results": results,
    }

import requests
import logging
import os
from backend.common_layer.secret_loader import load_secret

# ロガーの設定
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# ハンドラーが既に存在しない場合のみ追加
if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
    handler.setFormatter(formatter)
    logger.addHandler(handler)

def get_line_access_token():
    """LINE_ACCESS_TOKENを遅延読み込みする"""
    return load_secret().get('LINE_ACCESS_TOKEN')



def send_line_message(user_id: str, message: str, system_name:str):
    """
    LINE にプッシュメッセージを送信する関数。

    :param user_id: LINE ユーザーの ID（文字列）
    :param message: 送信するメッセージ内容
    :return: LINE API のレスポンス（エラー時は辞書）
    """
    if not isinstance(user_id, str):
        logger.error(f"無効な user_id の型: {type(user_id)}. user_id={user_id}")
        return {"error": "user_id は文字列である必要があります"}

    # LINE_ACCESS_TOKENを関数実行時に取得
    line_access_token = get_line_access_token()
    if not line_access_token:
        logger.warning("LINE_ACCESS_TOKEN が未設定です")
        return {"error": "LINE_ACCESS_TOKEN 未設定"}

    url = "https://api.line.me/v2/bot/message/push"
    headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": f"Bearer {line_access_token}"
    }
    payload = {
        "to": user_id,
        "messages": [{"type": "text", "text": message}]
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        if response.status_code == 200:
            logger.info(f"LINE メッセージ送信成功 (ユーザーID: {user_id}, メッセージ: {message})")
        else:
            logger.error(f"LINE メッセージ送信失敗 (ユーザーID: {user_id}, ステータスコード: {response.status_code})")
            return {"error": "LINE メッセージ送信失敗"}
        return response.json()
    except requests.exceptions.RequestException as e:
        logger.error(f"LINE メッセージ送信エラー (ユーザーID: {user_id}): {e}", exc_info=True)
        return {"error": str(e)}

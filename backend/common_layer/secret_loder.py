import boto3
import os
import json

def load_secret():
    secret_name = os.environ.get("SECRET_NAME")

    if not secret_name:
        raise ValueError("SECRET_NAME environment variable is missing.")

    try:
        client = boto3.client("secretsmanager")  # ← region_name は指定しない
        response = client.get_secret_value(SecretId=secret_name)
        return json.loads(response["SecretString"])
    except Exception as e:
        # ローカル開発用のフォールバック: 環境変数から直接読み込み
        print(f"Secrets Manager error: {e}. Falling back to environment variables.")
        line_token = os.environ.get("LINE_ACCESS_TOKEN")
        if not line_token:
            raise ValueError("Neither Secrets Manager nor LINE_ACCESS_TOKEN environment variable is available.")
        return {"LINE_ACCESS_TOKEN": line_token}

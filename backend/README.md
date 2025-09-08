# Backend（AWS SAM / Python）

SNS のメッセージを受け取り、LINE（必要に応じて Slack）へ通知する Lambda 関数を提供します。Python 3.12 を使用し、共通処理は Lambda Layer として `backend/common_layer/` にまとめています。

## 構成

- `backend/ErrorLINENotifier/app.py`
  - エンドポイント。SNS イベントを整形し、LINE へ送信
- `backend/common_layer/`
  - `python/send_message.py`：LINE/Slack 送信処理
  - `python/secret_loder.py`：Secrets Manager からシークレットを取得
  - `requirements.txt`：Layer に同梱する依存（requests）

## 関数の説明

- `ErrorLINENotifier/app.py`
  - ハンドラ: `lambda_handler(event, context)`
  - 受信イベント: SNS（推奨）、もしくは `{ "message": "..." }` の直接実行
  - 環境変数:
    - `SECRET_NAME`（必須）: Secrets Manager のシークレット名
    - `LINE_USER_IDS`（必須）: 送信先 LINE ID（ユーザー/グループ/ルーム）をカンマ区切り
    - `SYSTEM_NAME`（任意）: 通知に付与するシステム名（既定: `ErrorNotifier`）
  - 役割:
    - SNS レコードを結合し本文を作成 → `send_message.send_line_message()` で送信
    - ローカル実行支援として `backend/common_layer/python` を `sys.path` に追加

- `common_layer/python/send_message.py`
  - 依存: `requests`
  - シークレット: `secret_loder.load_secret()` が返す JSON（例）
    - `LINE_ACCESS_TOKEN`（必須）
    - `SLACK_TOKEN`（任意, フォールバック用）
    - `SLACK_CHANNEL`（任意）
  - 関数:
    - `send_line_message(user_id: str, message: str, system_name: str)`
    - `send_slack_message(system_name: str, text: str)`（LINE 失敗時に利用）

- `common_layer/python/secret_loder.py`
  - `SECRET_NAME` を環境変数から読み、`boto3` で Secrets Manager から JSON を取得

## ローカル実行（sam local 推奨）

1) 事前準備
- AWS クレデンシャル有効化（`AWS_PROFILE` など）
- Secrets Manager にシークレット作成（キーは上記）

2) 実行例

```
cd infra
sam build
sam local invoke ErrorLINENotifier \
  --event event.json \
  --env-vars env.json
```

- `infra/env.json`（例）
```json
{
  "ErrorLINENotifier": {
    "SECRET_NAME": "/myapp/line-notifier/secret",
    "LINE_USER_IDS": "Uxxxxxxxxxxxx,gyyyyyyyyyyyy",
    "SYSTEM_NAME": "ErrorNotifier"
  }
}
```
- `infra/event.json`（例）
```json
{ "message": "ローカルテスト: これはテスト通知です" }
```

## デプロイ（SAM）

```
cd infra
sam build
sam deploy \
  --stack-name line-error-notifier \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides \
    StackName=line-error-notifier \
    SecretName=$SECRET_NAME \
    LineUserIds=$LINE_USER_IDS \
    SystemName=$SYSTEM_NAME
```

CI（GitHub Actions）を使う場合は `.github/workflows/infra.yml` を参照してください。

## 補足
- ランタイム: Python 3.12
- Layer 依存: `backend/common_layer/requirements.txt`（`requests`）
- `boto3` は Lambda ランタイムに同梱されています
- 本番は `secretsmanager:GetSecretValue` の IAM を対象シークレット ARN に限定することを推奨

# SelfIntroduction / Frontend + SAM Backend（LINE通知）

このリポジトリは、フロントエンド（静的サイト）と、AWS SAM で管理するバックエンド（SNS→Lambda→LINE 通知）を同一プロジェクト内で分離管理します。デプロイ経路はパス単位（frontend / backend / infra）で完全分離されています。

## ディレクトリ構成

- `frontend/` フロント資産（GitHub Pages で配信）
  - `index.html`, `css/`, `assets/`, `src/`, `js/`, `tsconfig.json`
- `backend/ErrorLINENotifier/` Python Lambda（SNS → LINE 通知）
  - `app.py`（エンドポイント）
- `backend/common_layer/` Lambda Layer（共通ロジック）
  - `python/send_message.py`, `python/secret_loder.py`, `requirements.txt`
- `infra/` AWS SAM テンプレート
  - `template.yaml`（Python 3.12, Layer付き, SNS→Lambda）
- `.github/workflows/` CI 分離
  - `pages.yml`（frontend のみ）
  - `backend.yml`（backend のみ）
  - `infra.yml`（infra のみ、手動デプロイ対応）

## 必要なもの（インストール）

- Python 3.12
- AWS SAM CLI（ビルド/デプロイに使用）
  - macOS: `brew install aws-sam-cli`
  - Windows: `choco install aws-sam-cli` または MSI
  - Linux: `pipx install aws-sam-cli` など
- Docker（任意, `sam local` 実行時に推奨）
- AWS CLI（任意, シークレット作成などに便利）

## .env（ローカル用の例）

リポジトリ直下に `.env` を作成してください（Git追跡はされません）。

```
# AWS
AWS_REGION=ap-northeast-1
AWS_PROFILE=default

# Lambda 実行時の環境変数
SECRET_NAME=/myapp/line-notifier/secret
LINE_USER_IDS=Uxxxxxxxxxxxx,gyyyyyyyyyyyy
SYSTEM_NAME=ErrorNotifier
```

注意: シークレット本体（LINE_ACCESS_TOKEN など）は `.env` に書かず、AWS Secrets Manager に保存します。

## Secrets Manager の準備

通知に使用するシークレット（JSON）を作成します。キー例:

- `LINE_ACCESS_TOKEN`（必須）
- `SLACK_TOKEN`（任意, LINE失敗時のフォールバック）
- `SLACK_CHANNEL`（任意）

AWS CLI 例:

```
aws secretsmanager create-secret \
  --name /myapp/line-notifier/secret \
  --secret-string '{"LINE_ACCESS_TOKEN":"<your-line-channel-access-token>","SLACK_TOKEN":"xoxb-...","SLACK_CHANNEL":"#alerts"}'
```

## SAM ビルド/デプロイ

1) ビルド

```
cd infra
sam build
```

2) デプロイ（初回または更新）

```
sam deploy \
  --stack-name line-error-notifier \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides \
    StackName=line-error-notifier \
    SecretName=$SECRET_NAME \
    LineUserIds=$LINE_USER_IDS \
    SystemName=$SYSTEM_NAME
```

実行には AWS 資格情報（プロファイルまたはOIDC）が必要です。

## ローカルテスト（sam local）

Docker が使える環境で、簡易に動作確認できます。

`env.json`（例）

```
{
  "ErrorLINENotifier": {
    "SECRET_NAME": "/myapp/line-notifier/secret",
    "LINE_USER_IDS": "Uxxxxxxxxxxxx,gyyyyyyyyyyyy",
    "SYSTEM_NAME": "ErrorNotifier"
  }
}
```

`event.json`（例: SNS相当の簡易イベント）

```
{ "message": "ローカルテスト: これはテスト通知です" }
```

実行:

```
cd infra
sam build
sam local invoke ErrorLINENotifier --event event.json --env-vars env.json
```

## CI（GitHub Actions）

- Frontend: `frontend/**` 変更時のみ `pages.yml` が実行され Pages へデプロイ
- Backend: `backend/**` 変更時のみ `backend.yml` が実行
- Infra: `infra/**` 変更時のみ `infra.yml` がビルド。手動実行でデプロイ可能

`infra.yml` 用リポジトリシークレット:

- `AWS_ROLE_TO_ASSUME`: デプロイ用のIAMロールARN
- `AWS_REGION`: 例 `ap-northeast-1`
- `PARAM_SECRET_NAME`: 例 `/myapp/line-notifier/secret`
- `PARAM_LINE_USER_IDS`: 例 `Uxxx,gyyy`
- `PARAM_SYSTEM_NAME`: 例 `ErrorNotifier`

## 補足

- Lambda ランタイム: Python 3.12
- 共通レイヤー: `backend/common_layer/requirements.txt` の依存（`requests`）を同梱
- 直接 Python 実行で試す場合はローカルにも依存を入れてください（簡易テスト）
  - `pip install requests boto3`
- IAM は本番では Secrets Manager の ARN を個別に指定するなど最小権限化してください。

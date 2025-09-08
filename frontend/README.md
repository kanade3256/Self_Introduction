# Frontend（静的サイト / GitHub Pages）

自己紹介・スキル・制作物などを掲載する静的サイトです。HTML/CSS と TypeScript（`tsc`）を使用します。GitHub Pages へのデプロイは `frontend/**` の変更時のみトリガーされます。

## 構成

- `frontend/index.html`：トップページ
- `frontend/css/`：スタイル
- `frontend/assets/`：画像・アイコン
- `frontend/src/main.ts`：TypeScript ソース
- `frontend/js/main.js`：コンパイル後の JS（CI/ローカルで生成）
- `frontend/tsconfig.json`：TypeScript 設定

## ビルド

TypeScript を JS にコンパイルします。

```bash
# 1回だけビルド
npx --yes -p typescript@5 tsc -p frontend/tsconfig.json

# 監視して自動ビルド
npx --yes -p typescript@5 tsc -p frontend/tsconfig.json -w
```

ローカルサーブは任意の静的サーバで可能です。

```bash
# 例: npx serve を使う
npx --yes serve frontend
```

## デプロイ（GitHub Pages / CI）

- `.github/workflows/pages.yml` が `frontend/**` の変更で実行され、`frontend/` の内容を Pages に公開します。
- 追加の設定は不要ですが、独自ドメインやメタ情報の更新は `index.html` を修正してください。

## カスタマイズのヒント

- カラー/テーマ: `frontend/css/style.css` の `:root` と `[data-theme="dark"]`
- セクション追加: `frontend/index.html` に `<section>` を追加し、ヘッダーナビも更新
- 画像: `frontend/assets/` に追加し、HTML 側の参照を更新

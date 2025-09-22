# Frontend (Astro)

自己紹介サイトを Astro で構築しています。GitHub Pages へは `frontend/**` の変更で自動デプロイされます。

## ディレクトリ構成
- `src/pages/`：Astro ページ。トップは `index.astro`、タイムラインや履歴書は `timeline.astro` / `resume.astro`
- `src/layouts/`：共通レイアウト。`Base.astro` がメタ情報とナビゲーションを管理
- `src/data/site.json`：サイト設定（ナビリンク・文言・プロフィール画像パスなど）
- `public/`：公開用の静的アセット（CSS / JS / 画像）
- `dist/`：`npm run build` で生成される成果物
- `index.html`：Go Live 用のリダイレクトページ（ビルド後に `dist/index.html` を開く）

## 開発フロー
```bash
cd frontend
npm install
npm run dev   # http://localhost:4321/
```

## ビルド
```bash
npm run build    # dist/ に静的ファイルを生成
npm run preview  # ビルド内容をローカル確認
```

## Go Live で確認する場合
1. `npm run build` を実行して最新の `dist/` を生成
2. VS Code の Go Live を `frontend` ディレクトリで開始
3. ルートの `index.html` から自動的に `dist/index.html` へ遷移します

## アセットの追加
画像は `public/assets/` に配置して `src/data/site.json` でパスを指定します。`assets/ファイル名` の形式で記述すると環境ごとに適切な相対パスに変換されます。

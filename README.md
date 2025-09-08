# ポートフォリオ テンプレート

モダンで軽量・レスポンシブ・アクセシブルな静的ポートフォリオのひな形です。HTML/CSS に加え、TypeScript で記述しています（出力はプレーン JS）。

## ファイル構成

- `index.html` : トップページ（自己紹介/スキル/制作物/経歴/連絡）
- `css/style.css` : レイアウト、色テーマ（ライト/ダーク）
- `src/main.ts` : テーマ切替、モバイルナビ、現在位置のナビ有効化（TypeScript）
- `js/main.js` : コンパイル済み JavaScript（`tsconfig.json` の出力先）
- `tsconfig.json` : TypeScript 設定
- `assets/avatar.svg` : プロフィール画像のプレースホルダー
- `assets/favicon.svg` : ファビコン

## 使い方

1. `index.html` をブラウザで開くだけで動作します（`js/main.js` はビルド済みを同梱）。
2. 以下をあなたの情報に置き換えてください。
   - タイトル/名前/説明: `index.html:5-7`
   - ヒーロー文言: `index.html:22`
   - スキルタグ: `index.html:48`
   - 制作物カード: `index.html:57`
   - 経歴: `index.html:86`
   - 連絡先メール: `index.html:104`
3. 画像を差し替える場合は `assets/` に追加し、`index.html` の参照を更新します。

## テーマ設定

- 初回は OS の設定（ライト/ダーク）を自動で検出します。
- 右上の「🌓」ボタンで切り替え可能。選択は `localStorage` に保存されます。

## カスタマイズのヒント

- カラーパレット: `css/style.css` の `:root` と `[data-theme="dark"]` セクション
- セクションの追加: `index.html` に `<section>` を追加し、ヘッダーのナビにリンクを増やす
- SNS リンク: ヒーローやフッターにボタンを追加
- 履歴書リンク: `#contact` セクションのボタンの `href` を更新

## 開発/ビルド

- TypeScript を編集する場合は `src/main.ts` を変更し、以下でビルドしてください。
  - すでに TypeScript が入っている環境: `tsc -p .`
  - 未導入の場合: `npm i -D typescript && npx tsc -p .`

## 公開方法

- GitHub Pages, Netlify, Vercel などの静的ホスティングにそのままアップロード可能です。

---
不明点や追加の要望（英語版、ブログ一覧、プロジェクト詳細ページ化など）があればお知らせください。

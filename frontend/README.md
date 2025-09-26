# Frontend (Astro) - ポートフォリオサイト

自己紹介サイトを Astro で構築したポートフォリオサイトです。GitHub Pages へは `frontend/**` の変更で自動デプロイされます。

## 🚀 技術スタック

### メイン技術
- **[Astro](https://astro.build)** `v4.16.19` - 静的サイトジェネレータ
- **TypeScript** - 型安全な開発
- **MDX** - Markdown + JSX でのコンテンツ管理
- **Vanilla CSS** - カスタムプロパティとモダンCSS

### 統合機能
- **[@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/)** - 自動サイトマップ生成
- **[@astrojs/mdx](https://docs.astro.build/en/guides/integrations-guide/mdx/)** - MDXサポート
- **Cross-env** - クロスプラットフォーム環境変数

### パフォーマンス・SEO
- **静的生成** - ビルド時にHTMLを生成
- **画像最適化** - 遅延読み込み・WebP対応
- **SEO最適化** - メタタグ・構造化データ・Open Graph
- **アクセシビリティ** - ARIA属性・セマンティックHTML・フォーカス管理

## 📁 ディレクトリ構成

```
frontend/
├── src/
│   ├── pages/                    # Astroページ（ルーティング）
│   │   ├── index.astro           # トップページ（Hero・About・Projects・Skills・Contact）
│   │   ├── timeline.astro        # タイムライン（経歴・実績）
│   │   ├── resume.astro          # 履歴書・職務経歴書
│   │   └── projects/             # プロジェクト関連ページ
│   │       ├── index.astro       # プロジェクト一覧
│   │       └── [slug].astro      # 個別プロジェクト詳細（動的ルート）
│   ├── layouts/
│   │   └── Base.astro            # 共通レイアウト（ヘッダー・フッター・メタ情報）
│   ├── content/                  # Content Collections（Astroの型安全コンテンツ管理）
│   │   ├── config.ts             # コレクション定義・スキーマ
│   │   ├── pages/                # ページコンテンツ（Markdown）
│   │   └── projects/             # プロジェクトコンテンツ（Markdown）
│   ├── data/
│   │   ├── site.json             # サイト設定（ナビ・プロフィール・連絡先など）
│   │   ├── site.prod.json        # 本番環境専用設定
│   │   └── timeline.ts           # タイムラインデータ（TypeScript）
│   ├── components/               # Astroコンポーネント（共通UI部品）
│   └── assets/                   # ソース画像・アセット
├── public/                       # 静的アセット（直接配信）
│   ├── css/
│   │   └── style.css             # メインスタイルシート
│   ├── js/
│   │   └── main.js               # フロントエンドJavaScript（ナビ・テーマ・i18n・アニメーション）
│   ├── assets/                   # 画像・アイコン
│   │   ├── profile.jpg           # プロフィール画像
│   │   └── og-image.png          # OGP画像
│   ├── robots.txt                # クローラー制御
│   └── sitemap.xml               # 自動生成サイトマップ
├── scripts/                      # ビルド・開発用スクリプト
│   ├── generate-projects.ts      # プロジェクトMarkdown自動生成
│   └── generate-projects.js      # 同上（JS版）
├── dist/                         # ビルド成果物（GitHub Pages配信対象）
├── astro.config.mjs              # Astro設定（サイト・ベースパス・統合機能）
├── package.json                  # 依存関係・スクリプト
├── tsconfig.json                 # TypeScript設定
└── index.html                    # Go Live用リダイレクト
```

## 🎨 ページ構成

### トップページ (`index.astro`)
- **Hero**: プロフィール・キャッチコピー・主要メトリクス・CTA
- **About**: 自己紹介・価値提供の軸
- **Projects**: 注目プロジェクト3選 + 研究ハイライト
- **Experience**: タイムラインプレビュー
- **Skills**: 日次・週次・継続学習の3レイヤー
- **Contact**: お問い合わせリンク

### タイムライン (`timeline.astro`)
- 時系列でまとめた開発・研究・学習の歩み
- プロフィール画像・統計情報
- 年別グルーピング・カテゴリー別フィルタリング

### 履歴書 (`resume.astro`)
- 職歴・学歴・プロフィール情報
- 連絡先・スキル・プロジェクト実績

### プロジェクト一覧 (`projects/index.astro`)
- 全プロジェクトのカード表示
- カテゴリー・タグでのフィルタリング
- メトリクス・成果の可視化

### プロジェクト詳細 (`projects/[slug].astro`)
- 動的ルート（Content Collectionsベース）
- 詳細な技術情報・成果・学習内容
- Markdown + MDX でのリッチなコンテンツ

## ⚙️ 主要機能

### 🌐 多言語対応 (i18n)
- 日本語・英語切り替え
- `main.js` での簡易i18n実装
- `data-i18n` 属性による動的テキスト切り替え

### 🌙 ダークモード
- システム設定・手動切り替え対応
- CSS Custom Properties による統一テーマ管理
- `localStorage` での設定永続化

### 📱 レスポンシブ対応
- モバイルファースト設計
- ハンバーガーメニュー（全画面ドロワー）
- タッチ操作・キーボードナビゲーション対応

### 🎭 インタラクション・アニメーション
- Intersection Observer による表示アニメーション
- スムーズスクロール・パララックス効果
- ホバー・フォーカス状態の細かい調整

### ♿ アクセシビリティ
- ARIA属性・ランドマーク・ロール
- フォーカス管理・スキップリンク
- スクリーンリーダー対応
- セマンティックHTML構造

### 🔍 SEO・パフォーマンス最適化
- 構造化データ（JSON-LD・Person・JobPosting）
- Open Graph・Twitter Cards
- サイトマップ自動生成
- 遅延読み込み・プリロード
- 画像最適化・WebP配信

## 🔧 開発フロー

### 初期設定
```bash
cd frontend
npm install
```

### 開発サーバー
```bash
npm run dev     # http://localhost:4321/SelfIntroduction
npm run start   # 同上（エイリアス）
```

### ビルド
```bash
npm run build        # 通常ビルド
npm run build:github # GitHub Pages用ビルド
npm run build:prod   # 本番環境用ビルド
npm run preview      # ビルド内容をローカル確認
```

### プロジェクト生成
```bash
npm run generate:projects  # タイムラインデータからプロジェクトMarkdownを自動生成
```

## 🌍 デプロイ環境対応

### 環境別設定
- **開発環境**: `site.json` + ベースパス `/SelfIntroduction`
- **GitHub Pages**: `site.json` + 相対パス対応
- **その他本番**: `site.prod.json` + ルートパス

### パス解決の仕組み
- `joinBase()` 関数で環境別パス生成
- 本番環境では相対パス（`./`）強制使用
- 開発環境ではベースパス考慮

### アセット管理
- `astro.config.mjs` でファイル名・配置を制御
- `profile.jpg` は常に同一ファイル名を保持
- ハッシュ化による キャッシュバスティング

## 🗂️ コンテンツ管理

### Content Collections
- **型安全** なMarkdownコンテンツ管理
- Zodスキーマによるバリデーション
- 自動型生成・IntelliSense対応

### データソース
- **Static JSON**: `site.json`（設定・ナビゲーション・プロフィール）
- **TypeScript**: `timeline.ts`（動的データ・計算処理）
- **Markdown**: `content/`（プロジェクト・ページコンテンツ）

### 画像・アセット
- `public/assets/` に配置
- パスは `site.json` で一元管理
- ビルド時に自動最適化・ハッシュ化

## 🛠️ カスタマイズ

### ナビゲーション追加
`src/data/site.json` の `nav` 配列に追加

### 新しいページ作成
1. `src/pages/` に `.astro` ファイル作成
2. `Base.astro` レイアウトを使用
3. 必要に応じて `site.json` のナビに追加

### プロジェクト追加
1. `src/data/timeline.ts` にエントリー追加
2. `npm run generate:projects` でMarkdown自動生成
3. 生成された Markdown ファイルを編集

### スタイル変更
- `public/css/style.css` で CSS Custom Properties を編集
- ダークモード・ライトモード両対応が必要

### JavaScript機能拡張
- `public/js/main.js` で新機能追加
- i18n辞書・イベントハンドラー・アニメーション制御

## 🚨 トラブルシューティング

### Go Live で確認する場合
1. `npm run build` を実行して最新の `dist/` を生成
2. VS Code の Go Live を `frontend` ディレクトリで開始
3. ルートの `index.html` から自動的に `dist/index.html` へ遷移

### 画像が表示されない
- パスが環境に応じて正しく生成されているか確認
- 開発環境: `/SelfIntroduction/assets/profile.jpg`
- 本番環境: `./assets/profile.jpg`

### ナビゲーションが動かない
- JavaScript が読み込まれているか確認
- `main.js` のイベントリスナー登録状況をチェック
- モバイルメニューの DOM 構造が正しいか確認

### ビルドエラー
- TypeScript型エラー: `content/config.ts` のスキーマ確認
- パス解決エラー: `astro.config.mjs` の base/site 設定確認
- 依存関係: `npm install` で最新パッケージ確認

---

**📝 コンテンツ編集について**: 
詳細なコンテンツ編集方法は [CONTENT_EDITING_GUIDE.md](../CONTENT_EDITING_GUIDE.md) を参照してください。

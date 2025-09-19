# Portfolio Site - Content Management Guide

このポートフォリオサイトは**Astro + Markdown**で構築されており、コンテンツを簡単に編集できるようになっています。

## 📁 ディレクトリ構造

```
frontend/
├── src/
│   ├── content/           # 📝 コンテンツファイル（ここを編集）
│   │   ├── pages/         # ページコンテンツ
│   │   │   ├── home.md    # トップページ
│   │   │   └── about.md   # 自己紹介・経歴ページ
│   │   └── projects/      # プロジェクト詳細
│   │       ├── komeda-portal.md
│   │       ├── lab-memo-app.md
│   │       └── walking-data-research.md
│   └── data/
│       └── site.json      # ⚙️ サイト設定（ここを編集）
├── public/                # 静的ファイル
│   ├── css/               # スタイルシート
│   ├── js/                # JavaScript
│   └── assets/            # 画像・アイコン
├── package.json           # 依存関係
└── astro.config.mjs       # Astro設定
```

## ✏️ コンテンツの編集方法

### 1. ページ内容の編集

`frontend/src/content/pages/` 内のMarkdownファイルを編集してください：

#### ホームページ (`home.md`)
```markdown
---
title: "ホーム"
description: "ページの説明"
---

# メインタイトル

ここに内容を書きます。**太字**や*斜体*、リンクなどが使えます。

## セクション見出し

- リスト項目1
- リスト項目2
```

#### 自己紹介ページ (`about.md`)
学歴、経歴、スキルなどの詳細情報を記載できます。

### 2. プロジェクト情報の編集

`frontend/src/content/projects/` 内のMarkdownファイルで各プロジェクトを管理：

```markdown
---
title: "プロジェクト名"
date: 2024-09-01
tags: ["React", "TypeScript", "AWS"]
category: "実務・クラウドDX"
role: "フルスタック開発"
technologies: ["React", "Node.js", "AWS Lambda"]
achievements: ["業務効率化", "コスト削減"]
featured: true
summary: "プロジェクトの概要説明"
links:
  demo: "https://demo.example.com"
  repo: "https://github.com/user/repo"
---

# プロジェクトの詳細

ここにプロジェクトの詳細な説明を書きます。

## 技術的な特徴

- 使用技術1
- 使用技術2

## 成果・学習内容

...
```

### 3. サイト設定の編集

`frontend/src/data/site.json` で全体的な設定を管理：

```json
{
  "siteName": "サイト名",
  "description": "サイトの説明",
  "nav": [
    {
      "label": "メニュー名",
      "href": "#セクション",
      "key": "nav.key"
    }
  ],
  "socials": {
    "github": {
      "url": "https://github.com/username",
      "label": "GitHub"
    }
  },
  "featureFlags": {
    "showContact": true,
    "showProjects": true
  }
}
```

## 🔧 新しいプロジェクトの追加

1. `frontend/src/content/projects/` に新しい `.md` ファイルを作成
2. frontmatter（先頭の`---`で囲まれた部分）に必要な情報を記入
3. 本文にプロジェクトの詳細を記述
4. ファイルを保存

→ サイトに自動的に反映されます！

## 🎨 スタイルの調整

基本的なスタイルは `frontend/public/css/style.css` で定義されています。
色やフォントを変更したい場合は、CSS変数を調整してください。

## 🚀 デプロイ

1. frontendディレクトリで依存関係をインストール：`cd frontend && npm install`
2. 変更をコミット：`git add . && git commit -m "コンテンツ更新"`
3. GitHubにプッシュ：`git push origin main`
4. GitHub Actions が自動的にビルド・デプロイを実行

## 💡 便利な機能

### Markdownの書式

- **太字**: `**テキスト**`
- *斜体*: `*テキスト*`
- リンク: `[表示テキスト](URL)`
- コードブロック: `` ```言語名 `` で囲む
- 画像: `![代替テキスト](画像のパス)`

### frontmatterのオプション

#### ページ用
- `title`: ページタイトル
- `description`: ページ説明（SEO用）
- `layout`: レイアウト（通常は "Base"）

#### プロジェクト用
- `featured`: `true` でトップページに表示
- `tags`: 技術タグの配列
- `links.demo`: デモサイトのURL
- `links.repo`: GitHubリポジトリのURL

## 🎯 編集のコツ

1. **段階的な編集**: 一度に大量の変更をせず、少しずつ編集して確認
2. **プレビュー**: ローカルで `npm run dev` を実行して変更をプレビュー
3. **バックアップ**: 大きな変更の前にはファイルをバックアップ
4. **一貫性**: 同じようなコンテンツは同じフォーマットで統一

## 🆘 トラブルシューティング

### ビルドエラーが出る場合
- frontmatterの YAML 記法が正しいか確認
- 必須フィールドが抜けていないか確認
- ファイル名に日本語が含まれていないか確認

### 画像が表示されない場合
- 画像ファイルが `frontend/public/assets/` に配置されているか確認
- パスが正しいか確認（`/assets/image.jpg` の形式）

### レイアウトが崩れる場合
- CSS のクラス名が正しいか確認
- Markdownの記法が正しいか確認

---

この方法で、HTMLやプログラミングの知識がなくても、Markdownファイルを編集するだけでサイトのコンテンツを更新できます！
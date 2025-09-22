import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// 環境変数による設定の切り替え
const isDev = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// 本番環境でのみbaseパスを設定
const getBaseConfig = () => {
  if (isProduction) {
    return '/SelfIntroduction';
  }
  return undefined; // 開発環境ではbaseパスなし
};

// https://astro.build/config
export default defineConfig({
  site: 'https://kanade3256.github.io',
  base: getBaseConfig(),
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    }
  },
  build: {
    assets: 'assets'
  },
  vite: {
    build: {
      assetsInlineLimit: 0
    }
  }
});
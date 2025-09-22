import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// 環境に応じて設定ファイルを選択
const isProduction = process.env.NODE_ENV === 'production';
const isGitHubPages = process.env.GITHUB_PAGES === 'true' || process.env.DEPLOY_TARGET === 'github-pages';

let siteConfig;
if (isGitHubPages) {
  // GitHub Pages用の設定
  siteConfig = await import('./src/data/site.json').then(m => m.default);
} else if (isProduction) {
  // その他の本番環境用の設定
  siteConfig = await import('./src/data/site.prod.json').then(m => m.default);
} else {
  // 開発環境用の設定
  siteConfig = await import('./src/data/site.json').then(m => m.default);
}

const parsedSiteUrl = (() => {
  try {
    return new URL(siteConfig.siteUrl);
  } catch {
    return new URL('http://localhost/');
  }
})();

// 環境に応じてbaseパスを決定
const derivedBase = (() => {
  if (parsedSiteUrl.pathname === '/') {
    return undefined;
  }
  // GitHub Pagesの場合は設定通り、その他の本番環境では相対パスを使用
  const basePath = parsedSiteUrl.pathname.replace(/\/$/, '');
  
  if (isGitHubPages) {
    return basePath;
  } else if (isProduction) {
    // その他の本番環境では基本的にルートパス
    return undefined;
  } else {
    return basePath;
  }
})();

// https://astro.build/config
export default defineConfig({
  site: parsedSiteUrl.origin + (derivedBase ?? ''),
  base: derivedBase,
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
      assetsInlineLimit: 0,
      rollupOptions: {
        output: {
          // 本番環境でのアセットファイル名を調整
          assetFileNames: (assetInfo) => {
            const extType = assetInfo.name.split('.').at(1);
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              return `assets/[name].[hash][extname]`;
            }
            if (/css/i.test(extType)) {
              return `css/[name][extname]`;
            }
            if (/js/i.test(extType)) {
              return `js/[name][extname]`;
            }
            return `assets/[name].[hash][extname]`;
          },
          chunkFileNames: 'js/[name].[hash].js',
          entryFileNames: 'js/[name].js'
        }
      }
    }
  }
});
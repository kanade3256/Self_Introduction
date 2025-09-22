import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import siteConfig from './src/data/site.json';

const parsedSiteUrl = (() => {
  try {
    return new URL(siteConfig.siteUrl);
  } catch {
    return new URL('http://localhost/');
  }
})();
const derivedBase = parsedSiteUrl.pathname === '/' ? undefined : parsedSiteUrl.pathname.replace(/\/$/, '');

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
      assetsInlineLimit: 0
    }
  }
});
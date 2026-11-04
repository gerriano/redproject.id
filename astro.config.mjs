// @ts-check
import { defineConfig } from 'astro/config';

// SITE_URL / BASE_PATH let the same code build for production (redproject.id, root)
// and for the GitHub Pages staging preview (served under /redproject.id/).
const site = process.env.SITE_URL || 'https://redproject.id';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory', assets: '_astro', inlineStylesheets: 'auto' },
  compressHTML: true,
  image: { responsiveStyles: false },
  devToolbar: { enabled: false },
  // Never inline assets (fonts) as data: URIs; the CSP allows fonts from 'self' only.
  vite: { build: { assetsInlineLimit: 0 } },
});

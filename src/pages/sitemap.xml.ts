import type { APIRoute } from 'astro';

const pages = [
  { path: '/', priority: '1.0' },
  { path: '/about/', priority: '0.8' },
  { path: '/contact/', priority: '0.9' },
  { path: '/privacy/', priority: '0.2' },
];

export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const today = new Date().toISOString().slice(0, 10);
  const urls = pages
    .map((p) => `  <url><loc>${new URL(base + p.path, site).toString()}</loc><lastmod>${today}</lastmod><priority>${p.priority}</priority></url>`)
    .join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};

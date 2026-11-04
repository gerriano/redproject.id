import type { APIRoute } from 'astro';

// Only the production domain is indexable; staging previews are blocked.
export const GET: APIRoute = ({ site }) => {
  const isProd = site?.hostname === 'redproject.id';
  const body = isProd
    ? `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${new URL('/sitemap.xml', site).toString()}\n`
    : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

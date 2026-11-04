// Prefix internal links with the configured base path (root in production,
// /redproject.id/ on the GitHub Pages staging preview).
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function url(path: string): string {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

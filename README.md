# redproject.id

Marketing website for **RED Project**, a 360° digital consultancy. Rebuilt from scratch in
November 2026 after the previous WordPress install was compromised (see
[`docs/legacy/CONTENT-ARCHIVE.md`](docs/legacy/CONTENT-ARCHIVE.md)).

- **Stack:** [Astro](https://astro.build) 5 (static output) · GSAP ScrollTrigger · Lenis
- **No CMS, no database, no plugins.** The build is plain HTML/CSS/JS. The only server-side
  file is the contact form endpoint [`public/api/contact.php`](public/api/contact.php).
- **Hosting:** production on DomaiNesia (`public_html`), staging preview on GitHub Pages.

## Editing content

All copy lives in [`src/data/site.ts`](src/data/site.ts): services, FAQ, numbers, clients,
contact details. Items marked `VERIFY` still need confirmation from RED Project.

| What | Where |
|---|---|
| Text, numbers, FAQ, services | `src/data/site.ts` |
| Client logos (white PNG on transparent) | `src/assets/clients/` + the `clients` list in `site.ts` |
| Hero / section images | `src/assets/hero/` |
| Pages | `src/pages/*.astro` |
| Design tokens (colours, type scale) | `src/styles/global.css` |
| Scroll animation | `src/scripts/motion.ts` |
| Contact form recipient | `RECIPIENT` in `public/api/contact.php` and `email` in `site.ts` |

## Local development

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs dist/
npm run preview    # serves dist/
```

Requires Node 20+. Environment variables are documented in [`.env.example`](.env.example).

## Deployment

| Environment | Trigger | Where |
|---|---|---|
| CI | every push / PR (not main) | build + PHP lint + check that no stray PHP ships |
| Staging | push to `main` | `https://gerriano.github.io/redproject.id/` (form in demo mode, `noindex`) |
| Production | **manual**: Actions → *Deploy production* → type `deploy` | `https://redproject.id` via FTPS |

### One-time setup

1. **GitHub Pages:** Settings → Pages → Source: *GitHub Actions*.
2. **Production secrets** (Settings → Secrets and variables → Actions):
   - `DOMAINESIA_FTP_SERVER`, `DOMAINESIA_FTP_USERNAME`, `DOMAINESIA_FTP_PASSWORD`
   - Create a dedicated FTP account in cPanel whose directory is `public_html`, not the main cPanel login.
   - Optional variable `DOMAINESIA_FTP_DIR` (default `./`, i.e. the FTP account's own folder).
3. **Email:** make sure the mailbox `info@redproject.id` exists in cPanel, and create
   `no-reply@redproject.id` (or a forwarder) so form mail passes SPF/DKIM.
4. **DNS / SSL:** keep the domain on DomaiNesia; enable AutoSSL before the first deploy.

### After the first production deploy, check

- [ ] `https://redproject.id` loads, `http://` and `www.` redirect to it
- [ ] `/about-us/` → `/about/` (301); old article URLs → `/` (301)
- [ ] `/wp-login.php` returns 410
- [ ] `/api/contact.php` in a browser returns *Method not allowed*; any other `.php` returns 403
- [ ] A real form submission arrives in `info@redproject.id` (check spam on the first try)
- [ ] Google Search Console: submit `https://redproject.id/sitemap.xml`, check *Security issues*

## Security model

- Static files only; PHP is denied everywhere except `/api/contact.php` (`public/.htaccess`, `public/api/.htaccess`).
- The endpoint has no database or file uploads; it validates input, strips header-injection
  characters, uses a honeypot + time trap, rate-limits by hashed IP (5/hour) and only sends
  mail to a fixed recipient. It never emails the visitor, so it cannot be abused to spam third parties.
- Security headers (CSP, HSTS, nosniff, frame options) are set in `public/.htaccess`.
- Never restore files from the old WordPress backup to the server.

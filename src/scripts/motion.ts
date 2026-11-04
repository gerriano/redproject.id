import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel) as NodeListOf<T & Element>) as T[];

let lenis: Lenis | null = null;

/* ---------- Smooth scroll (native scroll, eased; no scroll-jacking) ---------- */
function initLenis() {
  if (reduceMotion) return;
  lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

function scrollToTarget(target: string | HTMLElement | number) {
  if (lenis) lenis.scrollTo(target as never, { offset: -80 });
  else if (typeof target === 'number') window.scrollTo({ top: target });
  else {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    el?.scrollIntoView();
  }
}

/* ---------- Text splitting into masked words ---------- */
function splitWords(el: HTMLElement) {
  if (el.dataset.splitDone) return;
  const walk = (node: Node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent ?? '';
        if (!text.trim()) return;
        const frag = document.createDocumentFragment();
        text.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(document.createTextNode(' ')); return; }
          const w = document.createElement('span');
          w.className = 'w';
          const inner = document.createElement('span');
          inner.className = 'w-i';
          inner.textContent = part;
          w.append(inner);
          frag.append(w);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE && (child as Element).tagName !== 'BR') {
        walk(child);
      }
    });
  };
  if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', el.textContent?.replace(/\s+/g, ' ').trim() ?? '');
  walk(el);
  $$('.w', el).forEach((w) => w.setAttribute('aria-hidden', 'true'));
  el.dataset.splitDone = '1';
}

/* ---------- Hero ---------- */
function initHero() {
  const lines = $$('.hero__line-inner');
  const fades = $$('[data-hero-fade]');
  if (!lines.length) return;
  if (reduceMotion) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from(lines, { yPercent: 110, duration: 1.4, stagger: 0.1 }, 0.1)
    .from(fades, { autoAlpha: 0, y: 24, duration: 1.1, stagger: 0.08 }, 0.55);
  const bars = $$('[data-hero-mark] span');
  if (bars.length) {
    tl.from(bars, { scaleX: 0, duration: 1.3, stagger: 0.12, ease: 'expo.inOut' }, 0.25);
    bars.forEach((bar, i) => {
      gsap.to(bar, {
        x: () => ((i - 1) * 0.18 - 0.1) * bar.offsetWidth, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
      });
    });
  }
}

function initCycler() {
  const root = document.querySelector<HTMLElement>('[data-cycler]');
  if (!root) return;
  const words = $$('.cycler__word', root);
  // Reserve width of the longest word so the sentence never reflows.
  const widest = Math.max(...words.map((w) => w.getBoundingClientRect().width));
  root.style.minWidth = `${Math.ceil(widest)}px`;
  if (reduceMotion || words.length < 2) return;
  let i = 0;
  setInterval(() => {
    const cur = words[i];
    i = (i + 1) % words.length;
    const next = words[i];
    cur.classList.remove('is-active');
    cur.classList.add('is-leaving');
    next.classList.remove('is-leaving');
    next.classList.add('is-active');
    setTimeout(() => cur.classList.remove('is-leaving'), 700);
  }, 2200);
}

/* ---------- Scroll reveals ---------- */
function initReveals() {
  const splits = $$('[data-split]');
  splits.forEach(splitWords);

  if (reduceMotion) {
    gsap.set('[data-reveal]', { autoAlpha: 1, y: 0 });
    return;
  }

  if (!splits.length) return revealBlocks();
  gsap.set('[data-split] .w-i', { yPercent: 105 });
  splits.forEach((el) => {
    gsap.to($$('.w-i', el), {
      yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.035,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  revealBlocks();
}

function revealBlocks() {
  if (!document.querySelector('[data-reveal]')) return;
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 90%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.08, overwrite: true }),
  });
}

/* ---------- Parallax band ---------- */
function initParallax() {
  if (reduceMotion) return;
  $$('[data-parallax]').forEach((el) => {
    gsap.fromTo(el, { yPercent: -8 }, {
      yPercent: 8, ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

/* ---------- Pinned horizontal pillars (desktop only) ---------- */
function initPillars() {
  const section = document.querySelector<HTMLElement>('[data-pillars]');
  const track = document.querySelector<HTMLElement>('[data-pillars-track]');
  if (!section || !track || reduceMotion) return;
  const mm = gsap.matchMedia();
  mm.add('(min-width: 1024px)', () => {
    section.classList.add('is-horizontal');
    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        pin: section.querySelector('.pillars__pin') as HTMLElement,
        start: 'top top',
        end: () => `+=${distance()}`,
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });
    ScrollTrigger.refresh();
    return () => { tween.scrollTrigger?.kill(); tween.kill(); gsap.set(track, { clearProps: 'transform' }); section.classList.remove('is-horizontal'); };
  });
}

/* ---------- Counters ---------- */
function initCounters() {
  $$('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count);
    if (reduceMotion || !Number.isFinite(target)) return;
    const obj = { v: 0 };
    el.textContent = '0';
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => gsap.to(obj, { v: target, duration: 1.8, ease: 'power3.out', onUpdate: () => { el.textContent = String(Math.round(obj.v)); } }),
    });
  });
}

/* ---------- Process progress line ---------- */
function initProcess() {
  const line = document.querySelector<HTMLElement>('[data-process-line]');
  const list = document.querySelector<HTMLElement>('[data-process]');
  if (!line || !list || reduceMotion) return;
  gsap.fromTo(line, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: list, start: 'top 80%', end: 'bottom 60%', scrub: true } });
}

/* ---------- Services hover image ---------- */
function initHoverMedia() {
  const media = document.querySelector<HTMLElement>('[data-hover-media]');
  if (!media || !finePointer || reduceMotion) return;
  const imgs = $$('[data-hover-img]', media);
  const xTo = gsap.quickTo(media, 'x', { duration: 0.6, ease: 'power3' });
  const yTo = gsap.quickTo(media, 'y', { duration: 0.6, ease: 'power3' });
  window.addEventListener('pointermove', (e) => { xTo(e.clientX + 24); yTo(e.clientY - 100); }, { passive: true });
  $$('[data-practice]').forEach((row) => {
    row.addEventListener('pointerenter', () => {
      imgs.forEach((img) => img.classList.toggle('is-active', img.dataset.hoverImg === row.dataset.image));
      gsap.to(media, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'power3.out' });
    });
    row.addEventListener('pointerleave', () => gsap.to(media, { autoAlpha: 0, scale: 0.9, duration: 0.3 }));
  });
}

/* ---------- Magnetic buttons + cursor ---------- */
function initMagnetic() {
  if (!finePointer || reduceMotion) return;
  $$('[data-magnetic]').forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.25);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
    });
    el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });
}

function initCursor() {
  const cursor = document.querySelector<HTMLElement>('.cursor');
  if (!cursor || !finePointer || reduceMotion) return;
  const xTo = gsap.quickTo(cursor, 'x', { duration: 0.25, ease: 'power3' });
  const yTo = gsap.quickTo(cursor, 'y', { duration: 0.25, ease: 'power3' });
  window.addEventListener('pointermove', (e) => { cursor.classList.add('is-visible'); xTo(e.clientX); yTo(e.clientY); }, { passive: true });
  document.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));
  const hoverSel = 'a, button, summary, [data-cursor], input, textarea, select, label';
  document.addEventListener('pointerover', (e) => {
    if ((e.target as Element).closest?.(hoverSel)) cursor.classList.add('is-hover');
  });
  document.addEventListener('pointerout', (e) => {
    if ((e.target as Element).closest?.(hoverSel)) cursor.classList.remove('is-hover');
  });
}

/* ---------- Header + mobile menu + anchors ---------- */
function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  let last = 0;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 20);
    const menuOpen = document.documentElement.classList.contains('menu-open');
    header.classList.toggle('is-hidden', !menuOpen && y > 400 && y > last);
    last = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-mobile-menu]');
  if (!toggle || !menu) return;
  const label = toggle.querySelector('.visually-hidden');
  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    if (label) label.textContent = open ? 'Close menu' : 'Open menu';
    menu.hidden = !open;
    document.documentElement.classList.toggle('menu-open', open);
    if (open) { lenis?.stop(); document.body.style.overflow = 'hidden'; }
    else { lenis?.start(); document.body.style.overflow = ''; }
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  $$('[data-menu-link]', menu).forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { setOpen(false); toggle.focus(); } });
}

function initAnchors() {
  document.addEventListener('click', (e) => {
    const a = (e.target as Element).closest?.('a[href*="#"]') as HTMLAnchorElement | null;
    if (!a) return;
    const href = new URL(a.href, location.href);
    if (href.pathname !== location.pathname || !href.hash) return;
    const target = href.hash === '#main' ? 0 : document.querySelector(href.hash);
    if (target === null) return;
    e.preventDefault();
    scrollToTarget(target as HTMLElement | number);
    history.replaceState(null, '', href.hash === '#main' ? location.pathname : href.hash);
  });
}

export function initMotion() {
  (window as unknown as { __motionReady?: boolean }).__motionReady = true;
  initLenis();
  initHeader();
  initAnchors();
  initHero();
  initCycler();
  initReveals();
  initParallax();
  initPillars();
  initCounters();
  initProcess();
  initHoverMedia();
  initMagnetic();
  initCursor();
  // Fonts and images change layout; recalculate trigger positions once they settle.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh());
  if (location.hash && location.hash.length > 1) {
    const el = document.querySelector(location.hash);
    if (el) setTimeout(() => scrollToTarget(el as HTMLElement), 300);
  }
}

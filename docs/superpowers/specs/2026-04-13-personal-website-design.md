# Personal Website — Design

**Date:** 2026-04-13
**Owner:** Leo Schmidt-Traub
**Inspired by:** [nathanchen.me](https://nathanchen.me)

## Goal

A minimal, text-first personal website for Leo Schmidt-Traub (ML/AI researcher). Single scrolling homepage + a blog section. Light/dark theme, restrained typography, and a subtle animated "constellation" background. No easter eggs or hidden interactions.

## Non-goals

RSS feed, CMS, comments, analytics, search, i18n, tag system, newsletter signup. All easy to add later if wanted.

## Stack

- **Astro** (latest stable), static output.
- **No framework integrations** (no React/Vue/Svelte). Astro components only.
- **Fonts:** Inter via `@fontsource/inter` (400/500/600), fall back to system UI sans. Monospace fallback for code (system mono).
- **Package manager:** `npm`.
- **Deploy target:** Any static host (GitHub Pages, Vercel, Netlify, Cloudflare Pages). No host chosen yet — `npm run build` produces `dist/`.

## Directory layout

```
personal-website/
├─ src/
│  ├─ layouts/
│  │   └─ BaseLayout.astro
│  ├─ components/
│  │   ├─ Constellation.astro
│  │   ├─ ThemeToggle.astro
│  │   ├─ PostList.astro
│  │   └─ SiteHeader.astro
│  ├─ pages/
│  │   ├─ index.astro
│  │   ├─ writing/index.astro
│  │   └─ writing/[...slug].astro
│  ├─ content/
│  │   ├─ config.ts
│  │   └─ posts/
│  │       └─ hello-world.md
│  └─ styles/
│      └─ global.css
├─ public/
│   └─ favicon.svg
├─ astro.config.mjs
├─ tsconfig.json
├─ package.json
├─ .gitignore
└─ README.md
```

## Pages

### `/` — Homepage

Single scrolling page. Centered column, `max-width: 640px`, body `17px` desktop / `15px` mobile, line-height `1.6`.

Sections, top to bottom:

1. **Site header** — `leo schmidt-traub` wordmark (left), theme toggle (right). Rendered inline at the top of the page (not sticky).
2. **Intro** — `hi, i'm leo 👋` heading, then two short paragraphs: (a) who I am and what I work on (ML/AI research, general), (b) a `currently:` line. Copy is placeholder and editable in `index.astro`.
3. **Writing** — heading "Writing". Up to 5 most recent posts as rows: `title` left, `MMM YYYY` date right-aligned, thin bottom border between rows. Each row is a link to `/writing/[slug]`. Final row: `see all →` → `/writing`.
4. **Projects** — heading "Projects". 2–4 plain rows: `**project-name** — one-liner.` Optional external link on the name. Data lives as an array in `index.astro`.
5. **Elsewhere** — heading "Elsewhere". Inline row of links: email (`mailto:`), GitHub, LinkedIn. Email and handles are placeholders.

Initial paint has a subtle CSS fade-up (~400ms) on the main column. No JS required for the fade.

### `/writing` — Post index

Full list of all non-draft posts. Grouped by year (most recent first). Within each year, rows are `title` left / `MMM D` right. Back-to-home link at top.

### `/writing/[...slug]` — Post

Rendered markdown. Narrow prose column (`max-width: 640px`). Title + date at top. Markdown renders with Astro's default markdown pipeline, plus:

- Headings auto-generate ids (for future anchor links).
- Inline code and fenced code blocks styled via `global.css`. Astro's built-in Shiki highlighter stays on with a minimal theme (`css-variables`) so colors adapt to light/dark.
- Images full-width within the column.

Footer: `← back to writing`.

## Content model

`src/content/config.ts` defines one collection: `posts`.

Frontmatter schema (zod):

| field | type | required | notes |
|---|---|---|---|
| `title` | string | yes | |
| `description` | string | no | Used for `<meta description>` and list preview (optional). |
| `date` | date | yes | |
| `draft` | boolean | no, default `false` | Drafts excluded from prod builds. |

Slug = filename (Astro default). One seed post: `hello-world.md`.

## Theme

CSS custom properties on `:root` for each mode. Toggle adds `data-theme="light"` or `data-theme="dark"` to `<html>`.

**Dark (default):**
- `--bg`: `#121212`
- `--fg`: `#e0e0e0`
- `--muted`: `rgba(224, 224, 224, 0.55)`
- `--line`: `rgba(224, 224, 224, 0.08)`
- `--accent`: `#7aa7ff`

**Light:**
- `--bg`: `#f7f7f5`
- `--fg`: `#1a1a1a`
- `--muted`: `rgba(26, 26, 26, 0.55)`
- `--line`: `rgba(26, 26, 26, 0.08)`
- `--accent`: `#3a63c4`

**Selection logic:**
1. Inline `<script>` in `<head>` (runs before paint) reads `localStorage.theme`; if absent, uses `matchMedia('(prefers-color-scheme: dark)')`. Sets `data-theme` on `<html>` immediately.
2. `ThemeToggle.astro` renders a button that flips `data-theme` and writes `localStorage.theme`.
3. No flash-of-wrong-theme: achieved by the pre-paint inline script.

## Constellation background

`Constellation.astro` renders a `<canvas>` fixed to the viewport, behind content:

- CSS: `position: fixed; inset: 0; z-index: -1; pointer-events: none;`
- Sized to `window.innerWidth/Height`, DPR-aware (`canvas.width = w * dpr`, scale context).
- Resize handler (debounced 150ms).
- ~60 dots (scaled down on narrow viewports: `Math.min(60, floor(width * height / 18000))`).
- Each dot: `{x, y, vx, vy}`; velocity range `[-0.15, 0.15]`; bounces off viewport edges.
- Each frame: update positions; for every pair within `140px`, draw a line with alpha `1 - dist/140` at `0.12 * --fg`. Draw dots at ~`0.7` of `--fg` alpha, radius `1.3px`.
- Colors derived by reading `getComputedStyle(document.documentElement).getPropertyValue('--fg')` and composing `rgba()` — re-read on theme change via a `MutationObserver` on `html[data-theme]`.
- `prefers-reduced-motion: reduce` → skip `requestAnimationFrame` loop; render a single static frame.
- No external libraries. Inline `<script>` in the component, ~60 lines.

## Styling

Single `src/styles/global.css`:

- CSS reset (minimal — margin/padding, box-sizing).
- Typography tokens (sizes, weights).
- Theme tokens (above).
- Utility-free: components use scoped styles or plain selectors in `global.css`. No Tailwind.
- Focus styles: visible outline using `--accent` for keyboard nav (a11y).

## Accessibility

- All links have discernible text (no icon-only links without `aria-label`).
- Theme toggle has `aria-label` describing action.
- Color contrast ≥ WCAG AA in both themes for `--fg` on `--bg` and `--muted` on `--bg`.
- Canvas has `aria-hidden="true"`.
- `prefers-reduced-motion` respected (background + intro fade).

## Error handling

- Missing frontmatter on a post → build fails (zod schema). Desired: catch authoring mistakes at build.
- Draft posts → excluded via `filter` in `getCollection('posts')` for `/writing` and `/writing/[...slug]`.
- Unknown slug → Astro default 404 page (with a minimal custom `src/pages/404.astro` showing "not found — back home").

## Testing / verification

No unit tests (static site, UI-only). Verification is:

1. `npm run build` succeeds with zero errors/warnings.
2. `npm run dev` and manual walkthrough:
   - `/` renders intro, writing list (includes seed post), projects, links.
   - Theme toggle flips theme; reloads persist it; no flash-of-wrong-theme.
   - `/writing` lists the seed post.
   - `/writing/hello-world` renders.
   - 404 at `/does-not-exist` shows custom 404.
3. Lighthouse (dev build, desktop): Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95.
4. Reduced motion: toggle OS setting → background goes static, intro fade skipped.
5. Responsive: renders cleanly at 375px, 768px, 1440px widths.

## Out of scope (explicit)

- RSS / JSON feed.
- Tag or category system on posts.
- Comments, reactions, analytics.
- Search.
- Newsletter / email capture.
- Internationalization.
- CMS or admin UI.
- Per-post OG images.
- Hosting / deployment configuration (separate step once content is ready).

## Open questions (deferred — placeholders used)

1. Final bio copy (currently placeholder).
2. Specific ML/AI focus area — kept general for now.
3. Real project entries — placeholders in initial build.
4. Email address and social handles — placeholders in initial build.
5. Hosting choice — deferred until site is content-ready.

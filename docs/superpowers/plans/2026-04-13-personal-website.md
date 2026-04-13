# Personal Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a minimal static personal website (homepage + blog) for Leo Schmidt-Traub, inspired by nathanchen.me: centered ~640px column, light/dark theme, constellation background, Astro-based.

**Architecture:** Astro static site. One base layout, a handful of `.astro` components, one Markdown content collection for blog posts. Theme + background implemented with ~60 lines of JS total, no external runtime libraries.

**Tech Stack:** Astro (latest stable), TypeScript, `@fontsource/inter`, Shiki (built into Astro) for code blocks. `npm` for package management. No React/Vue/Svelte integrations.

**Testing note:** This is a UI-only static site. Each task verifies via `npm run build` or manual browser check at `http://localhost:4321` — no unit tests. Final verification task walks all pages in both themes.

**Spec:** `docs/superpowers/specs/2026-04-13-personal-website-design.md`

---

## File map

| Path | Purpose |
|---|---|
| `package.json`, `astro.config.mjs`, `tsconfig.json` | Project scaffold. |
| `public/favicon.svg` | Static favicon. |
| `src/styles/global.css` | Reset, typography, theme tokens (light/dark), base element styles. |
| `src/layouts/BaseLayout.astro` | `<html>`/`<head>`, pre-paint theme script, font import, renders `SiteHeader`, `Constellation`, `<slot/>`. |
| `src/components/ThemeToggle.astro` | Button that flips `data-theme` and persists to `localStorage`. |
| `src/components/Constellation.astro` | `<canvas>` drifting-dots background. |
| `src/components/SiteHeader.astro` | Top bar: wordmark + theme toggle. |
| `src/components/PostList.astro` | Renders an array of posts as `title — date` rows. Reused on homepage and `/writing`. |
| `src/content/config.ts` | Zod schema for `posts` collection. |
| `src/content/posts/hello-world.md` | Seed post. |
| `src/pages/index.astro` | Homepage sections. |
| `src/pages/writing/index.astro` | Post index grouped by year. |
| `src/pages/writing/[...slug].astro` | Post detail. |
| `src/pages/404.astro` | Custom 404. |
| `README.md` | Quick usage (dev, build). |

---

## Task 1: Scaffold Astro project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `README.md`
- Modify: `.gitignore` (ensure `node_modules/`, `dist/`, `.astro/`)

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "personal-website",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "astro": "^4.16.0",
    "@fontsource/inter": "^5.1.0"
  }
}
```

- [ ] **Step 2: Create `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://example.com',
  markdown: {
    shikiConfig: {
      theme: 'css-variables',
      wrap: true,
    },
  },
});
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": ["src/**/*", ".astro/types.d.ts"],
  "exclude": ["dist"]
}
```

- [ ] **Step 4: Verify `.gitignore` contents**

Run: `cat .gitignore`
Expected output includes `node_modules/`, `dist/`, `.astro/`, `.superpowers/`.
If any line is missing, append it.

- [ ] **Step 5: Install dependencies**

Run: `npm install`
Expected: completes without errors; creates `node_modules/` and `package-lock.json`.

- [ ] **Step 6: Create `README.md`**

```markdown
# personal-website

Leo Schmidt-Traub's personal site. Built with [Astro](https://astro.build).

## Develop

    npm install
    npm run dev        # http://localhost:4321

## Build

    npm run build      # outputs to ./dist
    npm run preview    # serve the production build locally
```

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json README.md .gitignore
git commit -m "Scaffold Astro project"
```

---

## Task 2: Global styles with theme tokens

**Files:**
- Create: `src/styles/global.css`

- [ ] **Step 1: Create `src/styles/global.css`**

```css
/* ---------- reset ---------- */
*, *::before, *::after { box-sizing: border-box; }
html, body, h1, h2, h3, h4, p, ul, ol, li, figure, blockquote {
  margin: 0;
  padding: 0;
}
ul, ol { list-style: none; }
a { color: inherit; text-decoration: none; }
img, svg, canvas { display: block; max-width: 100%; }
button {
  font: inherit;
  color: inherit;
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
}

/* ---------- theme tokens ---------- */
:root,
html[data-theme="dark"] {
  --bg: #121212;
  --fg: #e0e0e0;
  --fg-rgb: 224, 224, 224;
  --muted: rgba(var(--fg-rgb), 0.55);
  --line: rgba(var(--fg-rgb), 0.08);
  --accent: #7aa7ff;
}
html[data-theme="light"] {
  --bg: #f7f7f5;
  --fg: #1a1a1a;
  --fg-rgb: 26, 26, 26;
  --muted: rgba(var(--fg-rgb), 0.55);
  --line: rgba(var(--fg-rgb), 0.08);
  --accent: #3a63c4;
}

/* ---------- base ---------- */
html { color-scheme: dark light; }
body {
  background: var(--bg);
  color: var(--fg);
  font-family: 'Inter', system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  font-size: 17px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
}
@media (max-width: 640px) {
  body { font-size: 15px; }
}

h1, h2, h3 { font-weight: 500; letter-spacing: -0.005em; }
h1 { font-size: 1.6rem; }
h2 { font-size: 1.25rem; }
h3 { font-size: 1rem; }

a { color: var(--fg); border-bottom: 1px solid var(--line); transition: border-color .15s; }
a:hover { border-bottom-color: var(--fg); }

:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 2px; }

/* ---------- layout helpers ---------- */
.container {
  max-width: 640px;
  margin: 0 auto;
  padding: 0 24px;
}

.section { margin: 40px 0; }
.section-label {
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 10px;
}
.row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 6px 0;
  border-bottom: 1px solid var(--line);
}
.row:last-child { border-bottom: 0; }
.row .date { color: var(--muted); white-space: nowrap; }

/* ---------- fade-in ---------- */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
.fade-in { animation: fadeUp 400ms ease-out both; }
@media (prefers-reduced-motion: reduce) {
  .fade-in { animation: none; }
}

/* ---------- prose (blog posts) ---------- */
.prose h1 { font-size: 1.8rem; margin-bottom: 8px; }
.prose .post-date { color: var(--muted); margin-bottom: 32px; }
.prose p, .prose ul, .prose ol { margin: 1em 0; }
.prose ul, .prose ol { padding-left: 1.4em; }
.prose ul { list-style: disc; }
.prose ol { list-style: decimal; }
.prose h2 { margin: 1.6em 0 .6em; }
.prose h3 { margin: 1.4em 0 .5em; }
.prose code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.9em;
  background: var(--line);
  padding: 0.1em 0.35em;
  border-radius: 3px;
}
.prose pre {
  padding: 14px 16px;
  border-radius: 6px;
  overflow-x: auto;
  border: 1px solid var(--line);
  background: rgba(var(--fg-rgb), 0.03);
}
.prose pre code { background: none; padding: 0; }
.prose blockquote {
  border-left: 2px solid var(--line);
  padding-left: 16px;
  color: var(--muted);
}
.prose img { margin: 1.5em 0; border-radius: 4px; }

/* Shiki css-variables theme hookup */
:root {
  --astro-code-color-text: var(--fg);
  --astro-code-color-background: transparent;
  --astro-code-token-comment: var(--muted);
  --astro-code-token-keyword: var(--accent);
  --astro-code-token-string: var(--fg);
  --astro-code-token-function: var(--accent);
  --astro-code-token-constant: var(--fg);
  --astro-code-token-parameter: var(--fg);
  --astro-code-token-punctuation: var(--muted);
  --astro-code-token-link: var(--accent);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/global.css
git commit -m "Add global styles with light/dark theme tokens"
```

---

## Task 3: BaseLayout with pre-paint theme script

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `public/favicon.svg`

- [ ] **Step 1: Create `public/favicon.svg`**

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <circle cx="16" cy="16" r="6" fill="#7aa7ff"/>
</svg>
```

- [ ] **Step 2: Create `src/layouts/BaseLayout.astro`**

```astro
---
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Leo Schmidt-Traub — ML/AI researcher.' } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="description" content={description} />
    <title>{title}</title>

    <!-- Pre-paint theme script: runs before paint to avoid flash. -->
    <script is:inline>
      (function () {
        try {
          var stored = localStorage.getItem('theme');
          var prefers = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          var theme = stored || prefers;
          document.documentElement.setAttribute('data-theme', theme);
        } catch (_) {
          document.documentElement.setAttribute('data-theme', 'dark');
        }
      })();
    </script>
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 3: Build to verify scaffold compiles**

Run: `npm run build`
Expected: "Complete!" with no errors. `dist/` contains built files (currently no pages, so this may warn about no pages — proceed if only warning is that).

- [ ] **Step 4: Commit**

```bash
git add src/layouts/BaseLayout.astro public/favicon.svg
git commit -m "Add BaseLayout with pre-paint theme bootstrap"
```

---

## Task 4: ThemeToggle component

**Files:**
- Create: `src/components/ThemeToggle.astro`

- [ ] **Step 1: Create `src/components/ThemeToggle.astro`**

```astro
---
---
<button id="theme-toggle" type="button" aria-label="Toggle color theme">
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"></path>
  </svg>
</button>

<style>
  #theme-toggle {
    color: var(--muted);
    padding: 4px 6px;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    transition: color .15s, background .15s;
  }
  #theme-toggle:hover { color: var(--fg); background: var(--line); }
</style>

<script is:inline>
  (function () {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var cur = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      var next = cur === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (_) {}
      // Notify listeners (Constellation) that the theme changed.
      document.dispatchEvent(new CustomEvent('themechange', { detail: next }));
    });
  })();
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ThemeToggle.astro
git commit -m "Add ThemeToggle component"
```

---

## Task 5: Constellation background component

**Files:**
- Create: `src/components/Constellation.astro`

- [ ] **Step 1: Create `src/components/Constellation.astro`**

```astro
---
---
<canvas id="constellation" aria-hidden="true"></canvas>

<style>
  #constellation {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    pointer-events: none;
  }
</style>

<script is:inline>
  (function () {
    var canvas = document.getElementById('constellation');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var dpr = Math.max(1, window.devicePixelRatio || 1);
    var w = 0, h = 0;
    var dots = [];
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function fgRgb() {
      var v = getComputedStyle(document.documentElement).getPropertyValue('--fg-rgb').trim();
      return v || '224, 224, 224';
    }
    var rgb = fgRgb();

    function resize() {
      var rect = { w: window.innerWidth, h: window.innerHeight };
      w = rect.w; h = rect.h;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      var target = Math.min(60, Math.floor((w * h) / 18000));
      dots = [];
      for (var i = 0; i < target; i++) {
        dots.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
        });
      }
    }

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    });

    document.addEventListener('themechange', function () { rgb = fgRgb(); });

    function render(animate) {
      ctx.clearRect(0, 0, w, h);
      if (animate) {
        for (var i = 0; i < dots.length; i++) {
          var d = dots[i];
          d.x += d.vx; d.y += d.vy;
          if (d.x < 0 || d.x > w) d.vx *= -1;
          if (d.y < 0 || d.y > h) d.vy *= -1;
        }
      }
      // lines
      for (var i = 0; i < dots.length; i++) {
        for (var j = i + 1; j < dots.length; j++) {
          var a = dots[i], b = dots[j];
          var dx = a.x - b.x, dy = a.y - b.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            var alpha = (1 - dist / 140) * 0.12;
            ctx.strokeStyle = 'rgba(' + rgb + ',' + alpha + ')';
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      // dots
      ctx.fillStyle = 'rgba(' + rgb + ',0.7)';
      for (var k = 0; k < dots.length; k++) {
        var p = dots[k];
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
      if (animate) requestAnimationFrame(function () { render(true); });
    }

    resize();
    render(!reduceMotion);
  })();
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Constellation.astro
git commit -m "Add Constellation background"
```

---

## Task 6: SiteHeader component

**Files:**
- Create: `src/components/SiteHeader.astro`

- [ ] **Step 1: Create `src/components/SiteHeader.astro`**

```astro
---
import ThemeToggle from './ThemeToggle.astro';
---
<header class="site-header container">
  <a href="/" class="wordmark">leo schmidt-traub</a>
  <ThemeToggle />
</header>

<style>
  .site-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 20px;
    padding-bottom: 20px;
  }
  .wordmark {
    font-size: 13px;
    color: var(--muted);
    border-bottom: 0;
    transition: color .15s;
  }
  .wordmark:hover { color: var(--fg); }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SiteHeader.astro
git commit -m "Add SiteHeader component"
```

---

## Task 7: Content collection schema and seed post

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/posts/hello-world.md`

- [ ] **Step 1: Create `src/content/config.ts`**

```ts
import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
```

- [ ] **Step 2: Create `src/content/posts/hello-world.md`**

```markdown
---
title: hello, world
description: first post — testing the pipeline.
date: 2026-04-13
---

this is the first post on the site. it exists mainly so the blog pipeline
has something to render. replace or delete at will.

## why a blog

i think out loud better when i write things down. occasionally what i write
is useful to others — that's a bonus.

## a code sample

```ts
function add(a: number, b: number): number {
  return a + b;
}
```

more to come.
```

- [ ] **Step 3: Verify schema compiles**

Run: `npm run build`
Expected: build succeeds. Astro will generate `.astro/` types based on the collection.

- [ ] **Step 4: Commit**

```bash
git add src/content/config.ts src/content/posts/hello-world.md
git commit -m "Add posts content collection and seed post"
```

---

## Task 8: PostList component

**Files:**
- Create: `src/components/PostList.astro`

- [ ] **Step 1: Create `src/components/PostList.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';

interface Props {
  posts: CollectionEntry<'posts'>[];
  dateFormat?: 'short' | 'long';
}

const { posts, dateFormat = 'short' } = Astro.props;

function fmt(d: Date) {
  const opts: Intl.DateTimeFormatOptions =
    dateFormat === 'long'
      ? { year: 'numeric', month: 'short', day: 'numeric' }
      : { year: 'numeric', month: 'short' };
  return d.toLocaleDateString('en-US', opts).toLowerCase();
}
---
<ul class="post-list">
  {posts.map((p) => (
    <li>
      <a href={`/writing/${p.slug}`} class="row">
        <span>{p.data.title}</span>
        <span class="date">{fmt(p.data.date)}</span>
      </a>
    </li>
  ))}
</ul>

<style>
  .post-list { margin: 0; }
  .post-list .row { border-bottom: 1px solid var(--line); }
  .post-list a { border-bottom: 0; }
  .post-list a:hover span:first-child { border-bottom: 1px solid var(--fg); }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PostList.astro
git commit -m "Add PostList component"
```

---

## Task 9: Homepage

**Files:**
- Create: `src/pages/index.astro`

- [ ] **Step 1: Create `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import SiteHeader from '../components/SiteHeader.astro';
import Constellation from '../components/Constellation.astro';
import PostList from '../components/PostList.astro';
import { getCollection } from 'astro:content';

const posts = (await getCollection('posts', ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
const recent = posts.slice(0, 5);

const projects: { name: string; blurb: string; href?: string }[] = [
  { name: 'project one', blurb: 'a short one-liner about what it is and why.' },
  { name: 'project two', blurb: 'a short one-liner about what it is and why.' },
];

const links = [
  { label: 'email', href: 'mailto:you@example.com' },
  { label: 'github', href: 'https://github.com/lschmidt-traub' },
  { label: 'linkedin', href: 'https://www.linkedin.com/in/your-handle' },
];
---
<BaseLayout title="leo schmidt-traub">
  <Constellation />
  <SiteHeader />

  <main class="container fade-in">
    <section class="section">
      <h1>hi, i'm leo 👋</h1>
      <p>
        i'm a machine learning researcher. i care about building models that are
        useful, honest, and a little beautiful. i sometimes write about what i'm
        learning.
      </p>
      <p>
        currently: based in [place], reading [book], building [project].
      </p>
    </section>

    <section class="section">
      <div class="section-label">Writing</div>
      <PostList posts={recent} />
      {posts.length > recent.length && (
        <p style="margin-top:10px;"><a href="/writing">see all →</a></p>
      )}
    </section>

    <section class="section">
      <div class="section-label">Projects</div>
      <ul>
        {projects.map((p) => (
          <li class="row">
            <span>
              {p.href
                ? <a href={p.href}><strong>{p.name}</strong></a>
                : <strong>{p.name}</strong>}
              <span class="muted"> — {p.blurb}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>

    <section class="section">
      <div class="section-label">Elsewhere</div>
      <div class="links-row">
        {links.map((l) => <a href={l.href}>{l.label}</a>)}
      </div>
    </section>

    <footer class="section" style="color: var(--muted); font-size: 12px;">
      © {new Date().getFullYear()} leo schmidt-traub
    </footer>
  </main>
</BaseLayout>

<style>
  h1 { margin-bottom: 12px; }
  p { margin-bottom: 14px; }
  strong { font-weight: 500; }
  .muted { color: var(--muted); }
  .links-row { display: flex; gap: 18px; flex-wrap: wrap; }
</style>
```

- [ ] **Step 2: Start dev server and verify**

Run: `npm run dev`
Open: `http://localhost:4321`
Expected: homepage renders with intro, writing section (showing "hello, world"), projects, elsewhere links. Theme toggle flips dark↔light. Constellation visible behind content.
Stop the dev server (Ctrl-C) before continuing.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "Add homepage"
```

---

## Task 10: Writing index page

**Files:**
- Create: `src/pages/writing/index.astro`

- [ ] **Step 1: Create `src/pages/writing/index.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import SiteHeader from '../../components/SiteHeader.astro';
import Constellation from '../../components/Constellation.astro';
import { getCollection } from 'astro:content';

const posts = (await getCollection('posts', ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

const byYear = new Map<number, typeof posts>();
for (const p of posts) {
  const y = p.data.date.getFullYear();
  if (!byYear.has(y)) byYear.set(y, []);
  byYear.get(y)!.push(p);
}
const years = Array.from(byYear.keys()).sort((a, b) => b - a);

function fmt(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toLowerCase();
}
---
<BaseLayout title="writing — leo schmidt-traub">
  <Constellation />
  <SiteHeader />

  <main class="container fade-in">
    <p style="margin: 8px 0 32px;"><a href="/">← home</a></p>
    <h1 style="margin-bottom: 24px;">writing</h1>

    {years.map((year) => (
      <section class="section">
        <div class="section-label">{year}</div>
        <ul>
          {byYear.get(year)!.map((p) => (
            <li class="row">
              <a href={`/writing/${p.slug}`} style="border-bottom:0;">{p.data.title}</a>
              <span class="date">{fmt(p.data.date)}</span>
            </li>
          ))}
        </ul>
      </section>
    ))}

    {posts.length === 0 && <p style="color: var(--muted);">nothing yet.</p>}
  </main>
</BaseLayout>
```

- [ ] **Step 2: Verify**

Run: `npm run dev`
Open: `http://localhost:4321/writing`
Expected: page renders with "2026" label and the seed post listed. Back-home link works.
Stop dev server.

- [ ] **Step 3: Commit**

```bash
git add src/pages/writing/index.astro
git commit -m "Add writing index page"
```

---

## Task 11: Post detail page

**Files:**
- Create: `src/pages/writing/[...slug].astro`

- [ ] **Step 1: Create `src/pages/writing/[...slug].astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import SiteHeader from '../../components/SiteHeader.astro';
import Constellation from '../../components/Constellation.astro';
import { getCollection, type CollectionEntry } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.map((post) => ({ params: { slug: post.slug }, props: { post } }));
}

interface Props { post: CollectionEntry<'posts'>; }
const { post } = Astro.props;
const { Content } = await post.render();

const dateStr = post.data.date.toLocaleDateString('en-US', {
  year: 'numeric', month: 'long', day: 'numeric',
}).toLowerCase();
---
<BaseLayout title={`${post.data.title} — leo schmidt-traub`} description={post.data.description}>
  <Constellation />
  <SiteHeader />

  <main class="container fade-in">
    <p style="margin: 8px 0 32px;"><a href="/writing">← writing</a></p>

    <article class="prose">
      <h1>{post.data.title}</h1>
      <div class="post-date">{dateStr}</div>
      <Content />
    </article>

    <p style="margin: 48px 0 24px;"><a href="/writing">← writing</a></p>
  </main>
</BaseLayout>
```

- [ ] **Step 2: Verify**

Run: `npm run dev`
Open: `http://localhost:4321/writing/hello-world`
Expected: post renders — title, date, body, code block with Shiki highlighting that adapts to the theme. Back-links work.
Stop dev server.

- [ ] **Step 3: Commit**

```bash
git add "src/pages/writing/[...slug].astro"
git commit -m "Add post detail page"
```

---

## Task 12: Custom 404 page

**Files:**
- Create: `src/pages/404.astro`

- [ ] **Step 1: Create `src/pages/404.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import SiteHeader from '../components/SiteHeader.astro';
import Constellation from '../components/Constellation.astro';
---
<BaseLayout title="not found — leo schmidt-traub">
  <Constellation />
  <SiteHeader />
  <main class="container fade-in" style="padding-top: 80px; text-align: center;">
    <h1 style="margin-bottom: 12px;">not found</h1>
    <p style="color: var(--muted); margin-bottom: 24px;">this page doesn't exist (or hasn't been written yet).</p>
    <p><a href="/">← home</a></p>
  </main>
</BaseLayout>
```

- [ ] **Step 2: Verify**

Run: `npm run build && npm run preview`
Open: `http://localhost:4321/does-not-exist`
Expected: custom 404 page renders.
Stop preview server.

- [ ] **Step 3: Commit**

```bash
git add src/pages/404.astro
git commit -m "Add custom 404 page"
```

---

## Task 13: Final verification pass

**Files:** none — this task only runs and inspects.

- [ ] **Step 1: Clean production build**

Run: `rm -rf dist && npm run build`
Expected: "Complete!" with no errors. `dist/index.html`, `dist/writing/index.html`, `dist/writing/hello-world/index.html`, `dist/404.html` exist.

Verify with:
Run: `ls dist dist/writing`
Expected: shows the above files.

- [ ] **Step 2: Preview and walk all pages in dark mode**

Run: `npm run preview`
Open `http://localhost:4321` and verify:
- Homepage: intro, writing list (1 post), projects, elsewhere links.
- `/writing`: seed post listed under "2026".
- `/writing/hello-world`: post renders, code block highlighted.
- `/does-not-exist`: custom 404.
- Constellation visible on every page.

- [ ] **Step 3: Toggle to light mode and re-walk**

Click the theme toggle on the homepage.
Expected:
- Theme flips to light.
- Reload the page — theme persists (no flash of dark).
- Constellation dots/lines now use dark-on-light colors.
- Navigate to `/writing/hello-world` — Shiki code colors adapt to light theme.

- [ ] **Step 4: Reduced-motion check**

Enable OS reduced motion (macOS: System Settings → Accessibility → Display → Reduce motion; Linux: varies). Reload.
Expected: constellation renders a single static frame (no animation). Intro fade does not play.
Disable reduced motion after verifying.

- [ ] **Step 5: Responsive check**

Open browser devtools. Test widths 375px, 768px, 1440px on homepage and post page.
Expected: content stays centered within 640px column; no horizontal scroll; font size drops to 15px below 640px viewport.

- [ ] **Step 6: Lighthouse**

In Chrome devtools → Lighthouse, run desktop audit against `http://localhost:4321`.
Expected thresholds: Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95.
If any score is below 95, note the audit warnings and fix what's actionable (common issues: missing `lang`, contrast — both already addressed).

Stop preview server.

- [ ] **Step 7: Final commit if anything changed**

Run: `git status`
If clean: skip commit.
If dirty (from Lighthouse-driven fixes): `git add -A && git commit -m "Final verification fixes"`.

- [ ] **Step 8: Tag v0.1**

```bash
git tag v0.1
git log --oneline
```

Expected: clean commit history, v0.1 tag on the HEAD commit.

---

## Summary

After Task 13, the site is complete per spec:

- Homepage with intro, writing, projects, elsewhere.
- Blog at `/writing` + `/writing/[slug]`, Markdown-authored, Shiki-highlighted.
- Light/dark theme with no flash, persisted to `localStorage`.
- Constellation background that adapts to theme and respects `prefers-reduced-motion`.
- Custom 404.
- Accessible (focus rings, aria-label on toggle, aria-hidden on canvas).
- Lighthouse ≥ 95 across Perf/A11y/BP.

Content placeholders (bio copy, project entries, email, socials) are clearly marked and easy to fill in. Hosting is deferred per spec.

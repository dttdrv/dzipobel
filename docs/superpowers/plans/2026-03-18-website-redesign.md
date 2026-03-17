# Website Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fully rework dzipobel from a warm editorial design to a Light Frost monochrome aesthetic with micro-interactions, floating pill nav, merged landing/catalog, and single-column detail pages.

**Architecture:** Complete CSS rewrite (monochrome palette, frosted glass, new typography scale), restructured Astro pages (merge catalogs into `/`, simplify detail pages to single-column), lightweight JS for 3D card tilt and scroll reveals. All existing content schemas and build pipeline unchanged.

**Tech Stack:** Astro 6, TypeScript, CSS custom properties, vanilla JS for interactions, View Transitions API via Astro ClientRouter.

**Scope note:** The spec mentions a lightweight animation library for spring physics and magnetic cursor. This plan uses vanilla JS with `IntersectionObserver` and CSS transforms for 3D card tilt and scroll reveals — keeping the bundle at zero added dependencies. Spring physics and magnetic cursor can be added as a follow-up if the vanilla implementation feels insufficient.

**Branch note:** This plan should be executed on a feature branch. Intermediate commits will have a broken UI as HTML structure is updated to match the new CSS.

**Spec:** `docs/superpowers/specs/2026-03-18-website-redesign-design.md`

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `src/styles/global.css` | Rewrite | Complete design system: monochrome palette, typography, nav, switcher, card grid, detail, footer, mobile, animations |
| `src/layouts/BaseLayout.astro` | Rewrite | Floating pill nav (`дзі | ⌕`), blurred orbs, footer with credit, updated meta colors, font loading |
| `src/pages/index.astro` | Rewrite | Merged landing+catalog: hero, switcher, theme filter chips, literature card grid, grammar list, search |
| `src/pages/literatura/[slug].astro` | Modify | Single-column detail, remove sidebar/motifs/conflicts, back link to `/`, data-driven CTA label |
| `src/pages/bulgarski/[slug].astro` | Modify | Single-column detail, remove sidebar/bullets/tags, back link to `/` |
| `src/scripts/interactions.ts` | Create | 3D card tilt on hover, scroll-triggered fade-in reveals, search expand/collapse |
| `src/lib/library.ts` | Modify | Remove `sortLibraryItems` call in `buildLibraryIndex` (order comes from content `order` field) |
| `src/lib/library.test.ts` | Modify | Update test expectations for new sort behavior |
| `tests/e2e/smoke.spec.ts` | Rewrite | Update all selectors/assertions for new page structure |
| `src/pages/literatura/index.astro` | Delete | Catalog merged into `/` |
| `src/pages/bulgarski/index.astro` | Delete | Catalog merged into `/` |

---

### Task 1: Design System — CSS Rewrite

**Files:**
- Rewrite: `src/styles/global.css`

- [ ] **Step 1: Write the new CSS custom properties and reset**

Replace the entire `:root` block, dark mode block, and base element styles with the new monochrome Light Frost palette:

```css
:root {
  color-scheme: light dark;
  --bg: #fafafa;
  --surface: rgba(255, 255, 255, 0.7);
  --surface-strong: rgba(255, 255, 255, 0.9);
  --text: #111111;
  --muted: #666666;
  --soft: #999999;
  --line: rgba(0, 0, 0, 0.06);
  --line-strong: rgba(0, 0, 0, 0.08);
  --shadow: 0 8px 32px rgba(0, 0, 0, 0.04);
  --shadow-hover: 0 12px 40px rgba(0, 0, 0, 0.06);
  --serif: "Literata", Georgia, serif;
  --sans: "Manrope", system-ui, sans-serif;
  --page-width: min(1380px, 100vw);
  --page-padding: clamp(20px, 4vw, 48px);
  --transition: 200ms cubic-bezier(0.2, 0.8, 0.2, 1);
  --radius-card: 16px;
  --radius-input: 14px;
  --radius-pill: 999px;
}
```

Dark mode:
```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0a0a0a;
    --surface: rgba(255, 255, 255, 0.05);
    --surface-strong: rgba(255, 255, 255, 0.08);
    --text: #f0f0f0;
    --muted: #999999;
    --soft: #666666;
    --line: rgba(255, 255, 255, 0.06);
    --line-strong: rgba(255, 255, 255, 0.08);
    --shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    --shadow-hover: 0 12px 40px rgba(0, 0, 0, 0.4);
  }
}
```

- [ ] **Step 2: Write base element styles, nav, and hero styles**

New base styles (simplified body background, no radial gradients, no body::before stripe overlay), `.site-shell`, floating `.nav` pill, `.nav-brand`, `.nav-search`, `.nav-expanded` (search open state), `.hero`, `.hero-headline`, `.hero-sub`, `.hero-orb` ambient blurred circles.

- [ ] **Step 3: Write switcher, filter chips, and card grid styles**

`.switcher-bar`, `.switcher`, `.switcher-btn` (segmented control), `.filter-bar`, `.filter-chip` (theme pills), `.card-grid` (3-col grid with 1px gap, `border-radius: 16px`, overflow hidden), `.card-item` (editorial card: genre kicker + title + author only), hover states.

- [ ] **Step 4: Write grammar list, detail page, and footer styles**

`.grammar-list`, `.grammar-item` (row with title + excerpt + arrow), `.detail-header`, `.detail-content` (single column, max-width 680px), `.detail-section`, `.back-link`, `.btn`, `.btn-primary`, `.btn-ghost`, `.footer`, `.footer-credit`.

- [ ] **Step 5: Write animation keyframes, responsive breakpoints, and reduced-motion**

`@keyframes fadeIn` (opacity + translateY), `@keyframes drift` (ambient orb movement), `.reveal` class, stagger delays, breakpoint at 720px (2-col cards, full-width switcher, scrollable filter chips, stacked footer), `prefers-reduced-motion`, `[hidden]` utility.

- [ ] **Step 6: Verify CSS parses correctly**

Run: `npm run build`
Expected: Build succeeds (CSS is valid). Pages may render incorrectly since HTML structure hasn't been updated yet — that's expected.

- [ ] **Step 7: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: rewrite CSS to Light Frost monochrome design system"
```

---

### Task 2: Layout — New Nav, Footer, and Meta

**Files:**
- Rewrite: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Rewrite BaseLayout.astro**

Replace entire file. Key changes:
- Remove `navItems` array (no nav links, just brand + search)
- Update `<meta name="theme-color">` to `#fafafa` (light) / `#0a0a0a` (dark)
- Update Google Fonts URL: keep Literata at `400;700` and Manrope at `400;500;700` (drop unused weights)
- Replace `.topbar` with floating `.nav` pill containing brand `дзі` (link to `/`) and search icon `⌕`
- Remove `.site-aura` divs (replaced by `.hero-orb` elements within pages)
- Update footer: `дзі` brand left, "Направено от Деян Тодоров · @dttdrv" right with Instagram link
- Keep `<ClientRouter />` for View Transitions
- Keep `viewport-fit=cover` for edge-to-edge

```astro
---
import { ClientRouter } from "astro:transitions";
import "../styles/global.css";

const { title, description } = Astro.props;
---
<!doctype html>
<html lang="bg">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="color-scheme" content="light dark" />
    <meta name="generator" content={Astro.generator} />
    <meta name="description" content={description} />
    <meta name="theme-color" content="#fafafa" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,400;7..72,700&family=Manrope:wght@400;500;700&display=swap"
      rel="stylesheet"
    />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" href="/favicon.ico" />
    <title>{title}</title>
    <ClientRouter />
  </head>
  <body>
    <div class="site-shell">
      <header class="nav" id="site-nav">
        <a href="/" class="nav-brand" aria-label="ДЗИ библиотека">дзі</a>
        <button class="nav-search" aria-label="Търсене" data-search-toggle>⌕</button>
      </header>

      <main>
        <slot />
      </main>

      <footer class="footer">
        <a href="/" class="footer-brand">дзі</a>
        <span class="footer-credit">
          Направено от Деян Тодоров ·
          <a href="https://www.instagram.com/dttdrv/" target="_blank" rel="noreferrer">@dttdrv</a>
        </span>
      </footer>
    </div>
  </body>
</html>
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds. Detail pages will show errors until they're updated — check for no TypeScript errors in BaseLayout itself.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: rewrite BaseLayout with floating pill nav and footer credit"
```

---

### Task 3: Library — Fix Sort Order

**Files:**
- Modify: `src/lib/library.ts`
- Modify: `src/lib/library.test.ts`

- [ ] **Step 1: Update library.test.ts — change expectations for order-based sorting**

Find the test that checks sorted output from `buildLibraryIndex`. Update it to expect items in insertion order (the `order` field order from content), not alphabetical. The function should return items in the order they're given, not re-sort them.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test`
Expected: FAIL — `buildLibraryIndex` currently sorts alphabetically via `sortLibraryItems`.

- [ ] **Step 3: Update buildLibraryIndex to preserve insertion order**

In `src/lib/library.ts:121`, change:
```typescript
return sortLibraryItems([...literature, ...grammar]);
```
to:
```typescript
return [...literature, ...grammar];
```

The `sortLibraryItems` function can remain exported (it's a utility), but `buildLibraryIndex` no longer calls it.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/library.ts src/lib/library.test.ts
git commit -m "fix: preserve content order in library index instead of alphabetical sort"
```

---

### Task 4: Detail Pages — Single Column

**Files:**
- Modify: `src/pages/literatura/[slug].astro`
- Modify: `src/pages/bulgarski/[slug].astro`

- [ ] **Step 1: Rewrite literatura/[slug].astro**

Key changes:
- Remove `motifs` and `conflicts` variables (lines 21-22) — these are no longer rendered
- Back link href: change from `/literatura/` to `/`
- Back link text: `← Литература`
- Remove `<div class="detail-grid">` and `<aside class="detail-rail">` — all content in single column
- CTA buttons: use `entry.data.readSource` for ghost button label (data-driven)
- Remove the "Пълен текст" summary card
- Wrap all content sections in `<div class="detail-content">` (max-width 680px)
- Use new CSS classes: `.detail-header`, `.detail-content`, `.detail-section`, `.detail-kicker`, `.detail-title`, `.detail-author`, `.btn`, `.btn-primary`, `.btn-ghost`
- Remove `pathname={Astro.url.pathname}` from `<BaseLayout>` call (prop no longer exists)

- [ ] **Step 2: Rewrite bulgarski/[slug].astro**

Key changes:
- Remove `bullets` and `tags` variables (lines 21-22) — sidebar removed
- Back link href: change from `/bulgarski/` to `/`
- Back link text: `← Български`
- Remove `<div class="detail-grid">` and `<aside class="detail-rail">`
- Remove "Кратък преговор" and "Ключови думи" sidebar cards
- Wrap sections in `<div class="detail-content">`
- Use new CSS classes matching the redesign
- Remove `pathname={Astro.url.pathname}` from `<BaseLayout>` call (prop no longer exists)

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds. Detail pages now render single-column.

- [ ] **Step 4: Commit**

```bash
git add src/pages/literatura/[slug].astro src/pages/bulgarski/[slug].astro
git commit -m "feat: simplify detail pages to single-column layout"
```

---

### Task 5: Landing Page — Merged Catalog

**Files:**
- Rewrite: `src/pages/index.astro`

- [ ] **Step 1: Write the frontmatter — fetch and prepare all data**

```astro
---
import { getCollection, type CollectionEntry } from "astro:content";
import BaseLayout from "../layouts/BaseLayout.astro";

const literatureEntries: CollectionEntry<"literature">[] = (
  await getCollection("literature")
).sort((a, b) => a.data.order - b.data.order);

const grammarEntries: CollectionEntry<"grammar">[] = (
  await getCollection("grammar")
).sort((a, b) => a.data.order - b.data.order);

const themes = [...new Set(literatureEntries.map((e) => e.data.theme))];
---
```

- [ ] **Step 2: Write the hero section**

Left-aligned compact hero with headline "Подготви се за матурата.", subtitle, and ambient blurred orbs:

```html
<section class="hero">
  <div class="hero-orb hero-orb--1" aria-hidden="true"></div>
  <div class="hero-orb hero-orb--2" aria-hidden="true"></div>
  <h1 class="hero-headline">Подготви се<br>за матурата.</h1>
  <p class="hero-sub">Безплатна библиотека с произведения и граматика за ДЗИ, 12 клас.</p>
</section>
```

- [ ] **Step 3: Write the switcher and filter bar**

Segmented control + theme filter chips (literature view only):

```html
<div class="switcher-bar" data-landing-root>
  <div class="switcher">
    <button class="switcher-btn active" data-switch="literature">Литература</button>
    <button class="switcher-btn" data-switch="grammar">Български език</button>
  </div>
</div>

<div class="filter-bar" data-filters>
  <button class="filter-chip active" data-theme="">Всички</button>
  {themes.map((theme) => (
    <button class="filter-chip" data-theme={theme}>{theme}</button>
  ))}
</div>
```

- [ ] **Step 4: Write the literature card grid**

3-column grid with 1px divider gaps, editorial cards (genre + title + author only), ordered by `order` field:

```html
<section class="section" data-section="literature">
  <div class="card-grid" data-card-grid>
    {literatureEntries.map((entry) => (
      <a
        href={`/literatura/${entry.id}/`}
        class="card-item"
        data-card
        data-theme={entry.data.theme}
        data-search-text={`${entry.data.title} ${entry.data.author} ${entry.data.genre} ${entry.data.theme} ${entry.data.tags.join(" ")}`.toLocaleLowerCase("bg-BG")}
      >
        <span class="card-genre">{entry.data.genre}</span>
        <h2 class="card-title">{entry.data.title}</h2>
        <span class="card-author">{entry.data.author}</span>
      </a>
    ))}
  </div>
  <p class="empty-state" data-empty hidden>Няма резултати.</p>
</section>
```

- [ ] **Step 5: Write the grammar list**

Row list with title + excerpt + arrow:

```html
<section class="section" data-section="grammar" hidden>
  <div class="grammar-list">
    {grammarEntries.map((entry) => (
      <a href={`/bulgarski/${entry.id}/`} class="grammar-item" data-card data-search-text={`${entry.data.title} ${entry.data.module} ${entry.data.excerpt} ${entry.data.tags.join(" ")}`.toLocaleLowerCase("bg-BG")}>
        <div>
          <span class="grammar-title">{entry.data.title}</span>
          <span class="grammar-desc">{entry.data.excerpt}</span>
        </div>
        <span class="grammar-arrow" aria-hidden="true">→</span>
      </a>
    ))}
  </div>
</section>
```

- [ ] **Step 6: Write the inline script for switcher, filter, and search**

Vanilla JS `<script is:inline>`:
- Switcher toggles `[data-section]` visibility via `hidden` attribute. When switching to grammar, hide filter chips. Reset active filter to "Всички" on tab switch.
- Filter chips filter `[data-card]` elements by matching `data-theme` attribute. "Всички" (empty `data-theme`) clears the filter.
- Nav search button triggers search expand in nav — when text is entered, filter visible `[data-card]` elements by checking `data-search-text.includes(query)`. Search AND theme filter both applied simultaneously.
- Show/hide `[data-empty]` when zero cards visible.
- Re-init on `astro:page-load` for View Transitions.

- [ ] **Step 7: Verify build and dev server**

Run: `npm run build && npm run dev`
Expected: Build succeeds. Dev server shows the new landing page with working switcher, filters, and search.

- [ ] **Step 8: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: rebuild landing page with switcher, theme filters, and merged catalog"
```

---

### Task 6: Delete Old Catalog Pages & Fix Route Tests

**Files:**
- Delete: `src/pages/literatura/index.astro`
- Delete: `src/pages/bulgarski/index.astro`
- Modify: `tests/routes.spec.ts`

- [ ] **Step 1: Delete the old catalog pages**

```bash
rm src/pages/literatura/index.astro src/pages/bulgarski/index.astro
```

- [ ] **Step 2: Update tests/routes.spec.ts**

Remove the two assertions that check for the deleted catalog index pages (lines 10-11). The test should only assert that `src/pages/index.astro` exists:

```typescript
import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";

describe("site routes", () => {
  it("defines the required top-level pages", () => {
    const rootDir = process.cwd();
    expect(existsSync(join(rootDir, "src", "pages", "index.astro"))).toBe(true);
  });
});
```

- [ ] **Step 3: Verify build and tests**

Run: `npm run build && npm run test`
Expected: Build succeeds. Unit tests pass (including updated route test).

- [ ] **Step 4: Commit**

```bash
git add -u src/pages/literatura/index.astro src/pages/bulgarski/index.astro && git add tests/routes.spec.ts
git commit -m "chore: remove old catalog pages and update route tests"
```

---

### Task 7: Interactions Script

**Files:**
- Create: `src/scripts/interactions.ts`
- Modify: `src/layouts/BaseLayout.astro` (add script import)

- [ ] **Step 1: Write the interactions script**

Create `src/scripts/interactions.ts` with three modules:

**a) Scroll reveal** — IntersectionObserver that adds `.revealed` class to `.reveal` elements when they enter viewport (threshold 0.1). Once revealed, unobserve.

**b) 3D card tilt** — On `mousemove` over `.card-item` elements, calculate cursor position relative to card center, apply `transform: perspective(600px) rotateX(Xdeg) rotateY(Ydeg)` where rotation is proportional to offset (max ±4deg). On `mouseleave`, reset transform with transition. Only apply if `prefers-reduced-motion` is not `reduce`.

**c) Search expansion** — `[data-search-toggle]` click toggles the nav between collapsed (brand + icon) and expanded (brand + input + close) states. When on a detail page (not `/`), clicking search navigates to `/` with `?search=1` param. On landing page, expanding search adds an input field inline in the nav.

**d) Init function** — Single `init()` that sets up all three. Called on `DOMContentLoaded` and `astro:page-load`.

- [ ] **Step 2: Import the script in BaseLayout**

Add to `BaseLayout.astro`, before `</body>`:
```astro
<script>
  import "../scripts/interactions";
</script>
```

- [ ] **Step 3: Verify in dev server**

Run: `npm run dev`
Expected: Cards tilt on hover, sections fade in on scroll, search toggle works.

- [ ] **Step 4: Commit**

```bash
git add src/scripts/interactions.ts src/layouts/BaseLayout.astro
git commit -m "feat: add 3D card tilt, scroll reveals, and search expansion interactions"
```

---

### Task 8: Update E2E Tests

**Files:**
- Rewrite: `tests/e2e/smoke.spec.ts`

- [ ] **Step 1: Rewrite smoke tests for new page structure**

Update all 4 tests:

**Test 1 — Home page** (was: checks for old headline/CTAs):
- Navigate to `/`
- Assert: headline "Подготви се за матурата." visible
- Assert: switcher buttons "Литература" and "Български език" visible
- Assert: footer credit "@dttdrv" link visible
- Assert: at least 12 `[data-card]` elements visible (literature cards)

**Test 2 — Literature filtering** (was: navigated to `/literatura/`):
- Navigate to `/` (catalog is now on landing)
- Click the theme filter chip "Любов"
- Assert: only 3 visible `[data-card]` elements (3 works per theme)

**Test 3 — Grammar section** (was: navigated to `/bulgarski/`):
- Navigate to `/`
- Click the "Български език" switcher button
- Assert: 3 `.grammar-item` elements visible
- Assert: filter chips are hidden

**Test 4 — Literature detail** (unchanged route):
- Navigate to `/literatura/vyara/`
- Assert: heading "Вяра" visible
- Assert: back link "Литература" visible and links to `/`
- Assert: external reading link visible

**Test 5 — Grammar detail** (new test):
- Navigate to `/bulgarski/morfologiya/`
- Assert: heading "Морфология" visible
- Assert: back link "Български" visible and links to `/`
- Assert: at least 1 section heading visible

- [ ] **Step 2: Run e2e tests**

Run: `npm run build && npm run test:e2e`
Expected: All 4 tests PASS.

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/smoke.spec.ts
git commit -m "test: update e2e tests for redesigned page structure"
```

---

### Task 9: Full Verification

- [ ] **Step 1: Run the full verify suite**

Run: `npm run verify`

This runs: `test → lint → typecheck → build → check:asset-size → test:e2e`

Expected: All checks PASS. Build output stays under 25 MiB Cloudflare limit.

- [ ] **Step 2: Manual visual check in dev server**

Run: `npm run dev`

Check in browser:
- Light mode: monochrome palette, frosted nav, card grid, working switcher + filters + search
- Dark mode: inverted palette, same layout
- Mobile (responsive): 2-col cards, scrollable filter chips, full-width switcher, edge-to-edge
- Detail page: single-column, back link works, content renders
- Page transitions: smooth crossfades via View Transitions

- [ ] **Step 3: Final commit if any fixes needed**

Only if `verify` or visual check reveals issues — fix and commit.

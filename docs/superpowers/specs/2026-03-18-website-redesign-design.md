# dzipobel Website Redesign — Design Spec

## Overview

Full visual rework of dzipobel, a free Bulgarian 12th-grade exam prep library. The redesign shifts from a warm editorial aesthetic to a **Light Frost monochrome** direction — bright, airy, frosted surfaces, neutral black/white/gray palette, with rich micro-interactions and a lightweight animation library.

**References**: Apple.com + Notion.so — friendly yet premium, generous whitespace, subtle motion.

---

## Design Decisions

| Decision | Choice |
|----------|--------|
| Visual direction | Light Frost — bright backgrounds, frosted white panels, soft shadows |
| Color palette | Neutral monochrome — no accent color, hierarchy via weight/size/opacity |
| Animations | Micro-interactions everywhere — 3D card tilt, magnetic cursor, spring physics, morphing states |
| Animation approach | Lightweight animation library (~3-5KB) + CSS transitions + View Transitions API |
| Landing page hero | Minimal & instant — clean headline + subtitle, no CTAs, fade-in |
| Dark mode | Yes, auto-switching via prefers-color-scheme |
| Page structure | Landing page merges with home — single page with switcher for Lit/BG sections |
| Separate catalog pages | Eliminated — landing IS the catalog |
| Nav | Floating pill: `дзі | ⌕` — brand (home link) + search icon only |
| Cards | Stripped-down editorial: genre kicker + title + author only. 1px-gap grid, not floating glass. |
| Detail pages | Single-column, no sidebar. Back link → kicker → title → content sections |
| Detail sidebar | Removed entirely (no Накратко, no Мотиви, no Конфликти — data dropped, not relocated) |
| Card ordering | By content `order` field (curated editorial sequence), not alphabetical |
| Literature filters | 4 theme chips: Любов, Вяра и надеждата, Трудът и творчеството, Изборът и раздвоението |
| Grammar filters | None (only 3 items, no filtering needed) |
| Footer credit | "Направено от Деян Тодоров · @dttdrv" with Instagram link |
| Mobile | Edge-to-edge with safe-area insets (Android + iOS) |

---

## Design System

### Colors

**Light mode** (`prefers-color-scheme: light`):
```
--bg: #fafafa
--surface: rgba(255, 255, 255, 0.7)
--surface-strong: rgba(255, 255, 255, 0.9)
--text: #111111
--muted: #666666
--soft: #999999
--line: rgba(0, 0, 0, 0.06)
--line-strong: rgba(0, 0, 0, 0.08)
--shadow: 0 8px 32px rgba(0, 0, 0, 0.04)
--shadow-hover: 0 12px 40px rgba(0, 0, 0, 0.06)
```

**Dark mode** (`prefers-color-scheme: dark`):
```
--bg: #0a0a0a
--surface: rgba(255, 255, 255, 0.05)
--surface-strong: rgba(255, 255, 255, 0.08)
--text: #f0f0f0
--muted: #999999
--soft: #666666
--line: rgba(255, 255, 255, 0.06)
--line-strong: rgba(255, 255, 255, 0.08)
--shadow: 0 8px 32px rgba(0, 0, 0, 0.3)
--shadow-hover: 0 12px 40px rgba(0, 0, 0, 0.4)
```

### Typography

- **Display** (hero headline): `Literata` serif, `clamp(2.5rem, 6vw, 3.5rem)`, weight 700, letter-spacing `-0.04em`, line-height `1.05`
- **Card title**: `Literata` serif, `17px`, weight 700, letter-spacing `-0.02em`
- **Section/grammar title**: `Literata` serif, `17px`, weight 700
- **Detail title**: `Literata` serif, `36px → clamp(1.75rem, 4vw, 2.25rem)`, weight 700
- **Detail section heading**: `Literata` serif, `16px`, weight 700
- **Body text**: `Manrope` sans, `14px`, weight 400, line-height `1.8`
- **Genre kicker**: `Manrope` sans, `10px`, weight 500, uppercase, letter-spacing `0.08em`
- **Author/meta**: `Manrope` sans, `12px`, weight 400
- **Subtitle**: `Manrope` sans, `15px`, weight 400, line-height `1.6`
- **Footer credit**: `Manrope` sans, `11px`

### Spacing

- Page max-width: `1380px` (unchanged)
- Page padding: `clamp(20px, 4vw, 48px)`
- Section padding: `20px [page-padding] 36px`
- Card grid gap: `1px` (divider lines, not spacing)
- Card internal padding: `24px 22px`
- Border radius: `16px` (card grid container), `14px` (filter field), `999px` (pills, nav, buttons)

### Blur & Glass

- Nav: `backdrop-filter: blur(20px)`, `background: rgba(255,255,255,0.6)`
- Surfaces (when used): `backdrop-filter: blur(16px)`, `background: rgba(255,255,255,0.7)`
- Background orbs: `filter: blur(60px)`, subtle gray radial gradients

---

## Page Architecture

### Routes (simplified)

| Route | Purpose |
|-------|---------|
| `/` | Landing + catalog (hero, switcher, filters, card grid) |
| `/literatura/[slug]/` | Literature detail page |
| `/bulgarski/[slug]/` | Grammar detail page |

**Removed routes**: `/literatura/` and `/bulgarski/` catalog pages (merged into `/`)

### Navigation — Floating Pill

- Fixed position, centered, `top: 16px`, z-index above content
- Content: `дзі` brand mark (links to `/`) + `⌕` search icon
- Pill shape: `border-radius: 999px`, frosted glass background
- On search click: pill expands smoothly to include a text input field + `✕` close button (width transition 300ms)
- On scroll past hero: gains stronger shadow/blur (subtle transition)
- **Search behavior**: The nav search filters the currently visible card grid on the landing page. It searches across the active switcher tab only (literature titles/authors when on Литература, grammar titles when on Български). On detail pages, clicking search navigates back to `/` with the search field focused.
- Search works alongside theme filter chips — both are applied simultaneously (AND logic)

### Landing Page (`/`)

**Scroll sequence:**

1. **Hero** (compact, not full viewport):
   - Left-aligned headline: "Подготви се за матурата." in Literata serif
   - Subtitle below in Manrope: "Безплатна библиотека с произведения и граматика за ДЗИ, 12 клас."
   - No CTAs — content immediately follows
   - 2-3 subtle blurred gray orbs drifting slowly in background (`@keyframes drift`, ~20s)
   - Entrance: headline fades in (`opacity 0→1, translateY 12px→0`, 600ms), subtitle follows 150ms later

2. **Switcher bar**:
   - Segmented control: `Литература | Български език`
   - Active segment: filled black pill with white text
   - Inactive: transparent with muted text
   - Switching animates the content below via CSS opacity/transform transitions (not View Transitions API — this is a same-page interaction)
   - When switching tabs, the active theme filter resets to "Всички"

3. **Filter chips** (Literature view only):
   - `Всички` (default active) · `Любов` · `Вяра и надеждата` · `Трудът и творчеството` · `Изборът и раздвоението`
   - `Всички` maps to clearing the filter (no filterValue), NOT passing "Всички" as a string
   - Active chip: black fill, white text
   - Inactive: transparent, muted border
   - Clicking a chip filters the card grid below (real-time, no page reload)
   - Mobile: horizontally scrollable
   - **Empty state**: When search or filter yields zero results, show centered muted text "Няма резултати" in place of the grid

4. **Card grid** (Literature view):
   - 3 columns desktop → 2 columns mobile
   - Cards ordered by content `order` field (curated editorial sequence)
   - Cards separated by `1px` divider lines (grid with background color showing through gaps)
   - Container has `border-radius: 16px` with overflow hidden
   - Each card: genre kicker (uppercase) → title (Literata serif) → author (muted)
   - Hover: background shifts slightly darker, card tilts toward cursor (3D perspective via JS)
   - Click navigates to detail page

5. **Grammar list** (Bulgarian view):
   - Vertical list with `1px` dividers
   - Each row: `title` field (Literata serif) + `excerpt` field as description (muted) on left, arrow `→` on right
   - Hover: background shifts, arrow translates right 3px
   - Click navigates to grammar detail

6. **Footer**:
   - `дзі` brand on left, "Направено от Деян Тодоров · @dttdrv" on right
   - Instagram handle links to `https://instagram.com/dttdrv`
   - Separated from content by `1px` top border

### Detail Pages (`/literatura/[slug]/`, `/bulgarski/[slug]/`)

**Single-column layout** — no sidebar, no rail.

1. **Back link**: `← Литература` or `← Български` — links to `/` (not deleted catalog routes). Animated arrow slides left on hover.
2. **Header**: Genre/module kicker (uppercase) → Title in Literata 36px → Author/module in muted
3. **CTAs** (literature only): Filled black "Прочети пълния текст ↗" + ghost button using `entry.data.readSource` as label (data-driven, not hardcoded)
4. **Content sections**: Separated by `1px` borders, each with Literata heading + Manrope body text
   - Literature: За автора, За произведението, Послание, + any dynamic `sections[]` from JSON. **Motifs and conflicts are NOT rendered** — dropped entirely.
   - Grammar: Dynamic `sections[]` from JSON with bullet lists
5. **Footer**: Same as landing

**Content width**: Max `680px` for optimal reading line length.

---

## Animations & Micro-interactions

### Animation Library

Use a lightweight JS animation library (~3-5KB) for:
- 3D card tilt on hover (perspective transform tracking cursor position)
- Spring-based transitions (natural motion curves)
- Scroll-triggered reveals via IntersectionObserver

### CSS Animations

- **Hero entrance**: `fadeIn` 600ms — `opacity 0→1, translateY 12px→0`
- **Card grid stagger**: Cards fade in with 40ms stagger delays
- **Background orbs**: `@keyframes drift` — slow ambient movement, 20s infinite, alternate
- **All transitions**: `200ms cubic-bezier(0.2, 0.8, 0.2, 1)` default easing

### Interaction States

- **Cards**: hover → background darkens slightly + 3D tilt toward cursor + shadow deepens
- **Grammar rows**: hover → background darkens + arrow translates right 3px
- **Nav search**: click → pill expands from icon to full search field (width transition 300ms)
- **Filter chips**: click → instant fill/unfill with 180ms color transition
- **Back link arrow**: hover → translateX(-3px)
- **Buttons**: hover → background lightens slightly
- **Page transitions**: View Transitions API for smooth crossfades between routes

### Accessibility

- All animations respect `prefers-reduced-motion: reduce`
- No essential information conveyed only through animation
- Sufficient color contrast in both light and dark modes

---

## Mobile Design

### Layout Adaptations

- **Nav pill**: Smaller padding, `14px` font
- **Hero headline**: `clamp(2rem, 8vw, 2.5rem)`
- **Switcher**: Full-width, each button `flex: 1`
- **Filter chips**: Horizontally scrollable row with `-webkit-overflow-scrolling: touch`
- **Card grid**: 2 columns with `1px` gaps
- **Detail content**: Full-width, no max-width constraint
- **Footer**: Centered, stacked vertically

### Edge-to-Edge (Android + iOS)

- `padding: env(safe-area-inset-top)` on body/shell top
- `padding: env(safe-area-inset-bottom)` on footer bottom
- `padding-left: env(safe-area-inset-left)` and `padding-right: env(safe-area-inset-right)` on page container
- `<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">`
- `<meta name="theme-color">` set to `#fafafa` (light) / `#0a0a0a` (dark)

### Breakpoints

- `>= 720px`: 3-column card grid, horizontal footer
- `< 720px`: 2-column card grid, full-width switcher, scrollable filter chips, centered stacked footer

---

## Technical Approach

### Stack (unchanged core)

- **Astro 6** static site generator
- **TypeScript** strict mode
- **CSS custom properties** for theming (complete palette rewrite)
- **Vanilla JS** for search/filter (existing `src/lib/library.ts`)
- **View Transitions API** via Astro ClientRouter

### New Dependencies

- Lightweight animation library (Motion One, or custom ~3KB helper) for:
  - 3D card tilt
  - Scroll-triggered reveals
  - Spring-based transitions

### Files to Modify

| File | Changes |
|------|---------|
| `src/styles/global.css` | Complete rewrite — new palette, typography, layouts, animations |
| `src/layouts/BaseLayout.astro` | New nav structure (brand + search pill), updated footer with credit |
| `src/pages/index.astro` | Full rebuild — hero + switcher + filters + both content sections merged |
| `src/pages/literatura/[slug].astro` | Simplify to single-column, remove sidebar |
| `src/pages/bulgarski/[slug].astro` | Simplify to single-column, remove sidebar |
| `src/lib/library.ts` | Update to support switcher-based filtering, theme chip filtering, and `order`-based sorting |
| `src/content.config.ts` | No changes needed |
| `astro.config.mjs` | No changes needed |

### Files to Delete

| File | Reason |
|------|--------|
| `src/pages/literatura/index.astro` | Catalog merged into landing page |
| `src/pages/bulgarski/index.astro` | Catalog merged into landing page |

### Files to Create

| File | Purpose |
|------|---------|
| `src/scripts/interactions.ts` | 3D card tilt, scroll reveals, search expansion |
| (possibly) `public/motion.min.js` | Animation library if using external |

---

## Mockup Reference

Interactive mockups are saved in `.superpowers/brainstorm/548-1773787431/page-mockups-v5.html` and can be viewed by running the brainstorm server.

---

## Font Loading Note

The Google Fonts URL must load `Literata` at weights `400, 700` (not 600) and `Manrope` at weights `400, 500, 700`. The current URL loads Literata at 400/500/700 which is compatible — just ensure weight 600 is not referenced in CSS (all headings now use weight 700).

# Research: Astro 6.x Features & Modern CSS for dzipobel

## Current Site State
- **Astro 6.0.5** (stable released March 10, 2026)
- **Static output** mode (`output: "static"`)
- **Node 22+** already required
- Already uses `<ClientRouter />` for view transitions
- Fonts loaded via Google Fonts CDN `<link>` (Literata serif + Manrope sans)
- Custom CSS design system ("Light Frost") with custom properties, dark mode, spring/ease animations
- Bulgarian educational site for DZI exam preparation

---

## 1. Astro 6 Features We Should Leverage

### 1A. Built-in Fonts API (HIGH PRIORITY)
**What:** Astro 6 has a first-class Fonts API that self-hosts fonts automatically, generates optimized fallbacks, and adds preload links. The site currently loads Literata and Manrope from Google Fonts via an external `<link>`, which is a render-blocking request.

**Implementation:**
```js
// astro.config.mjs
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  site: "https://dzipobel.wiki",
  output: "static",
  fonts: [
    {
      name: "Literata",
      cssVariable: "--font-literata",
      provider: fontProviders.google(),
    },
    {
      name: "Manrope",
      cssVariable: "--font-manrope",
      provider: fontProviders.google(),
    },
  ],
});
```

Then in BaseLayout.astro, replace the Google Fonts `<link>` tags with:
```astro
---
import { Font } from 'astro:assets';
---
<Font cssVariable="--font-literata" preload />
<Font cssVariable="--font-manrope" preload />
```

And update CSS custom properties:
```css
--serif: var(--font-literata), Georgia, serif;
--sans: var(--font-manrope), system-ui, sans-serif;
```

**Impact:** Eliminates render-blocking external font request. Self-hosts fonts. Automatic fallback font generation reduces CLS.

### 1B. Content Security Policy (MEDIUM PRIORITY)
**What:** Astro 6 stabilizes CSP. For an educational site, CSP adds security for students.

**Implementation:**
```js
export default defineConfig({
  security: { csp: true },
});
```

Works automatically with static output -- hashes inline scripts/styles at build time.

### 1C. Experimental Queued Rendering (LOW PRIORITY - MONITOR)
**What:** Up to 2x faster rendering via two-pass approach. Currently experimental.

```js
experimental: {
  queuedRendering: { enabled: true },
}
```

Worth testing but not production-critical for a static site (build speed, not runtime).

### 1D. Live Content Collections (NOT APPLICABLE)
The site is static and content is generated from scripts. Live collections are for runtime data fetching in SSR mode. Not applicable here.

### 1E. Rust Compiler (LOW PRIORITY - MONITOR)
Experimental faster compiler. Could speed up builds but still experimental.

---

## 2. CSS Scroll-Driven Animations

### Browser Support
| Feature | Chrome | Edge | Firefox | Safari | Global |
|---------|--------|------|---------|--------|--------|
| `animation-timeline: scroll()` | 115+ | 115+ | Behind flag | 26+ | **82.81%** |
| `animation-timeline: view()` | 115+ | 115+ | Behind flag | 26+ | ~82% |

**Firefox is the problem** -- disabled by default, requires flag. Progressive enhancement is mandatory.

### Practical Uses for dzipobel

**Reading progress bar (no JS):**
```css
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--text);
  transform-origin: left;
  animation: fill-progress linear;
  animation-timeline: scroll(root block);
  z-index: 100;
}

@keyframes fill-progress {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
```

**Reveal-on-scroll for content blocks:**
```css
.content-block {
  animation: reveal-up linear both;
  animation-timeline: view();
  animation-range: entry 0% cover 30%;
}

@keyframes reveal-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Recommendation:** Use with `@supports (animation-timeline: scroll())` for progressive enhancement. Firefox users get no animation but full content.

---

## 3. CSS `@starting-style`

### Browser Support
| Browser | Version | Global |
|---------|---------|--------|
| Chrome | 117+ | |
| Edge | 117+ | |
| Firefox | 129+ | |
| Safari | 17.5+ | |
| **Total** | | **~89%** |

**Excellent support.** Safe to use now.

### Practical Uses for dzipobel

**Animate nav bar on first page load (replace current JS workaround):**

The site currently uses `html:not([data-nav-loaded]) .nav` with a class toggle to avoid re-animating on Astro transitions. `@starting-style` could simplify this:

```css
.nav {
  opacity: 1;
  transform: translateX(-50%) translateY(0) scale(1);
  filter: blur(0);
  transition: opacity 700ms var(--ease-out),
              transform 700ms var(--ease-out),
              filter 700ms var(--ease-out);
}

@starting-style {
  .nav {
    opacity: 0;
    transform: translateX(-50%) translateY(-16px) scale(0.9);
    filter: blur(8px);
  }
}
```

**Animate content blocks appearing:**
```css
.content-card {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 500ms, transform 500ms;
}

@starting-style {
  .content-card {
    opacity: 0;
    transform: translateY(20px);
  }
}
```

**Note:** `@starting-style` fires on first render only. It will NOT re-trigger on Astro view transitions. For that, use `transition:animate` directives or `view()` scroll animations.

---

## 4. CSS Container Queries

### Browser Support
| Feature | Chrome | Edge | Firefox | Safari | Global |
|---------|--------|------|---------|--------|--------|
| Size queries `@container` | 105+ | 105+ | 110+ | 16+ | **~90%** |
| Style queries | Partial | Partial | Not yet | Not yet | Low |

**Size queries are production-ready.** Style queries are not.

### Practical Uses for Educational Content Blocks

**Make content blocks responsive to their container, not the viewport:**
```css
.content-card {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 500px) {
  .card-inner {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 1.5rem;
  }
}

@container card (max-width: 499px) {
  .card-inner {
    display: flex;
    flex-direction: column;
  }
}
```

This is ideal for educational content that appears in different contexts -- full-width on lesson pages, in a sidebar, or in a grid on the index page. The component adapts to its container rather than the screen.

**Container query units for fluid typography inside components:**
```css
.content-card {
  container-type: inline-size;
}

.card-title {
  font-size: clamp(1rem, 5cqi, 1.5rem); /* cqi = container query inline */
}
```

---

## 5. CSS `:has()` Selector

### Browser Support
| Browser | Version | Global |
|---------|---------|--------|
| Chrome | 105+ | |
| Edge | 105+ | |
| Firefox | 121+ | |
| Safari | 15.4+ | |
| **Total** | | **~93%** |

**Production-ready.** All modern browsers support it.

### Practical Uses for dzipobel

**Accordion with exclusive open (only one section open at a time):**
HTML5 `<details name="group">` attribute (shared `name`) already forces exclusive behavior. `:has()` adds styling power:

```css
/* Style parent when a child details is open */
.lesson-sections:has(details[open]) {
  /* Dim non-open sections */
}

.lesson-sections details:not([open]):has(~ details[open]),
.lesson-sections details[open] ~ details:not([open]) {
  opacity: 0.7;
}

/* Form validation styling without JS */
.search-form:has(input:invalid) .search-submit {
  opacity: 0.5;
  pointer-events: none;
}

/* Conditional layout: if sidebar has content, use two-column */
.page-layout:has(.sidebar:not(:empty)) {
  grid-template-columns: 1fr 340px;
}
```

---

## 6. `<details>` Styling Improvements

### Browser Support for Key Features
| Feature | Chrome | Edge | Firefox | Safari | Global |
|---------|--------|------|---------|--------|--------|
| `::details-content` | 131+ | 131+ | 143+ | 18.4+ | **85.51%** |
| `interpolate-size` | 129+ | 129+ | No | No | **70.47%** |
| `<details name="">` exclusive | 120+ | 120+ | 130+ | 17.2+ | ~90% |

### Animated Open/Close (Progressive Enhancement)

```css
/* Base: works everywhere */
details {
  border: 1px solid var(--line);
  border-radius: var(--radius-card);
  overflow: hidden;
}

summary {
  padding: 1rem;
  cursor: pointer;
  font-weight: 500;
  list-style: none; /* Remove default marker */
}

summary::before {
  content: "+";
  margin-right: 0.75rem;
  transition: transform 300ms var(--ease-smooth);
}

details[open] summary::before {
  content: "-";
}

/* Enhanced: animate open/close (Chromium only for now) */
@supports selector(::details-content) {
  @media (prefers-reduced-motion: no-preference) {
    details {
      interpolate-size: allow-keywords;
    }

    details::details-content {
      opacity: 0;
      block-size: 0;
      overflow-y: clip;
      transition:
        content-visibility 400ms allow-discrete,
        opacity 400ms,
        block-size 400ms var(--ease-smooth);
    }

    details[open]::details-content {
      opacity: 1;
      block-size: auto;
    }
  }
}
```

**Styling the marker:** Use `summary { list-style: none; }` to remove the default triangle, then add a custom marker with `::before` or `::after` pseudo-elements.

**Note:** `interpolate-size` only has 70% support (Chromium only). The animation is pure progressive enhancement -- content works fine without it, it just snaps open/closed instead of sliding.

---

## 7. View Transition API with Astro's ClientRouter

The site already uses `<ClientRouter />`. Here is what can be enhanced:

### Custom Page Transitions
```astro
<!-- In lesson pages -->
<article transition:name="lesson-content" transition:animate="slide">
  <h1 transition:name={`lesson-title-${slug}`}>{title}</h1>
</article>
```

### Morph Elements Between Pages
Give the same `transition:name` to matching elements on different pages:
```astro
<!-- Index page -->
<a href={`/literatura/${slug}`}>
  <h2 transition:name={`title-${slug}`}>{title}</h2>
</a>

<!-- Lesson page -->
<h1 transition:name={`title-${slug}`}>{title}</h1>
```

The title will morph/move between positions during navigation.

### Custom Animation Functions
```astro
---
import { fade, slide } from "astro:transitions";
---
<main transition:animate={slide({ duration: "0.3s" })}>
<aside transition:animate={fade({ duration: "0.2s" })}>
```

### Lifecycle Events for Interactions
```js
document.addEventListener("astro:page-load", () => {
  // Re-init any JS interactions after navigation
});

document.addEventListener("astro:after-swap", () => {
  // Restore scroll position, toggle classes, etc.
});
```

---

## 8. Service Workers for Offline Access

### Recommended Approach: `@vite-pwa/astro`

```bash
npm install -D @vite-pwa/astro
```

```js
// astro.config.mjs
import AstroPWA from '@vite-pwa/astro';

export default defineConfig({
  integrations: [
    AstroPWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'DZI po BEL - Библиотека',
        short_name: 'DZI BEL',
        lang: 'bg',
        theme_color: '#fafafa',
        background_color: '#fafafa',
        display: 'standalone',
      },
      workbox: {
        globPatterns: ['**/*.{html,css,js,svg,png,webp,woff2}'],
        navigateFallback: '/404',
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: { maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
        ],
      },
    }),
  ],
});
```

**Impact:** All lesson pages available offline after first visit. Critical for students in areas with unreliable internet. Static site is perfect for this -- all content is pre-rendered HTML.

### Alternative: Lightweight Manual Service Worker
For a simpler approach without the PWA overhead, a manual service worker that precaches all HTML pages at build time. The `astrojs-service-worker` package does this with minimal config.

---

## 9. CSS `text-wrap: balance`

### Browser Support
| Feature | Chrome | Edge | Firefox | Safari | Global |
|---------|--------|------|---------|--------|--------|
| `text-wrap: balance` | 114+ | 114+ | 121+ | 17.5+ | ~90% |
| `text-wrap: pretty` | 117+ | 117+ | partial | TP only | ~80% |

**`balance` is production-ready.** `pretty` has weaker support.

### Implementation
```css
/* Apply to all headings -- prevents ugly single-word last lines */
h1, h2, h3 {
  text-wrap: balance;
}

/* Apply pretty to body text to avoid orphans */
p {
  text-wrap: pretty;
}
```

**Limitation:** `text-wrap: balance` only works on blocks of 6 lines or fewer (Chrome) or 10 lines (Firefox). Perfect for headings, not for long paragraphs.

**Zero risk:** If unsupported, text renders normally. Pure progressive enhancement.

---

## 10. Performance Optimization

### A. Font Loading (HIGH PRIORITY)
**Current problem:** External Google Fonts `<link>` is render-blocking.

**Fix:** Use Astro 6 Fonts API (see section 1A) to self-host. This:
- Eliminates 2 DNS lookups (fonts.googleapis.com, fonts.gstatic.com)
- Eliminates render-blocking external CSS request
- Enables `font-display: swap` automatically
- Generates fallback fonts to minimize CLS

### B. Image Optimization
The site should use Astro's `<Image>` and `<Picture>` components:
```astro
---
import { Image, Picture } from 'astro:assets';
---

<!-- Automatic WebP conversion, responsive sizes, lazy loading -->
<Picture
  src={heroImage}
  formats={['avif', 'webp']}
  widths={[400, 800, 1200]}
  sizes="(max-width: 768px) 100vw, 800px"
  alt="..."
/>

<!-- Above-the-fold images: disable lazy loading -->
<Image src={heroImage} alt="..." loading="eager" />
```

### C. Critical CSS
Astro already inlines CSS for static pages by default. Each `.astro` component's `<style>` is scoped and inlined. The global CSS is loaded via import, which Vite bundles efficiently.

**To verify:** Check that no large external CSS files are blocking render. The only external CSS currently is Google Fonts (fixed by Fonts API migration).

### D. Preload Strategy
```astro
<!-- Preload critical fonts -->
<link rel="preload" href="/fonts/manrope-400.woff2" as="font" type="font/woff2" crossorigin />

<!-- Prefetch likely next pages -->
<link rel="prefetch" href="/literatura/" />
<link rel="prefetch" href="/bulgarski/" />
```

Note: `<ClientRouter />` already handles intelligent prefetching of links on hover/viewport.

---

## Priority Summary

| Feature | Priority | Support | Risk | Impact |
|---------|----------|---------|------|--------|
| Astro Fonts API | **HIGH** | N/A (Astro feature) | Low | Performance: eliminate render-blocking fonts |
| `text-wrap: balance` | **HIGH** | ~90% | Zero | Typography: better headings, zero downside |
| `:has()` selector | **HIGH** | ~93% | Zero | Enables CSS-only interactive patterns |
| Container queries | **HIGH** | ~90% | Zero | Component-level responsive educational blocks |
| `@starting-style` | **MEDIUM** | ~89% | Low | Cleaner entry animations, less JS |
| View transition customization | **MEDIUM** | 85%+ fallback | Zero | Better page-to-page experience |
| Service worker / offline | **MEDIUM** | Universal | Low | Offline access for students |
| CSP | **MEDIUM** | N/A (Astro feature) | Low | Security for educational audience |
| Scroll-driven animations | **LOW** | 82% (no Firefox) | Low | Nice-to-have progress bar, reveals |
| `<details>` animation | **LOW** | 70-85% | Zero | Progressive enhancement only |
| Queued rendering | **LOW** | Experimental | Medium | Build speed, not user-facing |

---

## Quick Wins (Can Implement Immediately)

1. **Add `text-wrap: balance` to headings** -- one CSS line, zero risk
2. **Switch to Astro Fonts API** -- eliminates render-blocking, improves LCP
3. **Add `transition:name` to lesson titles** -- smooth morphing between index and lesson pages
4. **Enable CSP** -- one config line for security
5. **Use container queries** for content blocks that appear in multiple contexts

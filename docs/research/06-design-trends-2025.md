# Comprehensive Web Design Research Report
## Modern Design Trends for DZI Exam Prep (Astro Static Site) -- 2025-2026

---

## 1. CURRENT DESIGN TRENDS FOR EDUCATIONAL SITES (2025-2026)

### 1.1 Visual Styles: What's In, What's Out

**ALIVE AND DOMINANT:**
- **Content-First / "Barely-There" UI** -- The strongest trend for 2026. Restrained layouts signaling credibility through simplicity. Single font family, 2-3 color tones, extensive white space. Explicitly called out as ideal for "blogs, editorial sites, and educational platforms."
- **Functional Minimalism** -- Everything on the page serves a clear purpose. Clean typography, white space, and subtle animation. This is the consensus #1 trend for educational content.
- **Glassmorphism (still alive, but maturing)** -- Transparent/blurred backgrounds remain active in Apple/Microsoft ecosystems. Suitable for navigation overlays and search modals, but NOT for primary content areas where readability matters most.
- **Human Touch Design** -- Anti-AI aesthetic with hand-drawn elements, rough underlines, textured backgrounds. Builds trust through intentional imperfection. Relevant for making educational content feel approachable rather than sterile.

**FADING / USE WITH CAUTION:**
- **Neo-brutalism** -- Active as a counter-movement but explicitly problematic for functional design and readability. NOT recommended for a study platform where content consumption is the primary use case.
- **Neumorphism (Soft UI)** -- Still exists but accessibility concerns (low contrast) make it unsuitable for educational text-heavy content.
- **Heavy 3D / AR elements** -- Trendy but irrelevant for a static exam prep site. Adds weight without educational value.

**RECOMMENDATION FOR DZIPOBEL:** Content-first minimal design with subtle glassmorphic elements for navigation/overlays. The current "Light Frost" design system is already well-aligned with 2025-2026 trends. Continue this direction.

### 1.2 Typography Trends for Readability

**Key findings from research:**
- Serif for headings + sans-serif for body remains the dominant pairing for 2025-2026.
- Variable fonts are trending for responsive design efficiency.
- Large x-height improves legibility, especially on screens and at small sizes.
- Research across 72 studies found NO statistically significant difference between serif and sans-serif for on-screen readability. The choice is primarily aesthetic/brand.

**Current site fonts (Literata + Manrope):**
- **Literata** was specifically designed for immersive digital reading. Excellent choice for a study site.
- **Manrope** is a geometric sans-serif with strong legibility. Good for UI elements.
- This pairing is well-validated and does not need changing.

**Specific typography numbers for optimal readability:**
- Body text: 16-18px (current 1rem = 16px is at the lower end; consider bumping to 17-18px for long-form content pages)
- Line-height: 1.5-1.6 for body text (current 1.6 is perfect)
- Heading line-height: 1.05-1.15 (current 1.05 is good)
- Letter-spacing for body: 0 to 0.01em (tight tracking hurts readability)
- Maximum line length: 65-75 characters (use max-width on content containers)
- Paragraph spacing: 1em to 1.5em between paragraphs

### 1.3 Dark Mode Best Practices

**Critical color specifications:**

Light mode:
| Element | Current | Recommended |
|---------|---------|-------------|
| Background | #fafafa | Good -- warm off-white |
| Text | #111111 | Consider #1a1a1a (slightly softer) |
| Muted text | #666666 | Good -- 6.3:1 contrast on #fafafa |

Dark mode:
| Element | Current | Recommended |
|---------|---------|-------------|
| Background | #0a0a0a | Shift to #121212 (reduces halation for astigmatism users) |
| Text | #f0f0f0 | Good -- avoids pure white glare |
| Muted text | #999999 | Verify 4.5:1 contrast on dark bg |

**Implementation rules:**
- Never use pure black (#000000) backgrounds -- causes "halation" effect
- Desaturate accent colors 20-40% in dark mode (bright saturated colors "vibrate" on dark)
- Use elevation through contrast, not shadows (shadows become invisible in dark mode)
- Always provide a manual toggle -- `prefers-color-scheme` alone is insufficient
- Test focus indicators in both modes -- they often become invisible in dark mode

**Specific dark mode palette (from research):**
```
Background:     #121212 to #1E1E1E
Surface:        #1A1D21
Text Primary:   #FAFAFA (15:1+ contrast)
Text Secondary: #E0E0E0 (10:1+ contrast)
Text Disabled:  #9E9E9E (4.5:1 on #121212)
Blue accent:    #4D94FF (not #0066FF)
Red accent:     #EF5350 (not #FF0000)
Green accent:   #66BB6A (not #00FF00)
```

### 1.4 WCAG 2.2 Accessibility Standards

WCAG 2.2 became an ISO standard in October 2025. Key NEW requirements relevant to dzipobel:

**Must implement (Level AA):**
1. **Target Size (Minimum)** -- All interactive targets must be at least 24x24 CSS pixels. Primary actions should be 44x44px. Current filter chips (padding: 6px 16px) may be too small on mobile.
2. **Focus Not Obscured** -- Focus indicators must not be hidden by sticky headers/footers. Use `scroll-padding-top` in CSS. The current floating nav could obscure focused elements.
3. **Consistent Help** -- Help mechanisms must appear in the same position across all pages.

**Good to implement (Level A):**
4. **Redundant Entry** -- Don't ask users to re-enter information they already provided.
5. **Accessible Authentication** -- Support password managers and avoid CAPTCHAs.

**CSS implementation for focus visibility:**
```css
:focus-visible {
  outline: 3px solid #0066CC;
  outline-offset: 2px;
}

/* Account for sticky nav */
html {
  scroll-padding-top: 80px;
}
```

---

## 2. STATIC SITE DESIGN PATTERNS (Astro-Specific)

### 2.1 Interactive Experiences Without a Backend

**Astro Islands Architecture:**
- Render 100% static HTML by default, zero JavaScript shipped
- Add interactive "islands" only where needed with `client:load`, `client:visible`, or `client:idle` directives
- This is the ideal architecture for an exam prep site: static content pages with interactive quiz components

**Astro View Transitions:**
- Native browser View Transitions API support with >85% browser support in 2025
- Add `<ClientRouter />` component for automatic page transition animations
- Built-in animations: `transition:animate="fade"`, `"slide"`, `"none"`
- Graceful degradation -- unsupported browsers get normal page jumps
- ZERO additional JavaScript weight

**Recommended interactive islands for dzipobel:**
1. Quiz/test component (client:load -- needs immediate interactivity)
2. Progress tracker (client:idle -- can load after page renders)
3. Search overlay (client:idle)
4. Dark mode toggle (client:load)
5. Bookmarks/favorites (client:idle)

### 2.2 localStorage for Progress Tracking

**Recommended state architecture (vanilla JS, no framework):**
```javascript
// Central store pattern
const StudyStore = {
  getProgress() {
    return JSON.parse(localStorage.getItem('dzi-progress') || '{}');
  },
  markComplete(slug) {
    const progress = this.getProgress();
    progress[slug] = { completed: true, date: Date.now() };
    localStorage.setItem('dzi-progress', JSON.stringify(progress));
  },
  getQuizScore(slug) {
    const scores = JSON.parse(localStorage.getItem('dzi-scores') || '{}');
    return scores[slug];
  },
  saveQuizScore(slug, score, total) {
    const scores = JSON.parse(localStorage.getItem('dzi-scores') || '{}');
    scores[slug] = { score, total, date: Date.now(), best: Math.max(score, scores[slug]?.best || 0) };
    localStorage.setItem('dzi-scores', JSON.stringify(scores));
  }
};
```

**What to track:**
- Topics viewed/completed (per-slug boolean + timestamp)
- Quiz scores (current + best per topic)
- Last visited topic (for "continue studying" feature)
- Theme preference (light/dark)
- Filter preferences (remembering last-used section/filters)

### 2.3 CSS-Only Animations and Interactions

**CSS Scroll-Driven Animations (NEW in 2025, no JS needed):**
```css
/* Reading progress bar -- pure CSS, no JavaScript */
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--accent);
  transform-origin: left;
  animation: progressBar linear;
  animation-timeline: scroll();
}

@keyframes progressBar {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
```

**Progressive enhancement wrapper:**
```css
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: scroll()) {
    .content-block {
      animation: fadeInUp linear both;
      animation-timeline: view();
      animation-range: entry 0% entry 100%;
    }
  }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
```

- Supported in Chrome 117+, Edge, Chromium browsers
- Firefox and Safari: progressive enhancement (content shows without animation)
- Performance is excellent -- runs on compositor thread, no main thread work

### 2.4 Progressive Enhancement

**The Astro way:**
1. All content renders as static HTML -- works with JS disabled
2. CSS handles visual presentation, animations, and basic interactions
3. JS islands add interactivity where needed (quizzes, progress tracking)
4. Service worker adds offline capability as a bonus layer

**Implementation priority:**
```
Layer 0: Static HTML content (always works)
Layer 1: CSS styling + dark mode via prefers-color-scheme (always works)
Layer 2: CSS animations with @supports guards (graceful degradation)
Layer 3: Astro islands for interactivity (progressive)
Layer 4: localStorage for state persistence (progressive)
Layer 5: Service worker for offline (progressive)
```

---

## 3. MOBILE-FIRST STUDY APP DESIGN

### 3.1 How Students Actually Use Study Sites on Mobile

**Key behavioral research findings:**
- Gen Z spends 7+ hours daily on smartphones; mobile is their PRIMARY research tool
- Students start on phone, continue on tablet, take exams on desktop (multi-device continuity)
- Scroll-based consumption patterns (influenced by TikTok/Instagram) -- students prefer vertical scroll over click-through navigation
- Study sessions average 15-25 minutes on mobile (shorter than desktop)
- Students study in transit, between classes, and before bed (varying lighting/connectivity conditions)

### 3.2 Touch-Friendly Interaction Patterns

**Minimum touch targets:**
- Apple recommends 44x44px for touch targets
- WCAG 2.2 requires minimum 24x24px CSS pixels
- Current filter chips need checking -- 6px vertical padding may be insufficient
- Current nav-search button (32x32px) meets WCAG but not Apple guidelines

**Recommended touch improvements:**
```css
/* Ensure adequate touch targets */
.filter-chip {
  min-height: 44px;   /* Apple guideline */
  padding: 10px 18px; /* Larger tap area */
}

/* Add touch feedback */
@media (hover: none) {
  .card-item:active {
    transform: scale(0.98);
    transition: transform 100ms ease;
  }
}
```

**Gesture patterns for study apps:**
- Swipe between topics (horizontal)
- Pull-to-refresh for quiz retry
- Long-press to bookmark
- Double-tap to zoom text

### 3.3 Offline-Capable Study Features (Service Workers)

**Caching strategy for a static exam prep site:**
```
Cache-First: All HTML pages, CSS, fonts, images (static content rarely changes)
Stale-While-Revalidate: Content JSON/data files (check for updates in background)
Network-Only: Analytics, tracking
```

**Implementation with Workbox (recommended for Astro):**
- Pre-cache all built HTML pages at install time
- Cache fonts and CSS with long TTL
- Use `@vite-pwa/astro` plugin for automatic service worker generation
- Display "Available Offline" indicator when content is cached

**Offline study features to enable:**
1. All topic content available offline after first visit
2. Quiz functionality works offline (questions stored in HTML/JSON)
3. Progress saves to localStorage (syncs when online)
4. Clear visual indicator of cached vs. uncached content

---

## 4. CSS DESIGN SYSTEM FOR EDUCATION

### 4.1 Color Palettes That Reduce Eye Strain

**Research-backed color psychology for study:**
- **Blue:** Reduces anxiety, creates calm. Best for reading and long sessions.
- **Green:** Relaxes eyes and mind while maintaining alertness. Best for extended tasks and heavy reading.
- **Yellow:** Most stimulating color for the brain. Use as accent only.
- **Red:** Enhances quick memorization. Use very sparingly (for important highlights).
- **Neutrals:** Reduce visual clutter. Essential as the base.

**Recommended palette for dzipobel (light mode):**
```css
:root {
  /* Base -- warm off-whites reduce glare */
  --bg: #FAFAF8;              /* Very slightly warm white */
  --surface: #FFFFFF;          /* Pure white for cards/surfaces */
  --surface-muted: #F5F5F3;   /* Warm light gray for alt sections */

  /* Text -- dark gray, not pure black */
  --text: #1A1A1A;             /* Slightly softer than #111 */
  --text-secondary: #5A5A5A;   /* Secondary text */
  --text-muted: #8A8A8A;       /* Tertiary/hint text */

  /* Accent -- calming blue-green for study focus */
  --accent: #2563EB;           /* Primary interactive (blue) */
  --accent-soft: #DBEAFE;      /* Light blue bg for highlights */
  --success: #16A34A;          /* Completed/correct */
  --warning: #D97706;          /* Attention needed */
  --error: #DC2626;            /* Wrong answer / important */

  /* Semantic study colors */
  --tip: #0D9488;              /* Teal -- tips & tricks */
  --example: #7C3AED;          /* Purple -- examples */
  --definition: #2563EB;       /* Blue -- definitions */
  --important: #DC2626;        /* Red -- critical info */
}
```

**Dark mode palette (research-validated):**
```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #121212;
    --surface: #1E1E1E;
    --surface-muted: #252525;
    --text: #FAFAFA;
    --text-secondary: #B0B0B0;
    --text-muted: #707070;

    /* Desaturated accents (20-40% less saturated) */
    --accent: #4D94FF;
    --accent-soft: rgba(77, 148, 255, 0.15);
    --success: #66BB6A;
    --warning: #FFB74D;
    --error: #EF5350;
    --tip: #4DB6AC;
    --example: #B39DDB;
    --definition: #4D94FF;
    --important: #EF5350;
  }
}
```

### 4.2 Font Pairing Analysis

**Current: Literata (serif) + Manrope (sans-serif)**
- Literata: Originally designed for Google Play Books for immersive digital reading. Excellent choice.
- Manrope: Clean geometric sans-serif with strong legibility.
- This is a strong pairing and should be kept.

**Usage recommendations:**
```css
/* Headings: Literata serif for authority and readability */
h1, h2, h3 { font-family: var(--serif); }

/* Body text: Manrope for UI clarity */
body, p, li { font-family: var(--sans); }

/* Long-form reading: Consider Literata for body text too */
.article-body p {
  font-family: var(--serif);
  font-size: 1.125rem;  /* 18px for comfortable reading */
  line-height: 1.7;     /* Slightly more generous for long reads */
}

/* Code/technical: Use monospace for grammar rules */
.rule-example {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}
```

### 4.3 Spacing System (8px Grid)

**Recommended spacing scale:**
```css
:root {
  --space-1: 4px;    /* Tight: icon gaps, inline spacing */
  --space-2: 8px;    /* Small: element padding, compact gaps */
  --space-3: 12px;   /* Medium-small */
  --space-4: 16px;   /* Base: paragraph spacing, card padding */
  --space-5: 24px;   /* Medium: section gaps, card margins */
  --space-6: 32px;   /* Large: section separators */
  --space-7: 48px;   /* X-Large: major section breaks */
  --space-8: 64px;   /* XX-Large: page-level spacing */
}
```

**Rules:**
- Internal spacing (padding) must be <= external spacing (margin)
- Use consistent spacing per context (all card padding = --space-4 or --space-5)
- Line-height should use multiples of 4px for grid alignment
- Vertical rhythm: all spacing between blocks should be multiples of 8px

### 4.4 Component Patterns

**Callout/Admonition boxes for educational content:**
```css
.callout {
  padding: var(--space-4) var(--space-5);
  border-radius: var(--radius-card);
  border-left: 4px solid;
  margin: var(--space-5) 0;
  font-size: 0.9375rem;
}

.callout-tip {
  background: rgba(13, 148, 136, 0.08);
  border-color: var(--tip);
}

.callout-warning {
  background: rgba(217, 119, 6, 0.08);
  border-color: var(--warning);
}

.callout-example {
  background: rgba(124, 58, 237, 0.08);
  border-color: var(--example);
}

.callout-important {
  background: rgba(220, 38, 38, 0.08);
  border-color: var(--important);
}

.callout-definition {
  background: rgba(37, 99, 235, 0.08);
  border-color: var(--definition);
}
```

**Collapsible sections (CSS-only with details/summary):**
```html
<details class="collapse-block">
  <summary>Покажи примери</summary>
  <div class="collapse-content">
    <!-- Examples here -->
  </div>
</details>
```

---

## 5. COMPARATIVE LAYOUT ANALYSIS

### 5.1 Single Column vs Multi-Column

**Research consensus:**
- **Single column** is preferred for reading/study content -- reduces eye movement, easier to scan
- **Two-column with sticky sidebar** works well for navigation (table of contents) on desktop
- **Multi-column (3+)** should be reserved for index/overview pages only (like the current card grid)
- Mobile always collapses to single column below 768px

**Recommendation for dzipobel:**
```
Index page:        3-column card grid (current design) -- KEEP
Topic/article page: Single column (max-width: 720px) + sticky sidebar TOC on desktop
Quiz page:         Single column, centered (max-width: 600px)
```

### 5.2 Sticky Sidebar Table of Contents

**Implementation pattern:**
```css
.article-layout {
  display: grid;
  grid-template-columns: 1fr 240px;
  gap: var(--space-6);
  max-width: 1000px;
  margin: 0 auto;
}

.article-toc {
  position: sticky;
  top: 80px;  /* Below floating nav */
  height: fit-content;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

/* Hide sidebar on mobile, show inline TOC instead */
@media (max-width: 768px) {
  .article-layout {
    grid-template-columns: 1fr;
  }
  .article-toc {
    position: static;
    /* Shown as collapsible block at top of article */
  }
}
```

**Active state tracking:**
- Use IntersectionObserver to highlight current section in TOC
- Smooth scroll to section on click
- Animate the active indicator with CSS transitions

### 5.3 Reading Progress Indicator

**Pure CSS approach (animation-timeline: scroll()):**
```css
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--accent);
  transform-origin: left;
  z-index: 100;
  animation: scaleProgress linear;
  animation-timeline: scroll(root);
}

@keyframes scaleProgress {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
```

Falls back to no progress bar in unsupported browsers. Can add JS fallback for Firefox/Safari if desired.

### 5.4 Breadcrumb Navigation

**For deep content hierarchy (e.g., Литература > Христо Ботев > "Хаджи Димитър"):**
```css
.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 0.8125rem;
  color: var(--text-muted);
  padding: var(--space-3) 0;
}

.breadcrumb a:hover {
  color: var(--text);
}

.breadcrumb-separator {
  font-size: 0.75rem;
  opacity: 0.4;
}
```

---

## 6. VISUAL EXAMPLES AND DESIGN SHOWCASE ANALYSIS

### 6.1 Award-Winning Educational Sites (Awwwards 2025)

**Key sites analyzed:**
- **Education Centre Interlaken** -- Clean, content-first layout with generous whitespace
- **Gorilla Science** -- Interactive science education with scroll-driven storytelling
- **Readymag for educators** -- Modular card-based layout system

**Common patterns across awarded sites:**
1. Hero sections are minimal -- headline + subtitle + single CTA
2. Card-based content organization with consistent sizing
3. Generous whitespace (padding values of 48-80px between sections)
4. Subtle animations on scroll (fade-in, slide-up) -- never flashy
5. Dark mode as standard offering
6. System-level font sizes (16-18px body, 32-48px headlines)

### 6.2 Exam Prep App Design Patterns (Dribbble/Behance 2025)

**Consistent patterns across 20+ exam prep designs:**
1. **Progress dashboard** -- Circular or bar progress indicators showing completion %
2. **Topic cards** with completion badges (checkmark, percentage, streak count)
3. **Color-coded subjects** (each topic gets a distinct but muted color)
4. **Streak/consistency tracking** -- "5-day study streak!" type motivation
5. **Quick-access recent topics** -- "Continue where you left off"
6. **Score history** with simple line/bar charts

### 6.3 2026 Web Design Trends Most Relevant to dzipobel

From the Graphic Design Junction analysis of 15 trends shaping 2026:

1. **Content-First Layouts** -- Typography and reading flow lead; visuals support. "Best for blogs, editorial sites, and educational platforms."
2. **Barely-There UI** -- Single font family, 2-3 color tones, extensive white space.
3. **Story-Driven Motion** -- Motion that explains transitions and guides users.
4. **Grade-School Color Palettes** -- Familiar blues, reds, yellows that feel safe and approachable.
5. **Human Touch Design** -- Intentional signs of human creation to build trust.

---

## 7. SPECIFIC, IMPLEMENTABLE RECOMMENDATIONS FOR DZIPOBEL

### Priority 1: Quick Wins (Current Session)

1. **Shift dark mode background from #0a0a0a to #121212** -- Reduces halation for astigmatism users, research-backed improvement
2. **Add scroll-padding-top: 80px to html** -- Prevents floating nav from obscuring focused content (WCAG 2.2 compliance)
3. **Increase touch targets** on filter chips to minimum 44px height
4. **Add :focus-visible styles** with 3px outline and appropriate contrast

### Priority 2: Content Page Design

5. **Single-column reading layout** for topic pages (max-width: 720px, centered)
6. **Increase body text to 17-18px** on content pages for comfortable reading
7. **Sticky sidebar TOC** on desktop, collapsible at top on mobile
8. **Reading progress bar** using CSS animation-timeline: scroll()
9. **Breadcrumb navigation** for topic hierarchy
10. **Callout/admonition components** (tip, warning, example, definition, important)

### Priority 3: Interactive Features

11. **localStorage progress tracking** -- Mark topics as read, save quiz scores
12. **"Continue studying" feature** on homepage -- Resume last topic
13. **Manual dark mode toggle** (don't rely solely on prefers-color-scheme)
14. **Astro View Transitions** for smooth page navigation

### Priority 4: Progressive Enhancement

15. **Service worker for offline access** using @vite-pwa/astro
16. **CSS scroll-driven animations** for content reveal on topic pages
17. **Collapsible sections** using native details/summary elements
18. **Study streak counter** using localStorage dates

### Priority 5: Future Considerations

19. **Quiz/practice test components** as Astro islands
20. **Spaced repetition tracking** with localStorage
21. **Export/share progress** feature
22. **Print-optimized CSS** for study notes

---

## Sources

### Design Trends
- [Figma: Top Web Design Trends for 2026](https://www.figma.com/resource-library/web-design-trends/)
- [15 Web Design Trends Shaping 2026 - Graphic Design Junction](https://graphicdesignjunction.com/2025/12/web-design-trends-of-2026/)
- [Top 11 Education App Design Trends in 2025 - Lollypop](https://lollypop.design/blog/2025/august/top-education-app-design-trends-2025/)
- [2025 UI Design Trends - Lummi](https://www.lummi.ai/blog/ui-design-trends-2025)
- [Website Design Trends Education 2025 - Mynkis](https://www.mynkis.com/articles/website-design-trends-education-2025)
- [UI/UX Design Trends 2026 - Eleorex](https://eleorex.com/ui-ux-design-trends-in-2026-what-your-website-must-have-to-woo-users/)

### Typography
- [Typography Basics 2025 - eDesignify](https://edesignify.com/blogs/typography-basics-a-2025-designers-guide-to-fonts-and-readability)
- [Font Trends for 2025 - Lummi](https://www.lummi.ai/blog/font-trends)
- [Top 10 Typography Trends - TypeType](https://typetype.org/blog/top-10-typography-trends-of-2024/)
- [Literata Font Pairings - MaxiBestOf](https://maxibestof.one/typefaces/literata)
- [Manrope Font Pairings - MaxiBestOf](https://maxibestof.one/typefaces/manrope)

### Dark Mode & Accessibility
- [Dark Mode Accessibility Guide - AccessibilityChecker](https://www.accessibilitychecker.org/blog/dark-mode-accessibility/)
- [Dark Mode Done Right - Medium (2026)](https://medium.com/@mohitphogat/dark-mode-done-right-and-why-most-apps-get-it-wrong-a75f90aab30a)
- [Dark Mode and High Contrast for Learning Apps](https://midlandsinbusiness.com/dark-mode-and-high-contrast-themes-for-learning-apps)
- [WCAG 2.2 Complete Guide 2025 - AllAccessible](https://www.allaccessible.org/blog/wcag-22-complete-guide-2025)
- [WCAG 2.2 ISO Standard 2025](https://adaquickscan.com/blog/wcag-2-2-iso-standard-2025)
- [Color Contrast Accessibility WCAG 2025](https://www.allaccessible.org/blog/color-contrast-accessibility-wcag-guide-2025)

### Layout & Navigation
- [Table of Contents Design Guide - NN/g](https://www.nngroup.com/articles/table-of-contents/)
- [Sticky Table of Contents - CSS-Tricks](https://css-tricks.com/sticky-table-of-contents-with-scrolling-active-states/)
- [Sticky Menus UX Guidelines - Smashing Magazine](https://www.smashingmagazine.com/2023/05/sticky-menus-ux-guidelines/)
- [CSS Scroll-Driven Animations - Smashing Magazine](https://www.smashingmagazine.com/2024/12/introduction-css-scroll-driven-animations/)

### Color & Eye Strain
- [What Color Helps You Study - ACS Learning](https://acslearning.org/what-color-helps-you-study/)
- [Eye-Friendly Website Colors - Pixelait](https://pixelait.com/learn/how-to-choose-website-colors-that-arent-eye-irritating/)
- [Color Palettes for Balanced Web Design 2026 - Elegant Themes](https://www.elegantthemes.com/blog/design/color-palettes-for-balanced-web-design)
- [Color Psychology in UI Design 2025 - MockFlow](https://mockflow.com/blog/color-psychology-in-ui-design)

### Spacing & Design Systems
- [Spacing Best Practices - 8pt Grid - Cieden](https://cieden.com/book/sub-atomic/spacing/spacing-best-practices)
- [Spacing and Sizing Best Practices - ConceptFusion](https://www.conceptfusion.co.uk/post/web-design-spacing-and-sizing-best-practices)
- [Space, Grids and Layouts - DesignSystems.com](https://www.designsystems.com/space-grids-and-layouts/)
- [Line Spacing Best Practices - Justinmind](https://www.justinmind.com/blog/best-ux-practices-for-line-spacing/)

### Static Sites & Astro
- [Astro View Transitions Docs](https://docs.astro.build/en/guides/view-transitions/)
- [Astro Islands Architecture](https://docs.astro.build/en/concepts/islands/)
- [Astro View Transitions Guide - BetterLink](https://eastondev.com/blog/en/posts/dev/20251202-astro-view-transitions-guide/)
- [CSS Scroll-Triggered Animations - Chrome Dev](https://developer.chrome.com/blog/scroll-triggered-animations)

### Mobile & PWA
- [Progressive Web App UX Tips 2025 - Lollypop](https://lollypop.design/blog/2025/september/progressive-web-app-ux-tips-2025/)
- [Mobile First Design - BrowserStack](https://www.browserstack.com/guide/how-to-implement-mobile-first-design)
- [Offline-First PWAs - MagicBell](https://www.magicbell.com/blog/offline-first-pwas-service-worker-caching-strategies)
- [PWA Tutorial 2025 - MarkAICode](https://markaicode.com/progressive-web-app-tutorial-2025-service-worker-offline/)

### Design Inspiration
- [Awwwards Culture & Education](https://www.awwwards.com/websites/culture-education/)
- [Dribbble Exam UI Tags](https://dribbble.com/tags/exam-ui)
- [Behance Exam App Design](https://www.behance.net/search/projects/exam%20app%20design)
- [Callout Components - Quarto](https://quarto.org/docs/authoring/callouts.html)

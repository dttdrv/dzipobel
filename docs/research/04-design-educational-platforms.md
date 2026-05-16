# Deep Design Research Report: Educational Website Design Patterns

## Comprehensive Analysis for a Bulgarian Exam Prep Wiki/Study Guide Site

---

## 1. KHAN ACADEMY (khanacademy.org)

### Color System (Wonder Blocks Design System -- 2025 rebuild)

**Primitive Colors:**
| Token | Hex | Usage |
|-------|-----|-------|
| blue | `#1865f2` | Actions, links, interactive elements |
| purple | `#9059ff` | Secondary accent, categories |
| green | `#00a60e` | Success, completion, mastery |
| gold | `#ffb100` | Warnings, in-progress, highlights |
| red | `#d92916` | Errors, critical alerts |
| offBlack | `#21242c` | Primary text |
| white | `#ffffff` | Backgrounds |
| darkBlue | `#0b2149` | Deep headers, hero areas |
| teal | `#14bf96` | Special accents |
| eggplant | `#5f1e5c` | Premium/decorative |
| offWhite | `#f7f8fa` | Subtle backgrounds |

**Brand Colors:**
- Khan Sushi (legacy green): `#9cb443`
- Khan Ebony Clay (legacy dark): `#242f3a`

**Opacity System:** offBlack at 64%, 50%, 32%, 16%, 8% for layered UI depth.

**Color Token Architecture:**
- 3 domains: Core, Learning, Component
- 4 roles: Background, Border, Foreground, Shadow
- 9 contexts: Base, Instructive, Neutral, Disabled, Success, Warning, Critical, Knockout, Overlay
- 3 intensities: Subtle, Default, Strong
- "Instructive" replaces typical "Primary/Brand" -- reflects educational purpose

### Typography
- **Primary font:** Lato (Google Font) -- clean, modern, highly readable
- **Display/annotation font:** Chalky (custom bespoke typeface)
- **Serif font:** Source Serif Pro (for long-form reading)
- Consolidated from 8+ typefaces to 5, and 119+ styles to 14
- Information density increased 11-18% for sans-serif, 26% for serif
- Optimized for low-cost hardware and slow connections

### Layout Patterns
- Course pages: Single-column centered layout with unit cards stacked vertically
- Sidebar navigation for within-course navigation
- Unit cards contain: title, description, progress bar, lesson count
- Breadcrumb navigation: Home > Subject > Course > Unit > Lesson
- Content types differentiated by icons: video (play), exercise (pencil), article (document)

### Design Principles
1. **Empowering** -- students feel capable, not patronized
2. **Credible** -- clean, structured, modern design
3. **Flexible** -- diverse audiences and contexts
4. **Joyful** -- celebrates learning progress

### Key Takeaway for Our Site
Khan's approach of using "Instructive" as the primary action color (guiding users to intended actions) is directly applicable. Their color token system with domain/layer/context/intensity is sophisticated but the principle is clear: color should serve learning, not just branding.

---

## 2. BRILLIANT.ORG

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| Green (Primary CTA) | `#29CC57` | Main call-to-action |
| Green hover | `#15B441` | Hover state |
| Green active | `#009B2B` | Active/pressed state |
| Green shadow | `#007C23` | 3D button shadow |
| Blue (Links/Accent) | `#456DFF` | Links, interactive elements |
| Teal | `#2CB0A1` | Secondary accent |
| Purple | `#9D62FF` | Category/decorative |
| Pink | `#FF6BD5` | Highlight accent |
| Orange | `#FF8D23` | Warning/attention |
| Gray-50 | `#F8F8F8` | Lightest surface |
| Gray-100 | `#F2F2F2` | Light surface |
| Gray-200 | `#E5E5E5` | Borders |
| Gray-500 | `#999999` | Muted text |
| Gray-900 | `#383838` | Primary text |
| Gray-950 | `#141414` | Darkest text/dark mode bg |
| Warning | `#F7C325` | Warning state |
| Error | `#FF5D5D` | Error state |

### Typography
- **Font family:** `'coFoBrilliantFont'` (custom branded font)
- **Fallback:** Arial, sans-serif
- **Mono:** SFMono-Regular, Menlo, Monaco, Consolas, monospace

**Size Scale (rem):**
| Token | Size |
|-------|------|
| 3xs | 0.45rem |
| xs | 0.75rem |
| sm | 0.875rem |
| md | 1rem |
| lg | 1.125rem |
| xl | 1.25rem |
| 2xl | 1.5rem |
| 3xl | 1.875rem |
| 4xl | 2.25rem |
| 5xl | 3rem |
| 6xl | 3.75rem |

**Weights:** 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Layout System
**Breakpoints (mobile-first):**
| Token | Width |
|-------|-------|
| sm | 360px |
| md | 481px |
| lg | 769px |
| xl | 992px |
| 2xl | 1280px |

**Container widths:** sm/md: 432px, lg/xl: 1216px
**Max prose width:** 60ch (optimal reading line length)
**Spacing:** base-4 system (4px, 8px, 12px, 16px, 20px, 24px, 32px, 48px, 64px)

### Interactive Elements -- CRITICAL PATTERNS

**3D Button System (most distinctive feature):**
```
Primary CTA:
  - Background: #29CC57
  - Border-radius: 60px (pill shape)
  - Shadow: 0 4px 0 0 #007C23 (bottom shadow creating 3D effect)
  - Default: translateY(-4px)
  - Active: translateY(0) (button "presses down")
  - Transition: 200ms cubic-bezier(0.4, 0, 0.2, 1)
```

**Button Hierarchy:**
1. Solid Filled (Primary): Color bg, white text, 3D shadow
2. Outline (Secondary): Transparent bg, 2px border, dark text
3. Ghost: No border/bg, underline on active
4. Icon Button: Square/circular

**Focus-Visible:** Box-shadow ring (white border + blue border), 2px offset

### Hero Section
- Full viewport height (`min-height: 100dvh`)
- Centered flex column
- Headline: 3xl -> 4xl responsive
- Two CTAs stacked (mobile) -> side-by-side (desktop)
- Button height: 45px (mobile) -> 60px (desktop)
- Button width: 100% (mobile) -> 284px (desktop)

### Animation Patterns
- Default transition: 200ms, `cubic-bezier(0.4, 0, 0.2, 1)`
- Ultra-fast: 50ms, Faster: 100ms, Fast: 150ms, Slow: 300ms, Slower: 400ms
- Button press: translateY(-4px) -> translateY(0) on active
- Opacity transitions for image overlays

### Course Pages
- Skeleton loaders during content load
- Responsive card heights: 211px (mobile) -> 133px (tablet) -> 128px (desktop)
- Card border-radius: 1.25rem (2xl)
- Card shadows: `0px 2px 0px 0px var(--bits-colors-gray-300)`
- Learning path sections with "Step-by-step paths to mastery" subtitle
- Iridescent gradients for premium sections (blue-500, pink-500, yellow-500)

### Key Takeaway for Our Site
The 3D button system with translateY animation is extremely engaging and makes CTAs feel physical/tangible. The `60ch` max prose width is an excellent readability standard. Their skeleton loaders and responsive card height adjustments show attention to perceived performance.

---

## 3. BBC BITESIZE (bbc.co.uk/bitesize)

### Color Psychology by Age Group
- **Primary school:** Orange-to-berry gradient -- "energy and curiosity of youngest learners"
- **Secondary school (GCSE):** Purple -- "calming, soothing colour to minimise exam stress"
- **Core brand:** Bright orange -- "core Bitesize colour" with strong education recognition

### BBC GEL/iD Design System Colors
| Token | Hex | Usage |
|-------|-----|-------|
| Primary Blue | `#1790CF` | Headers, active CTAs |
| Link Blue | `#005383` | Links, hover states |
| Information Yellow | `#FFAD01` | Information callouts |
| Warning Yellow | `#FFE141` | Warning callouts |
| Error Red | `#A61616` | Error states |
| Validated Green | `#169009` | Success/validated |
| Inactive Gray | `#C0C0C0` | Disabled states |
| Light Blue | `#E0F4FF` | Subheader text |
| Light Gray | `#F5F7F6` | Hint containers |
| Dark Gray | `#525252` | Hint text |
| Border Gray | `#a7a7a7` | Input borders |

### Typography
- **Primary font:** BBC Reith Sans/Serif (modern, accessible)
- **Fallback:** Arial, sans-serif
- **GEL (iD) system uses:** Arial, "Gill Sans" for headers
- Heading scale: 20px -> 24px -> 32px (responsive)
- Body: 13px (mobile) -> 16px (tablet/desktop)
- Line-height: 16px -> 20px (responsive)
- Labels: 16px -> 20px, Bold weight

### Revision Guide Page Structure (Key Pattern)
1. **Breadcrumb navigation:** Home > Subject > Topic > Revision Guide
2. **Numbered revision pages:** "Page 1 of 5" with forward/back navigation
3. **Content blocks:**
   - **Key Points** (callout boxes with colored left border)
   - **Explanatory text** with diagrams/illustrations
   - **Worked examples** in highlighted boxes
   - **"Test Yourself"** sections with interactive quizzes
4. **Content is "bite-sized"** -- each revision page covers one focused concept
5. **Clear visual hierarchy:** heading > key point > explanation > example > test

### Layout Patterns
- One column through mobile/tablet
- Two columns at desktop: 62% primary / 36% secondary (info panel)
- Max container: 976px total at largest breakpoint
- Panels as content containers with responsive padding
- Sidebar widths: 220px (sm) -> 256px (md) -> 296px (lg)

### Spacing
- Base increment: 8px
- Standard margins: 8px -> 16px responsive
- Panel margins: 8px left/right (mobile) -> 16px (desktop)

### Key Takeaway for Our Site
BBC Bitesize's approach of using **purple for exam revision** (calming, reduces stress) is directly relevant to our Bulgarian exam prep context. Their revision guide structure (numbered pages, key points, test yourself) is the gold standard for revision content organization. The "bite-sized" philosophy of one concept per page is proven effective.

---

## 4. SENECA LEARNING (senecalearning.com)

### Typography
- **Primary font:** Mulish (400, 600 weights)
- **Secondary:** Inter (variable, 100-900)
- **Display:** Carter One
- Multi-language Unicode support (relevant for Bulgarian)

### Gamification Elements (Critical for Engagement)
1. **XP System** -- earn experience points for completing content
2. **Streaks** -- daily study streak tracking (like Duolingo)
3. **Leaderboards** -- compete with classmates by questions answered and time spent
4. **Memory Strength** -- visual indicator of how well content is retained
5. **Progress tracking** -- per-subject completion metrics
6. **Adaptive difficulty** -- AI adjusts to individual learning level

### Content Structure
- 1000+ exam-specific courses
- Organized by: Level (KS2, KS3, GCSE, A-level) > Subject > Topic
- Content types: summaries, notes, videos, practice questions (multiple types)
- Written by senior examiners, aligned to exam board specifications
- AI tutor "Amelia" available 24/7

### Design Approach
- Clean, modern interface
- Light and dark mode support
- Focus on reducing friction to start studying
- Teachers can monitor student progress with detailed dashboards
- Parents receive reports on strengths/weaknesses

### Key Takeaway for Our Site
Seneca's gamification trifecta (XP + Streaks + Leaderboards) is proven to drive engagement. Their "memory strength" indicator is unique and educational. The fact that content is written by senior examiners is a key trust signal we should replicate with "written by experienced Bulgarian teachers."

---

## 5. DOCUMENTATION-STYLE SITES (GitHub Docs / Notion)

### GitHub Primer Design System

**Color Palette:**
| Token | Hex | Usage |
|-------|-----|-------|
| fgColor-default | `#1f2328` | Primary text |
| fgColor-muted | `#59636e` | Secondary text |
| fgColor-accent | `#0969da` | Links, accents |
| fgColor-success | `#1a7f37` | Success states |
| fgColor-danger | `#d1242f` | Error/danger |
| fgColor-onEmphasis | `#ffffff` | Text on dark bg |
| bgColor-default | `#ffffff` | Page background |
| bgColor-muted | `#f6f8fa` | Code blocks, subtle areas |
| bgColor-emphasis | `#25292e` | Dark surfaces |
| bgColor-accent-muted | `#ddf4ff` | Highlighted info areas |
| borderColor-default | `#d1d9e0` | Default borders |
| borderColor-emphasis | `#818b98` | Strong borders |
| Button primary rest | `#1f883d` | Primary button |
| Button primary hover | `#1c8139` | Primary button hover |

**Shadows:**
- Resting small: `0 1px 1px 0 #1f23280a, 0 1px 2px 0 #1f232808`
- Floating medium: `0 8px 16px -4px #25292e14, 0 4px 32px -4px #25292e14`

**Typography:**
- Font stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- Mono: `ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace`
- Type scale: .f1 through .f6 utility classes (mobile-first, scale up at md breakpoint)

**Spacing Scale (base-8):**
| Token | Value |
|-------|-------|
| $spacer-0 | 0px |
| $spacer-1 | 4px |
| $spacer-2 | 8px |
| $spacer-3 | 16px |
| $spacer-4 | 24px |
| $spacer-5 | 32px |
| $spacer-6 | 40px |
| $spacer-7 | 48px |
| $spacer-8 | 64px |
| $spacer-9 | 80px |
| $spacer-10 | 96px |
| $spacer-11 | 112px |
| $spacer-12 | 128px |

**Breakpoints:**
| Token | Width |
|-------|-------|
| xs | 0px |
| sm | 544px |
| md | 768px |
| lg | 1012px |
| xl | 1280px |

**Container:** Max-width 1280px with 24px padding (visual max: 1232px)

**Sidebar Widths:**
- Standard: 220px (sm) -> 256px (md) -> 296px (lg)
- Narrow: 240px (md) -> 256px (lg)
- Wide: 320px (lg) -> 336px (xl)

**Gutters:**
- Standard: 16px (md) -> 24px (lg) -> 32px (xl)
- Condensed: 16px (md/lg) -> 24px (xl)
- Spacious: 24px (md) -> 32px (lg) -> 40px (xl)

### GitHub Docs Layout Pattern
- Split page layout: sidebar + content area
- Sidebar: collapsible, nested tree navigation
- Content area: left-aligned, ragged right
- Line length: ~80 characters max (W3C recommendation)
- Heading hierarchy: H1 (page title) > H2 (sections) > H3 (subsections)
- Callout types: Note, Warning, Tip, Important (colored left border)
- Breadcrumbs: Category > Section > Page
- "Next Steps" and "Further Reading" footer sections
- Table of contents: auto-generated from headings

### Notion Design Patterns

**Color Palette (Light Mode):**
| Type | Default | Gray | Brown | Orange | Yellow | Green | Blue | Purple | Pink | Red |
|------|---------|------|-------|--------|--------|-------|------|--------|------|-----|
| Text | `#373530` | `#787774` | `#976D57` | `#CC782F` | `#C29343` | `#548164` | `#487CA5` | `#8A67AB` | `#B35488` | `#C4554D` |
| Background | `#FFFFFF` | `#F1F1EF` | `#F3EEEE` | `#F8ECDF` | `#FAF3DD` | `#EEF3ED` | `#E9F3F7` | `#F6F3F8` | `#F9F2F5` | `#FAECEC` |
| Icon | `#55534E` | `#A6A299` | `#9F6B53` | `#D87620` | `#CB912F` | `#448361` | `#337EA9` | `#9065B0` | `#C14C8A` | `#D44C47` |

**Color Palette (Dark Mode):**
| Type | Default | Gray | Brown | Orange | Yellow | Green | Blue | Purple | Pink | Red |
|------|---------|------|-------|--------|--------|-------|------|--------|------|-----|
| Text | `#D4D4D4` | `#9B9B9B` | `#A27763` | `#CB7B37` | `#C19138` | `#4F9768` | `#447ACB` | `#865DBB` | `#BA4A78` | `#BE524B` |
| Background | `#191919` | `#252525` | `#2E2724` | `#36291F` | `#372E20` | `#242B26` | `#1F282D` | `#2A2430` | `#2E2328` | `#332523` |
| Icon | `#D3D3D3` | `#7F7F7F` | `#AA755F` | `#D9730D` | `#CA8E1B` | `#2D9964` | `#2E7CD1` | `#8D5BC1` | `#C94079` | `#CD4945` |

**Sidebar UI:**
- Width: 224px fixed
- 8px grid system
- Navigation height: 131px
- Favorites section: 30px with 6px gap
- Icons: 22px squares with consistent alignment
- Font: system fonts (SF Pro, Segoe UI), medium weight
- Warm grays instead of harsh blacks
- Typography choices: Default (sans), Serif, Mono (per-page)

**Content Block Types:**
- Headings (H1-H3)
- Text paragraphs
- Callout blocks (colored background + icon)
- Toggle blocks (collapsible sections)
- Code blocks (syntax highlighted)
- Tables
- Lists (bulleted, numbered, toggle)
- Columns layout

### Key Takeaway for Our Site
The documentation site pattern (sidebar nav + content area, ~80ch line length, callout boxes for key info, breadcrumbs) is the ideal foundation for a study guide/wiki. Notion's callout blocks are perfect for "key point" and "remember this" boxes. GitHub's base-8 spacing scale provides mathematical consistency.

---

## 6. COLOR PSYCHOLOGY FOR EDUCATIONAL SITES

### Research-Backed Color Recommendations

**Blue (Trust + Focus):**
- 36% of university brands use blue
- Inspires calm and concentration
- Ideal for complex/extensive content
- Conveys competence, intelligence, maturity, trust
- **Use for:** Primary UI color, navigation, headers

**Green (Growth + Stress Reduction):**
- Reduces anxiety during tests/high-pressure learning
- Association with growth, development, renewal
- Helps create comfortable learning environments
- **Use for:** Success states, progress indicators, "completed" states, backgrounds for review areas

**Purple (Calm + Exam Prep):**
- BBC uses it specifically for GCSE revision (calming during exams)
- Associated with wisdom, creativity
- **Use for:** Exam-specific sections, revision content areas

**Red (Attention + Memory):**
- Stimulates attention, increases focus on detail-oriented tasks
- Enhances performance on memory tasks, proofreading, accuracy
- **Use sparingly for:** Key terms, important warnings, deadlines

**Yellow/Gold (Energy + Positivity):**
- 39% of brands use yellow (never alone)
- Communicates excitement, youthfulness
- **Use as:** Accent color for highlights, callout boxes, important notes

**Orange (Creativity + Friendliness):**
- BBC's core Bitesize color
- Courage, creativity, confidence
- **Use for:** CTAs, engagement elements, interactive content

### Proven Palette Strategies
- 46% of successful educational brands use 2 primary colors
- 27% use 3 primary colors
- Color-coded information is more easily remembered than B&W
- Associate specific colors with information types for recall

---

## 7. SYNTHESIZED DESIGN RECOMMENDATIONS FOR OUR SITE

### Recommended Color Palette

**Primary:**
- Deep Blue: `#1865f2` (trust, focus -- from Khan Academy)
- Off-White: `#f7f8fa` (clean background)
- Off-Black: `#21242c` (primary text)

**Secondary/Accent:**
- Success Green: `#00a60e` (completion, mastery)
- Calm Purple: `#9059ff` (exam/revision sections -- BBC Bitesize insight)
- Gold: `#ffb100` (highlights, key points, "remember this")
- Red: `#d92916` (sparingly -- critical info, deadlines)

**Surfaces:**
- Muted Background: `#f6f8fa` (code blocks, callout areas)
- Border: `#d1d9e0` (subtle separation)
- Muted text: `#59636e` (secondary information)

### Recommended Typography

**Primary font:** Inter or Mulish (excellent Latin + Cyrillic support)
- Both support Bulgarian characters natively
- Clean, modern, highly readable at all sizes
- Available on Google Fonts (free, fast CDN)

**Heading font:** Inter Bold/Semibold or a display font for hero areas
**Mono font:** `ui-monospace, "SF Mono", Menlo, Consolas, monospace`

**Type Scale (Brilliant-inspired, rem-based):**
- xs: 0.75rem (12px) -- captions, metadata
- sm: 0.875rem (14px) -- secondary text, sidebar
- base: 1rem (16px) -- body text
- lg: 1.125rem (18px) -- lead paragraphs
- xl: 1.25rem (20px) -- small headings
- 2xl: 1.5rem (24px) -- section headings
- 3xl: 1.875rem (30px) -- page titles
- 4xl: 2.25rem (36px) -- hero headings

### Recommended Spacing (GitHub Primer base-8)
- 0: 0px
- 1: 4px
- 2: 8px
- 3: 16px
- 4: 24px
- 5: 32px
- 6: 40px
- 7: 48px
- 8: 64px

### Recommended Layout

**Documentation-style (Notion/GitHub Docs hybrid):**
- Sidebar: 256px-296px (collapsible on mobile)
- Content area: max-width `60ch` (~680px) for reading comfort
- Page max-width: 1280px with 24px padding
- Breakpoints: 544px (sm), 768px (md), 1012px (lg), 1280px (xl)

### Content Block Patterns to Implement

1. **Key Point Callout** (BBC Bitesize inspired)
   - Gold/yellow left border + light yellow background
   - Icon + "Key Point" label
   - Concise factual statement

2. **Remember This** (Notion callout inspired)
   - Purple left border + light purple background
   - Brain/lightbulb icon
   - Mnemonic or memory aid

3. **Example Block** (GitHub Docs inspired)
   - Gray background (`#f6f8fa`)
   - Bordered container
   - Step-by-step worked example

4. **Test Yourself** (BBC Bitesize inspired)
   - Green accent
   - Interactive toggle (show/hide answer)
   - Self-assessment question

5. **Warning/Common Mistake** (GitHub Docs inspired)
   - Red left border + light red background
   - Warning icon
   - Common error description

6. **Definition Block**
   - Blue left border + light blue background
   - Term in bold, definition in regular weight

### Interactive Patterns to Implement

1. **3D Button System** (Brilliant-inspired)
   - translateY animation on press
   - Bottom shadow for depth
   - 200ms transitions

2. **Progress Indicators** (Khan/Seneca-inspired)
   - Per-topic completion bars
   - Overall subject mastery percentage
   - Color: green gradient for completion

3. **Gamification Elements** (Seneca-inspired)
   - Study streak counter
   - XP for completed topics
   - "Memory strength" per topic (decays over time, encourages review)

4. **Skeleton Loaders** (Brilliant-inspired)
   - Animated placeholder blocks during page transitions
   - Responsive heights matching actual content

### What Makes Educational Design Feel "Premium"

1. **Generous whitespace** -- don't crowd content
2. **Consistent spacing** -- use the base-8 scale religiously
3. **Limited color palette** -- 2-3 primary colors max, with semantic accents
4. **System font stack** -- fast loading, native feel
5. **60ch content width** -- optimal reading comfort
6. **Subtle shadows** -- `0 1px 2px rgba(0,0,0,0.05)` for depth
7. **Smooth transitions** -- 200ms for micro-interactions
8. **Clear heading hierarchy** -- distinct visual levels
9. **Accessible contrast** -- WCAG 4.5:1 minimum for text
10. **Responsive images** -- with appropriate loading states

### Mobile-First Approach
- Stack all content single-column below 768px
- Hide sidebar into hamburger/drawer below 768px
- Full-width buttons and cards on mobile
- Increase touch targets to 44px minimum
- Reduce heading sizes by 1-2 steps on mobile
- Use `100dvh` for full-screen hero sections

---

## Sources

- [Khan Academy Color System Rebuild Blog Post](https://blog.khanacademy.org/how-we-rebuilt-khan-academys-color-system-from-the-ground-up/)
- [Wonder Blocks Design System](https://www.designsystems.com/about-wonder-blocks-khan-academys-design-system-and-the-story-behind-it/)
- [Khan Academy Brand](https://brand.khanacademy.org/)
- [Khan Academy Color Tokens (GitHub source)](https://github.com/Khan/wonder-blocks/blob/main/packages/wonder-blocks-tokens/src/tokens/color.ts)
- [Brilliant.org](https://brilliant.org) -- directly analyzed CSS/design tokens
- [BBC Bitesize Redesign (Design Week)](https://www.designweek.co.uk/issues/17-23-september-2018/bbc-bitesize-redesigns-attract-kids-teenagers-all-ages/)
- [BBC GEL/iD Style Guide](https://bbc.github.io/idstyleguide/)
- [Seneca Learning Reviews](https://edtechimpact.com/products/seneca/)
- [GitHub Primer Design System](https://primer.style/)
- [Primer CSS Layout Variables (GitHub source)](https://github.com/primer/css/blob/main/src/support/variables/layout.scss)
- [Primer Color Tokens](https://primer.style/foundations/color)
- [Notion Colors (All Hex Codes)](https://matthiasfrank.de/en/notion-colors/)
- [Notion Sidebar UI Breakdown](https://medium.com/@quickmasum/ui-breakdown-of-notions-sidebar-2121364ec78d)
- [Color Psychology for Education Web Design](https://www.progress.com/blogs/using-color-psychology-education-web-design)
- [E-Learning Website Design Examples](https://www.subframe.com/tips/e-learning-website-design-examples)
- [Best Educational Website Design Examples](https://devsdata.com/best-educational-website-design-examples/)
- [EdTech Websites 2025](https://www.webstacks.com/blog/edtech-websites)

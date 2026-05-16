# Linux Handoff: dzipobel

Date created: 2026-05-02  
Original workspace: `C:\Users\deyan\Projects\dzipobel`  
Expected Linux workspace: wherever this repo is cloned/copied, likely `~/Projects/dzipobel` or similar.  
Shell used so far: Windows PowerShell. Future shell: Linux shell.

This file is intentionally very detailed. It captures project shape, user preferences, current dirty state, implementation intent, decisions, mistakes, and the first recommended Linux actions.

## 1. Critical Current-State Warning

The current workspace is not a clean continuation of the green state from the previous implementation pass.

At the end of the previous pass, I had implemented a structured `examFocus` content model, rendered a new `ДЗИ фокус` UI block, added tests, and verified:

```sh
npm run test
npm run lint
npm run typecheck
npm run build
npm run check:asset-size
npm run test:e2e
```

All passed at that time.

However, when preparing this handoff, the workspace currently shows a different state:

- `src/content.config.ts` currently does not contain `examFocus`.
- `src/pages/literatura/[slug].astro` currently does not contain `examFocus` or `ДЗИ фокус`.
- All 27 literature JSON files currently parse with `examFocus=false`.
- Several literature JSON files appear to have the new title/genre explanation appended into `aboutWork` instead of stored structurally.
- `tests/e2e/smoke.spec.ts` currently has an assertion for the heading `Заглавие, въпрос, жанр`, which will likely fail unless the UI block is restored.
- `tests/content.spec.ts` currently shows only a stray added blank line in the content loop, not the intended `examFocus` assertion.
- `src/lib/library.ts` still has `examFocus` search fields in the type/search text path, even though the content schema/data currently do not expose `examFocus`.

This means the Linux continuation should start by choosing one of two paths:

1. Restore the structured `examFocus` model and UI block.
2. Accept the inline-in-`aboutWork` approach and remove/update the stale `examFocus` search/test remnants.

My recommendation is path 1: restore the structured `examFocus` model and UI block. It is cleaner, searchable, testable, and matches the critique better.

## 2. User Instructions And Preferences

User-provided project instruction:

```text
Act accordingly, but for anything UI-related, use taste-skill.
Use subagents when possible.
For generating images, read the Image-Gen skill.
```

Practical interpretation:

- UI work must follow `design-taste-frontend` / taste-skill.
- Subagents are allowed and preferred when useful. I used an explorer subagent to inspect architecture.
- No image generation was needed in the last task. If future work generates/edits images, read the Image-Gen skill first.

Taste-skill preferences that matter most here:

- No emoji in UI, code, alt text, or copy.
- Avoid generic cards and excessive boxed sections.
- Prefer quiet hierarchy through spacing, borders, typography, and restrained motion.
- Avoid purple/blue AI-gradient aesthetics.
- Avoid pure black where possible; current project uses a monochrome system with very dark neutrals.
- Keep mobile collapse solid and text non-overlapping.
- Use existing dependencies only unless `package.json` confirms availability. Current app has only `astro` as production dependency.
- CSS-first motion is appropriate. Do not add a motion library unless a future user request justifies it.
- Preserve existing typographic direction: Literata for editorial headings, Manrope for UI/body.

## 3. Project Purpose

Static Astro site for Bulgarian high-school ДЗИ preparation in Bulgarian language and literature.

Main libraries:

- Literature analyses.
- Bulgarian language/grammar modules.

Project brief says:

- Astro static build.
- JSON content collections.
- Mobile-first, edge-to-edge feeling.
- Automatic system dark/light mode.
- External links for reading works.
- Shared editorial design system for layout, catalog, and detail pages.
- Light motion layer with Astro ClientRouter and CSS animations, respecting reduced motion.
- No backend.
- No heavy media.
- Cloudflare Pages single-asset limit under 25 MiB.

## 4. Stack And Commands

`package.json`:

- Node engine: `>=22.12.0`.
- Production dependency: `astro`.
- Dev dependencies include Astro check, Playwright, Vitest, ESLint, TypeScript, AdmZip.

Important scripts:

```sh
npm run dev
npm run build
npm run preview
npm run generate:content
npm run typecheck
npm run lint
npm run test
npm run test:e2e
npm run check:asset-size
npm run verify
```

On Linux, after cloning/copying:

```sh
npm install
npm run test
npm run lint
npm run typecheck
npm run build
npm run check:asset-size
npm run test:e2e
```

Full verification:

```sh
npm run verify
```

Expected warning/hint:

- `astro check` may show a hint that `z.string().url()` is deprecated in `src/content.config.ts`.
- This was present before and did not block typecheck.

## 5. Current Git Status Snapshot

Observed while creating this handoff:

```text
 M .claude/settings.local.json
 M src/content/literature/andreshko.json
 M src/content/literature/az-iskam-da-te-pomnya-vse-taka.json
 M src/content/literature/balada-za-georg-henih.json
 M src/content/literature/balkanski-sindrom.json
 M src/content/literature/bay-ganyo-zhurnalist.json
 M src/content/literature/borba.json
 M src/content/literature/chesten-krast.json
 M src/content/literature/do-moeto-parvo-libe.json
 M src/content/literature/dve-dushi.json
 M src/content/literature/gradushka.json
 M src/content/literature/istoriya.json
 M src/content/literature/kolko-si-hubava.json
 M src/content/literature/kradetsat-na-praskovi.json
 M src/content/literature/molitva.json
 M src/content/literature/noev-kovcheg.json
 M src/content/literature/novoto-grobishte-nad-slivnitsa.json
 M src/content/literature/paisiy.json
 M src/content/literature/pesenta-na-koleletata.json
 M src/content/literature/posveshtenie.json
 M src/content/literature/potomka.json
 M src/content/literature/pri-rilskiya-manastir.json
 M src/content/literature/prikazka-za-stalbata.json
 M src/content/literature/spasova-mogila.json
 M src/content/literature/spi-ezeroto.json
 M src/content/literature/vetrenata-melnitsa.json
 M src/content/literature/vyara.json
 M src/content/literature/zhelezniyat-svetilnik.json
 M src/layouts/BaseLayout.astro
 M src/lib/library.ts
 M src/pages/bulgarski/[slug].astro
 M src/pages/literatura/[slug].astro
 M src/styles/components/cards.css
 M src/styles/components/switcher.css
 M src/styles/layout.css
 M src/styles/pages/grammar-detail.css
 M src/styles/tokens.css
 M tests/content.spec.ts
 M tests/e2e/smoke.spec.ts
?? Scanned.pdf
?? docs/research/
?? docs/ui-exam-focus-prompt.md
?? extract_css.py
?? home_raw.html
?? literatura.docx
?? refactor_json.cjs
?? scratch/
?? vyara_raw.html
```

Important:

- Do not casually revert these. Some are user or previous-session changes.
- `.claude/settings.local.json` is local tooling state and probably should not be committed unless the user explicitly wants it.
- `Scanned.pdf` and `literatura.docx` are large/reference source materials. They are currently untracked.
- `extract_css.py`, `home_raw.html`, `vyara_raw.html`, `refactor_json.cjs`, and `scratch/` look like helper/scratch artifacts. Inspect before deleting. Do not delete without user permission.
- `docs/ui-exam-focus-prompt.md` was intentionally created as a prompt/spec for the exam-focus UI update.

## 6. Architecture Map

Important files:

- `astro.config.mjs`
  - Static output.
  - Site URL: `https://dzipobel.wiki`.
  - Google fonts via Astro font providers: Literata and Manrope, Cyrillic + Latin.

- `src/content.config.ts`
  - Astro content collections.
  - `literature` collection from `src/content/literature/**/*.json`.
  - `grammar` collection from `src/content/grammar/**/*.json`.
  - Literature schema currently includes:
    - `order`
    - `title`
    - `author`
    - `genre`
    - `theme`
    - `excerpt`
    - `aboutAuthor`
    - `aboutWork`
    - `readUrl`
    - `readSource`
    - `motifs`
    - `conflicts`
    - `message`
    - `tags`
    - `sections`
    - optional `keyQuotes`
    - optional `essayAngles`
  - Intended structured addition was:
    ```ts
    examFocus: z
      .object({
        titleMeaning: z.string(),
        examRelevance: z.string(),
        genreRationale: z.string().optional(),
      })
      .optional(),
    ```

- `src/pages/index.astro`
  - Home/catalog page.
  - Loads both collections.
  - Derives grade from literature theme.
  - Literature filters: grade, theme, author, genre.
  - Grammar section grouped into `Език` and `Текст и писане`.
  - Inline JavaScript handles tab switcher, filter state, URL hash, search.

- `src/pages/literatura/[slug].astro`
  - Literature detail page.
  - Prerenders one page per literature JSON entry.
  - Renders hero, topbar, excerpt, author/work sections, composition/images/other sections, quotes, message, sidebar motifs/conflicts/devices.
  - Current file does not show `examFocus` at handoff time, but the intended UI belongs here after `За произведението`.

- `src/pages/bulgarski/[slug].astro`
  - Grammar detail page.
  - Sidebar/table of contents.
  - Quiz rendering.
  - Common mistakes, verification tricks, classified item styles.

- `src/layouts/BaseLayout.astro`
  - Shared HTML shell, meta tags, fonts, ClientRouter, nav, search button, footer.

- `src/lib/library.ts`
  - Search/index helpers.
  - Current diff includes `examFocus` optional type/search text, but content does not currently provide it. This mismatch should be resolved.

- `src/scripts/interactions.ts`
  - Scroll reveal.
  - Card tilt.
  - Grammar card interaction.
  - Search expansion behavior.

Styles:

- `src/styles/global.css`
  - Import hub.

- `src/styles/tokens.css`
  - Color, typography, layout, motion tokens.
  - Current theme is monochrome/minimal.

- `src/styles/layout.css`
  - Shell, nav, footer.

- `src/styles/components/hero.css`
  - Home hero.

- `src/styles/components/switcher.css`
  - Literature/grammar switcher, grade filters, dropdown filters.

- `src/styles/components/cards.css`
  - Home literature list.
  - Despite filename, current UI is line-list based and explicitly says "Strictly No Cards".

- `src/styles/components/grammar-nav.css`
  - Home grammar grouped navigation.

- `src/styles/components/accordion.css`
  - Older/details-compatible accordion styles.

- `src/styles/components/buttons.css`
  - Button primitives.

- `src/styles/components/interactive.css`
  - Grammar trick/mistake/quiz components.

- `src/styles/pages/literature-detail.css`
  - Literature detail hero, topbar, main/sidebar, quotes.
  - Intended exam-focus CSS should live here.

- `src/styles/pages/grammar-detail.css`
  - Grammar detail topbar, TOC, content sections.

- `src/styles/utilities.css`
  - Empty state, mobile overrides, reduced motion, `[hidden]`.

Tests:

- `tests/content.spec.ts`
  - Checks root planning files.
  - Checks 27 literature entries and reading links.
  - Checks 9 grammar modules.

- `tests/e2e/smoke.spec.ts`
  - Playwright smoke tests for home, filters, grammar section, literature detail, grammar detail.
  - Currently contains a stale `Заглавие, въпрос, жанр` assertion unless the UI block is restored.

- `tests/generate-content.test.mjs`
  - Parser tests for DOCX generation.

- `src/lib/library.test.ts`
  - Search/filter/index helper tests.

- Asset size tests/scripts protect Cloudflare Pages constraints.

## 7. Current Content Counts

Literature JSON entries: 27.

At handoff time, each parsed with `examFocus=false`:

```text
andreshko.json | Андрешко | Елин Пелин | Разказ
az-iskam-da-te-pomnya-vse-taka.json | Аз искам да те помня все така… | Димчо Дебелянов | Елегия
balada-za-georg-henih.json | Балада за Георг Хених | Виктор Пасков | Повест
balkanski-sindrom.json | Балкански синдром | Станислав Стратиев | Комедия
bay-ganyo-zhurnalist.json | Бай Ганьо журналист | Алеко Константинов | Фейлетон
borba.json | Борба | Христо Ботев | Стихотворение
chesten-krast.json | Честен кръст | Борис Христов | Поема
do-moeto-parvo-libe.json | До моето първо либе | Христо Ботев | Стихотворение
dve-dushi.json | Две души | Пейо Яворов | Стихотворение
gradushka.json | Градушка | Пейо Яворов | Поема
istoriya.json | История | Никола Вапцаров | Стихотворение
kolko-si-hubava.json | Колко си хубава! | Христо Фотев | Стихотворение
kradetsat-na-praskovi.json | Крадецът на праскови | Емилиян Станев | Повест
molitva.json | Молитва | Атанас Далчев | Стихотворение
noev-kovcheg.json | Ноев ковчег | Йордан Радичков | Роман
novoto-grobishte-nad-slivnitsa.json | Новото гробище над Сливница | Иван Вазов | Елегия
paisiy.json | Паисий (Ода от „Епопея на забравените“) | Иван Вазов | Ода
pesenta-na-koleletata.json | Песента на колелетата | Йордан Йовков | Разказ
posveshtenie.json | Посвещение | Петя Дубарова | Стихотворение
potomka.json | Потомка | Елисавета Багряна | Стихотворение
pri-rilskiya-manastir.json | При Рилския манастир | Иван Вазов | Стихотворение
prikazka-za-stalbata.json | Приказка за стълбата | Христо Смирненски | Притча
spasova-mogila.json | Спасова могила | Елин Пелин | Разказ
spi-ezeroto.json | Спи езерото | Пенчо Славейков | Лирическа миниатюра
vetrenata-melnitsa.json | Ветрената мелница | Елин Пелин | Разказ
vyara.json | Вяра | Никола Вапцаров | Стихотворение
zhelezniyat-svetilnik.json | Железният светилник | Димитър Талев | Роман
```

Grammar JSON entries: 9.

Known grammar modules:

- `Есе и интерпретативно съчинение`
- `Фонетика`
- `Лексикология`
- `Морфология`
- `Правопис`
- `Синтаксис и пунктуация`
- `Словообразуване`
- `Стилистика`
- `Текстолингвистика`

## 8. The Screenshot Critique

The screenshot was a Bulgarian chat critique. Translation/meaning:

```text
About this:
Add to the titles of the works:
what they mean in the context of the work,
why there is such a question on the matriculation exam,
for some or all of them.

And maybe, although it is not as necessary,
add to the genre of the work why it is characterized as that genre.

For example, it is an ode, and it becomes clear that it is one because of the praise.
But for some of them you already have that,
so I am saying it is not necessary.
```

Intent:

- Students need clearer exam-facing explanations.
- Especially title meaning and why exam questions ask about it.
- Genre explanation is useful but secondary.
- Some current `aboutWork` text already mentions title/genre, but not consistently or explicitly.

## 9. Intended Feature Design

Recommended model:

```json
"examFocus": {
  "titleMeaning": "...",
  "examRelevance": "...",
  "genreRationale": "..."
}
```

Recommended placement:

- Detail page only.
- After `За произведението`.
- Before `Композиция` / `Основни образи`.

Recommended UI:

- Small kicker: `ДЗИ фокус`.
- Heading: `Заглавие, въпрос, жанр`.
- Three rows:
  - `Какво значи заглавието`
  - `Защо го питат на ДЗИ`
  - `Защо жанрът е такъв`
- Desktop: two-column row layout, label left, prose right.
- Mobile: one-column stacked rows.
- Use borders and whitespace, not shadows.
- Keep it quiet and editorial.

Recommended CSS:

```css
.lit-section-kicker {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--soft);
  margin: 0 0 8px;
}

.lit-exam-focus {
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  padding: 28px 0 8px;
}

.lit-focus-grid {
  display: grid;
  gap: 0;
  border-top: 1px solid var(--line);
}

.lit-focus-row {
  display: grid;
  grid-template-columns: minmax(140px, 0.42fr) 1fr;
  gap: 24px;
  padding: 18px 0;
  border-bottom: 1px solid var(--line);
}

.lit-focus-label {
  font-family: var(--sans);
  font-size: 12px;
  font-weight: 700;
  line-height: 1.45;
  color: var(--muted);
  margin: 0;
}

.lit-focus-text {
  font-size: 15px;
  color: var(--text);
  line-height: 1.75;
  margin: 0;
}
```

Mobile override:

```css
@media (max-width: 720px) {
  .lit-focus-row {
    grid-template-columns: 1fr;
    gap: 6px;
    padding: 16px 0;
  }
}
```

## 10. UI Prompt File

I created:

```text
docs/ui-exam-focus-prompt.md
```

Purpose:

- Reusable prompt/spec for exactly this exam-focus UI update.
- It explicitly says to use taste-skill and preserve the current dzipobel design language.
- It includes data model, placement, visual constraints, and acceptance checks.

At handoff time it is untracked. It should probably be committed with the feature.

## 11. Mistakes And Lessons From The Previous Pass

Mistake 1: PowerShell-to-Node pipe mangled Cyrillic.

What happened:

- I tried to bulk-add `examFocus` to JSON files with a Node script passed through a PowerShell here-string pipe.
- The Cyrillic in the script was converted to question marks in the new fields.
- Old content remained intact.

Bad symptom:

```text
"titleMeaning": "?????????? ..."
```

Lesson:

- On Linux, this exact PowerShell issue goes away, but still be careful with encodings.
- Prefer editing a real UTF-8 `.cjs` script file or using `apply_patch` for content changes.
- If using Node, read and write UTF-8 explicitly.

Safe Node rewrite pattern:

```js
const text = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
const data = JSON.parse(text);
data.examFocus = examFocus;
fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
```

Mistake 2: PowerShell `Set-Content -Encoding utf8` introduced BOM.

What happened:

- I repaired the question-mark strings using PowerShell JSON conversion.
- Files then had a BOM, and Node `JSON.parse` choked until stripping `\uFEFF`.

Lesson:

- On Linux, avoid BOM entirely.
- Add a BOM strip in scripts if reading files that may have passed through Windows tools.

Mistake 3: Current workspace drift.

What happened:

- The green state from the previous pass does not match the state observed while writing this handoff.
- Structured `examFocus` is absent in current content/schema/UI.
- Some explanatory text appears appended into `aboutWork`.
- One e2e assertion still expects the structured UI heading.

Lesson:

- First Linux action should be a reality check with `git diff`, `rg "examFocus|ДЗИ фокус|Заглавие, въпрос, жанр"`, and `npm run test:e2e`.
- Do not assume the prior final answer equals the current filesystem state.

## 12. Recommended First Linux Steps

From repo root:

```sh
node --version
npm --version
npm install
git status --short
rg "examFocus|ДЗИ фокус|Заглавие, въпрос, жанр" src tests docs
npm run test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Expected likely issue:

- `npm run test:e2e` may fail on the literature detail test because `tests/e2e/smoke.spec.ts` expects `Заглавие, въпрос, жанр`, but the current UI does not render it.

Decision point:

- If restoring structured `examFocus`, keep the e2e assertion and implement schema/data/UI.
- If keeping inline `aboutWork`, remove/change the e2e assertion and remove `examFocus` from `src/lib/library.ts`.

## 13. How To Restore Structured `examFocus`

Step 1: Add schema field to `src/content.config.ts` in the literature schema after `message`.

```ts
examFocus: z
  .object({
    titleMeaning: z.string(),
    examRelevance: z.string(),
    genreRationale: z.string().optional(),
  })
  .optional(),
```

Step 2: Add a local type and variable to `src/pages/literatura/[slug].astro`.

```ts
type ExamFocus = {
  titleMeaning: string;
  examRelevance: string;
  genreRationale?: string;
};

const examFocus = entry.data.examFocus as ExamFocus | undefined;
```

Step 3: Render after `За произведението`.

```astro
{examFocus && (
  <section class="lit-section lit-reveal lit-exam-focus" aria-labelledby="exam-focus-title">
    <p class="lit-section-kicker">ДЗИ фокус</p>
    <h2 class="lit-section-title" id="exam-focus-title">Заглавие, въпрос, жанр</h2>
    <div class="lit-focus-grid">
      <div class="lit-focus-row">
        <h3 class="lit-focus-label">Какво значи заглавието</h3>
        <p class="lit-focus-text">{examFocus.titleMeaning}</p>
      </div>
      <div class="lit-focus-row">
        <h3 class="lit-focus-label">Защо го питат на ДЗИ</h3>
        <p class="lit-focus-text">{examFocus.examRelevance}</p>
      </div>
      {examFocus.genreRationale && (
        <div class="lit-focus-row">
          <h3 class="lit-focus-label">Защо жанрът е такъв</h3>
          <p class="lit-focus-text">{examFocus.genreRationale}</p>
        </div>
      )}
    </div>
  </section>
)}
```

Step 4: Add CSS to `src/styles/pages/literature-detail.css` and mobile override in `src/styles/utilities.css` or the page CSS.

Step 5: Add `examFocus` to all 27 literature JSON files.

Important: do not append this content into `aboutWork` if using the structured approach. If appended text already exists, decide whether to leave it, move it into `examFocus`, or deduplicate it.

Step 6: Search integration.

`src/lib/library.ts` already has intended optional `examFocus` type/search additions. Ensure `src/pages/index.astro` also includes `entry.data.examFocus?.titleMeaning`, `examRelevance`, and `genreRationale` in `data-search-text`.

Step 7: Tests.

Content test recommended:

```ts
expect(entry.value.examFocus).toMatchObject({
  titleMeaning: expect.any(String),
  examRelevance: expect.any(String),
});
```

E2E test recommended:

```ts
await expect(
  page.getByRole("heading", { name: "Заглавие, въпрос, жанр" }),
).toBeVisible();
```

## 14. Content Drafts Used For `examFocus`

These were the structured explanations I previously wrote. Reuse or improve them. They are intentionally concise and exam-facing.

### andreshko.json

Title meaning:
Заглавието превръща името на героя в знак за цял тип поведение: умния, привидно покорен човек от народа, който намира пролука в несправедливата власт. То насочва вниманието към личността, защото именно характерът на Андрешко движи сюжета.

Exam relevance:
Такъв въпрос проверява дали можеш да свържеш героя с темата за обществото и властта: законът е на страната на чиновника, но нравствената справедливост е на страната на бедния човек. Заглавието помага да се обясни защо съпротивата тук е хитрост, а не открит бунт.

Genre rationale:
Творбата е разказ, защото е кратка проза с ограничен брой герои, концентрирано действие и силен финален обрат. Една случка разкрива цял социален конфликт.

### az-iskam-da-te-pomnya-vse-taka.json

Title meaning:
Заглавието е първият стих и звучи като желание споменът да остане непроменен. То веднага поставя любовта в полето на паметта, раздялата и страха от загубата.

Exam relevance:
На ДЗИ подобен въпрос проверява дали виждаш как заглавието събира основния конфликт: любовното чувство и невъзможността да се задържи живият миг. То е ключ към темата за любовта като спомен, а не като притежание.

Genre rationale:
Творбата е елегия, защото доминират скръбта, предчувствието за раздяла, приглушеният тон и опитът красотата да бъде съхранена в паметта.

### balada-za-georg-henih.json

Title meaning:
Заглавието нарича историята „балада“, макар творбата да е повест, за да подчертае легендарното, тъжното и възвишеното около стария майстор. Името Георг Хених поставя в центъра човека, чрез когото изкуството получава морален смисъл.

Exam relevance:
Въпросът за заглавието е важен, защото чрез него се вижда двойният план на творбата: реалистичен спомен от бедното детство и почти митологичен разказ за твореца. Така се защитава темата за труда и творчеството като духовно призвание.

Genre rationale:
Жанрово творбата е повест: има по-голям обем от разказ, развива споменен сюжет, няколко образни линии и психологическо израстване на разказвача. Баладичността е художествен тон, не основният жанр.

### balkanski-sindrom.json

Title meaning:
Заглавието звучи като диагноза. „Синдромът“ назовава повтарящите се болести на балканското общество: подозрителност, дребна хитрост, хаос, самозатваряне и комично неразбиране на другия.

Exam relevance:
На ДЗИ то е удобен вход към темата за родното и чуждото, защото пита не само какво е „балканско“, а как творбата осмива нашите собствени навици. Заглавието показва, че смешното има критическа функция.

Genre rationale:
Творбата е комедия, защото изгражда конфликтите чрез абсурдни ситуации, остър диалог, преувеличение и смях, който разкрива обществени дефекти.

### bay-ganyo-zhurnalist.json

Title meaning:
Заглавието сблъсква Бай Ганьо с публичната роля на журналиста. Така името на героя вече не обозначава само частен човек, а тип поведение, което влиза в политиката, печата и обществения живот.

Exam relevance:
Такъв въпрос проверява дали можеш да видиш как заглавието насочва към опасната страна на героя: смешният простак става обществен фактор. Това е ключово за темата за родното, изкривената модерност и гражданската безотговорност.

Genre rationale:
Творбата е фейлетон, защото е кратка сатирична проза с публицистична острота, актуален обществен прицел и разобличаване на морална уродливост чрез смях.

### borba.json

Title meaning:
Заглавието назовава не единична битка, а постоянен духовен и обществен сблъсък. „Борба“ означава отказ от примирение пред лъжата, робското мислене и лицемерната власт.

Exam relevance:
На ДЗИ въпросът за заглавието проверява дали разбираш, че конфликтът е едновременно социален и нравствен. То свързва Ботевата критика към обществото с идеята за свободния човек, който не приема фалшив ред.

Genre rationale:
Творбата е стихотворение с ярка гражданска интонация: лирическият говорител изразява позиция, гняв и ценностен избор чрез ритъм, реторични обръщения и контрасти.

### chesten-krast.json

Title meaning:
Заглавието звучи като клетва и като морална тежест. То насочва към честта, вярата и трудния избор, при който човек трябва да носи своя „кръст“, без да се откаже от себе си.

Exam relevance:
Въпросът е важен, защото заглавието събира темата за избора и раздвоението: дали човек ще остане верен на нравствения си закон, когато светът около него го принуждава да се огъне.

Genre rationale:
Творбата е поема, защото развива по-широк лирико-философски конфликт, надхвърля краткия момент и изгражда обобщен образ на човешко изпитание.

### do-moeto-parvo-libe.json

Title meaning:
Заглавието започва като интимно обръщение към първата любима, но в самата творба личната любов е изместена от революционния дълг. То показва прехода от частно чувство към исторически избор.

Exam relevance:
На ДЗИ то проверява дали можеш да обясниш защо темата за любовта при Ботев не е отделена от темата за смъртта и свободата. Заглавието е отправната точка за отказа от спокойния личен живот.

Genre rationale:
Творбата е стихотворение, защото представлява лирическо обръщение с изповедна, призивна и гражданска енергия, концентрирана около гласа на лирическия герой.

### dve-dushi.json

Title meaning:
Заглавието назовава вътрешното раздвоение на модерния човек. Двете души не са две личности, а два непримирими порива в един и същи Аз.

Exam relevance:
Такъв въпрос проверява дали разбираш, че конфликтът не е външен, а психологически и философски. Заглавието е ключ към темата за избора, вината, невъзможното единство и самонаблюдението.

Genre rationale:
Творбата е стихотворение, защото разгъва вътрешно състояние чрез сгъстен лирически език, символи и изповедна напрегнатост, а не чрез сюжетно действие.

### gradushka.json

Title meaning:
Заглавието посочва природно бедствие, но в творбата градушката става символ на безмилостната съдба и на разрушената надежда на селския човек.

Exam relevance:
На ДЗИ заглавието помага да се види как темата за природата не е идилия, а трагична сила. То насочва към сблъсъка между човешкия труд и стихийното унищожение.

Genre rationale:
Творбата е поема, защото има разгърната композиция, епизодичност, драматично напрежение и широк образ на общностно страдание, а не само кратък лирически миг.

### istoriya.json

Title meaning:
Заглавието поставя въпроса кой влиза в паметта на историята. При Вапцаров това не са само великите имена, а безименните хора на труда, чиито животи често остават незаписани.

Exam relevance:
Въпросът е важен за темата за миналото и паметта: ученикът трябва да покаже, че творбата спори с официалната история и настоява за човешка, социална памет.

Genre rationale:
Творбата е стихотворение с гражданска и разговорна интонация: лирическият говорител води пряк спор с историята и превръща личното обръщение в обществена позиция.

### kolko-si-hubava.json

Title meaning:
Заглавието е възклицание, което превръща любимата в център на възхищение. То не описва спокойно красотата, а я преживява като внезапно откровение.

Exam relevance:
На ДЗИ заглавието е ключ към темата за любовта като възторг, преклонение и невъзможност да се изчерпи образът на любимата. То показва как повторението и удивлението изграждат лирическия свят.

Genre rationale:
Творбата е стихотворение, защото изразява концентрирано любовно преживяване чрез лирически говор, ритъм, повторения и емоционална интензивност.

### kradetsat-na-praskovi.json

Title meaning:
Заглавието започва с привидно битов образ на „крадец“, но постепенно се оказва знак за забранената любов и за жаждата за живот сред война, плен и смърт.

Exam relevance:
Такъв въпрос проверява дали виждаш как малкият сюжетен детайл отключва голямата тема: любовта като нарушение на реда, но и като спасение от обезчовечаването.

Genre rationale:
Творбата е повест, защото има по-широко разгърнат сюжет от разказа, психологическа дълбочина, няколко ключови образа и устойчив конфликт между личното чувство и историческата среда.

### molitva.json

Title meaning:
Заглавието насочва към молитвата не само като религиозен жест, а като вътрешна потребност от смисъл, надежда и духовна опора. То въвежда разговора на човека със самия себе си и с висшата ценност.

Exam relevance:
На ДЗИ то е важно, защото проверява дали можеш да свържеш вярата с личния морален избор, а не само с църковна религиозност. Заглавието помага да се обясни защо надеждата е форма на духовна устойчивост.

Genre rationale:
Творбата е стихотворение, защото предава вътрешно състояние и ценностна позиция чрез лирически говор, сгъстени образи и молитвена интонация.

### noev-kovcheg.json

Title meaning:
Заглавието препраща към библейския ковчег, който съхранява живота след потопа. При Радичков то се превръща в образ на паметта, разказа и спасените следи от един изчезващ свят.

Exam relevance:
Въпросът проверява дали разбираш как заглавието свързва миналото, паметта и спасението чрез словото. То показва защо разказването е начин общността да не бъде заличена.

Genre rationale:
Творбата е роман, защото изгражда широк, фрагментарен свят с множество образи, спомени и повествователни линии, обединени от идеята за паметта.

### novoto-grobishte-nad-slivnitsa.json

Title meaning:
Заглавието посочва конкретно място на паметта: гробището над Сливница. Думата „новото“ подчертава пресността на жертвата и близостта на националната болка.

Exam relevance:
На ДЗИ то проверява дали можеш да свържеш смъртта с паметта и признателността. Заглавието показва, че творбата не просто оплаква, а превръща загиналите в морален знак за общността.

Genre rationale:
Творбата е елегия, защото е изградена върху скръб, спомен, поклон пред мъртвите и тихо възвишен тон.

### paisiy.json

Title meaning:
Заглавието поставя Паисий като име-символ на пробуждането. Уточнението, че е ода от „Епопея на забравените“, насочва към възстановяване на паметта за националните будители.

Exam relevance:
Такъв въпрос проверява дали можеш да свържеш личността с темата за миналото и паметта: Паисий е важен не само като историческа фигура, а като начало на национално самосъзнание.

Genre rationale:
Творбата е ода, защото възхвалява героя с тържествен тон, реторични обръщения, патос и издигаща образа композиция.

### pesenta-na-koleletata.json

Title meaning:
Заглавието превръща звука на труда в песен. Колелетата не са само част от занаята на Сали Яшар, а знак за хармонията между майсторство, красота и добро.

Exam relevance:
На ДЗИ то помага да се обясни защо трудът в творбата е творчество, а не просто поминък. Заглавието свързва предметния свят с духовната следа, която човек оставя.

Genre rationale:
Творбата е разказ, защото чрез една концентрирана история и ограничен кръг образи разкрива нравственото прозрение на героя.

### posveshtenie.json

Title meaning:
Заглавието означава даряване на слово, чувство и памет към друг човек. То подсказва, че любовта е не само преживяване, а акт на обръщане и съхраняване.

Exam relevance:
Въпросът за заглавието проверява дали можеш да видиш адресата и жеста на отдаване. Така темата за любовта се мисли като духовна близост, а не само като лично вълнение.

Genre rationale:
Творбата е стихотворение, защото е лирическо обръщение с изповедна интонация, емоционална концентрация и образност, подчинена на вътрешното преживяване.

### potomka.json

Title meaning:
Заглавието назовава лирическата героиня като наследница. То насочва към връзката с рода, кръвта, паметта и свободния порив, който идва от предците.

Exam relevance:
На ДЗИ то е ключ към темата за избора и раздвоението: героинята е между културната норма и наследената стихийност. Заглавието помага да се докаже, че свободата е част от нейната идентичност.

Genre rationale:
Творбата е стихотворение, защото изгражда лирически автопортрет чрез образи, ритъм и вътрешен монолог, а не чрез разгърнат сюжет.

### pri-rilskiya-manastir.json

Title meaning:
Заглавието посочва място, където природата, историята и духовността се срещат. Рилският манастир е едновременно реален топос и символ на национална памет.

Exam relevance:
Такъв въпрос проверява дали можеш да обясниш природата не като фон, а като духовно пространство. Заглавието свързва красотата на пейзажа с българската културна памет.

Genre rationale:
Творбата е стихотворение, защото представя лирическо преживяване на мястото чрез описание, възхищение, ритъм и емоционално обобщение.

### prikazka-za-stalbata.json

Title meaning:
Заглавието нарича творбата „приказка“, но стълбата е алегория на социалното изкачване, при което човек губи памет, състрадание и морал. То подсказва, че пътят нагоре може да бъде духовно падане.

Exam relevance:
На ДЗИ това е важен въпрос, защото заглавието отключва смисъла на властта като изкушение. То позволява да се обясни как творбата показва цената на компромиса.

Genre rationale:
Творбата е притча, защото краткият алегоричен сюжет води към ясен нравствен извод: властта обезличава човека, ако той продаде сетивата и паметта си.

### spasova-mogila.json

Title meaning:
Заглавието съчетава място и надежда за спасение. „Спасова“ носи религиозен смисъл, а „могила“ насочва към земя, памет, болест и смъртност.

Exam relevance:
Въпросът проверява дали разбираш двойността на творбата: вярата е утеха, но и болезнено очакване. Заглавието помага да се свържат надеждата, страданието и човешката уязвимост.

Genre rationale:
Творбата е разказ, защото чрез ограничена случка, малко герои и силно емоционално ядро разкрива драмата на бедността, болестта и надеждата.

### spi-ezeroto.json

Title meaning:
Заглавието представя езерото като живо същество, потънало в сън. То въвежда тишина, хармония и скрито напрежение между покоя и вътрешния живот на природата.

Exam relevance:
На ДЗИ то проверява дали можеш да анализираш природната картина като символ, не като обикновено описание. Заглавието е ключ към темата за природата като духовно състояние.

Genre rationale:
Творбата е лирическа миниатюра, защото е кратка, сгъстена и изгражда един фин природен миг с максимална образна икономия.

### vetrenata-melnitsa.json

Title meaning:
Заглавието обозначава мечтата за невъзможно съзидание. Ветрената мелница е едновременно смешен проект, символ на жизнената енергия и поводът, чрез който се ражда любовта.

Exam relevance:
Такъв въпрос проверява дали разбираш, че трудът и творчеството тук не се измерват само с резултат. Заглавието показва как една недовършена мелница може да доведе до пълноценен човешки живот.

Genre rationale:
Творбата е разказ, защото е концентрирана около една случка, няколко ярки образа и финално преобръщане на смисъла: от проект към любов.

### vyara.json

Title meaning:
Заглавието назовава основната опора на човека. При Вапцаров вярата не е абстрактна дума, а жизнена сила, без която човекът се обезсмисля.

Exam relevance:
На ДЗИ то е пряк вход към темата за вярата и надеждата: трябва да се покаже защо вярата е условие за живот, труд, творчество и бъдеще, а не украшение към тях.

Genre rationale:
Творбата е стихотворение, защото чрез лирически говор, ритъм и директна изповед формулира светогледна позиция за човека и живота.

### zhelezniyat-svetilnik.json

Title meaning:
Заглавието превръща домашния светилник в символ на рода, паметта и устойчивостта. „Железен“ подсказва здравина, воля и непрекъснатост, а светлината е знак за живата българска идентичност.

Exam relevance:
На ДЗИ въпросът за заглавието проверява дали можеш да свържеш предметния символ с големите теми: родното и чуждото, дома, езика, традицията и историческото пробуждане.

Genre rationale:
Творбата е роман, защото разгъва широк исторически, семеен и обществен свят с много герои, сюжетни линии и развитие през поколения.

## 15. Possible Data Rewrite Script For Linux

If restoring structured `examFocus`, write a real file such as `scripts/apply-exam-focus.mjs` or run a temporary Node script from a UTF-8 file. Avoid shell-escaped one-liners for long Bulgarian text.

Pseudo-pattern:

```js
import fs from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "src/content/literature");
const focusByFile = {
  "vyara.json": {
    titleMeaning: "...",
    examRelevance: "...",
    genreRationale: "...",
  },
};

for (const [file, examFocus] of Object.entries(focusByFile)) {
  const filePath = path.join(dir, file);
  const data = JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
  data.examFocus = examFocus;
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}
```

Then verify:

```sh
node - <<'NODE'
const fs=require('fs'), path=require('path');
const dir='src/content/literature';
const missing=[];
for (const f of fs.readdirSync(dir).filter(f=>f.endsWith('.json'))) {
  const d=JSON.parse(fs.readFileSync(path.join(dir,f),'utf8').replace(/^\uFEFF/, ''));
  if (!d.examFocus) missing.push(f);
}
console.log({ missing, count: fs.readdirSync(dir).filter(f=>f.endsWith('.json')).length });
NODE
```

Expected:

```text
{ missing: [], count: 27 }
```

## 16. Existing Design Direction

Current UI idea:

- Minimalist Bulgarian study library.
- Editorial rather than dashboard.
- Serious, quiet, reading-oriented.
- Home page is not a marketing page; it is the actual catalog.
- Literature list is not card-heavy. It is a line-based list with hover translation and dimming.
- Grammar home section is grouped navigation, also line-based.
- Detail pages are split into main prose and right sidebar.
- The right sidebar can use bordered blocks because they are functional reference chunks.
- Motion is subtle: reveal, topbar, switcher transitions.
- Fonts:
  - Literata for literary/headline tone.
  - Manrope for UI and body.
- Colors:
  - Light: white/off-white, black-ish text, gray lines.
  - Dark: very dark background, soft grays, not colorful.

Do not turn the exam-focus feature into:

- marketing hero,
- bento dashboard,
- colorful callout,
- gradient section,
- separate floating card,
- cartoon/emoji hint box.

It should feel like an editorial annotation inside the study page.

## 17. Known Project Quirks

- `README.md` is still the default Astro starter README and does not describe this app.
- `PROJECT_BRIEF.md`, `STATE.yaml`, and `LOG.md` are the better project memory files.
- `scripts/generate-content.mjs` can regenerate content from DOCX and may overwrite manual JSON changes. If `examFocus` is important, either:
  - add preservation logic to the generator, or
  - do not run `npm run generate:content` without backing up/merging `examFocus`.
- The generated `dist/` directory is present and changes after builds.
- `.astro/` is generated.
- `node_modules/` exists in the Windows workspace; Linux should run `npm install` for native/platform consistency.
- Playwright config:
  - `playwright.config.ts` builds then previews on `127.0.0.1:4173`.
  - Tests run desktop and mobile projects.

## 18. Verification History

Previous green verification after structured exam-focus implementation:

- `npm run test`: 6 files, 16 tests passed.
- `npm run lint`: passed.
- `npm run typecheck`: passed, with one Astro/Zod deprecation hint.
- `npm run build`: 37 pages built.
- `npm run check:asset-size`: passed.
- `npm run test:e2e`: 10 passed across desktop/mobile.

Because current workspace drifted, do not rely on this as current truth. Re-run on Linux.

## 19. Recommended Commit Strategy

Do not make one huge blind commit.

Suggested separation:

1. Commit intentional UI/content feature:
   - `src/content.config.ts`
   - `src/pages/literatura/[slug].astro`
   - `src/styles/pages/literature-detail.css`
   - `src/styles/utilities.css` if used
   - `src/lib/library.ts`
   - `src/pages/index.astro` if search text is updated
   - all 27 `src/content/literature/*.json`
   - `tests/content.spec.ts`
   - `tests/e2e/smoke.spec.ts`
   - `docs/ui-exam-focus-prompt.md`
   - this handoff file

2. Commit unrelated UI refactors only after reviewing them:
   - `src/layouts/BaseLayout.astro`
   - `src/pages/bulgarski/[slug].astro`
   - `src/styles/components/cards.css`
   - `src/styles/components/switcher.css`
   - `src/styles/layout.css`
   - `src/styles/pages/grammar-detail.css`
   - `src/styles/tokens.css`

3. Do not commit local/scratch files unless intended:
   - `.claude/settings.local.json`
   - `extract_css.py`
   - `home_raw.html`
   - `vyara_raw.html`
   - `refactor_json.cjs`
   - `scratch/`
   - large PDFs/DOCX unless the project wants them versioned.

## 20. One-Screen Next-Agent Checklist

Start Linux session with:

```sh
git status --short
rg "examFocus|ДЗИ фокус|Заглавие, въпрос, жанр" src tests docs
npm install
npm run test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Then decide:

- Restore structured `examFocus` and the UI block, recommended.
- Or remove stale `examFocus` remnants and e2e assertion, not recommended because it loses structure.

Most likely immediate fix:

- Re-add `examFocus` to schema.
- Move/apply the 27 content drafts into JSON `examFocus`.
- Re-add the `ДЗИ фокус` renderer after `За произведението`.
- Add CSS rows.
- Ensure home search includes exam focus text.
- Make `tests/content.spec.ts` assert `examFocus`.
- Keep `tests/e2e/smoke.spec.ts` heading assertion.
- Run full verification.


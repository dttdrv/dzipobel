# UI Update Prompt: Literature Exam Focus

Use `design-taste-frontend` / taste-skill.

Implement a quiet, editorial “ДЗИ фокус” block on every literature detail page. The goal is to answer the critique that students need more explicit help with:

- what the work title means in the context of the work;
- why the matriculation exam might ask about that title or context;
- why the listed genre fits the work.

Keep the current dzipobel visual idea: monochrome, line-based, low-noise, serious study-tool UI with Literata headings, Manrope body text, system dark/light mode, and CSS-first motion. Do not make a flashy card section, landing-style feature panel, gradient block, emoji UI, or decorative illustration.

Data model:

- Add an optional `examFocus` object to each literature entry.
- Shape: `titleMeaning`, `examRelevance`, optional `genreRationale`.
- Keep it searchable from the home page.

Detail page placement:

- Render the block after “За произведението” and before composition/images sections.
- Use the title “Заглавие, въпрос, жанр” with a small “ДЗИ фокус” kicker.
- Render each item as a row with a compact label on the left and readable prose on the right.
- On mobile, collapse rows to one column.

Visual constraints:

- Use borders and spacing for hierarchy, not shadows.
- Keep text sizes close to existing `.lit-section-*` styles.
- Preserve the two-column literature detail layout and inline mobile sidebar.
- Respect reduced motion and existing reveal behavior.

Acceptance checks:

- Every literature JSON record has `examFocus`.
- Astro content schema validates.
- `/literatura/vyara/` shows the new block.
- Home search includes the new focus copy.
- `npm run test`, `npm run typecheck`, and `npm run build` pass.

# LOG

## 2026-03-17
- Added Astro layout, page structure, and dark/light system theme behavior.
- Added route scaffolds for home, literature catalog/detail, and grammar catalog/detail.
- Added DOCX-to-JSON content generation for literature and grammar collections.
- Added project records required by the workspace instructions.
- Reworked the UI into a single editorial design system instead of mixed, incompatible page styles.
- Redesigned home, literature, grammar, and detail pages around the active shared CSS primitives.
- Fixed Playwright smoke coverage so catalog filtering is asserted through visible cards, not stale heading visibility.
- Excluded Playwright suites from Vitest and enabled Playwright to reuse an existing local dev server.
- Refined the UI with a stronger typography system, cleaner catalog cards, improved mobile edge-to-edge spacing, and Bulgarian footer credit copy.
- Fixed catalog summaries and Playwright selectors so singular counts and search flows are stable on desktop and mobile.
- Verified test, lint, typecheck, build, asset-size, Playwright e2e, and Trivy scan results.

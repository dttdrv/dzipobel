import fs from 'fs';

let layout = fs.readFileSync('src/layouts/BaseLayout.astro', 'utf-8');

layout = layout.replace(
  '<div class={`float-title ${detailTitle ? "float-title--center" : ""}`} data-float-title>\n        {detailTitle ? detailTitle : "ДЗИ по БЕЛ"}\n      </div>',
  `{(!isDetail || detailTitle) && (
        <div class={\`float-title \${detailTitle ? "float-title--center" : ""}\`} data-float-title>
          {detailTitle ? detailTitle : "ДЗИ по БЕЛ"}
        </div>
      )}`
);

layout = layout.replace(
  '<div class="float-right">\n        {readUrl && (\n          <a class="float-read" href={readUrl} target="_blank" rel="noreferrer">Прочети ↗</a>\n        )}\n        <a class="float-instagram" href="https://www.instagram.com/dttdrv/" target="_blank" rel="noreferrer" aria-label="Instagram @dttdrv">\n          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">\n            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>\n            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>\n            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>\n          </svg>\n          <span>@dttdrv</span>\n        </a>\n      </div>',
  `<div class="float-right">
        {!isDetail && (
          <>
            {readUrl && (
              <a class="float-read" href={readUrl} target="_blank" rel="noreferrer">Прочети ↗</a>
            )}
            <a class="float-instagram" href="https://www.instagram.com/dttdrv/" target="_blank" rel="noreferrer" aria-label="Instagram @dttdrv">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
              <span>@dttdrv</span>
            </a>
          </>
        )}
      </div>`
);

fs.writeFileSync('src/layouts/BaseLayout.astro', layout);
console.log('BaseLayout.astro updated');

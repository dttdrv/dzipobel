import { describe, expect, it } from 'vitest';

import { parseGrammarLines, parseLiteratureLines, slugify } from '../scripts/generate-content.mjs';

describe('slugify', () => {
  it('normalizes Bulgarian and punctuation-heavy titles into stable slugs', () => {
    expect(slugify('Аз искам да те помня все така…')).toBe('az-iskam-da-te-pomnya-vse-taka');
    expect(slugify('Балада за Георг Хених')).toBe('balada-za-georg-henih');
  });
});

describe('parseLiteratureLines', () => {
  it('groups works under the current theme and extracts the core sections', () => {
    const works = parseLiteratureLines([
      'ЛЮБОВ',
      '“Колко си хубава!” (Стихотворение) - Христо Фотев',
      'ЗА АВТОРА',
      'Христо Фотев е морският лирик на любовта.',
      'ЗА ПРОИЗВЕДЕНИЕТО',
      'Творбата възпява красотата и непостижимостта на любимата.',
      'Мотивите са:',
      'Любовта',
      'Красотата',
      'Конфликтите са:',
      'Между възторга и невъзможността',
      'Творбата отправя послание за силата на любовното преклонение.'
    ]);

    expect(works).toHaveLength(1);
    expect(works[0]).toMatchObject({
      theme: 'Любов',
      title: 'Колко си хубава!',
      author: 'Христо Фотев',
      genre: 'Стихотворение'
    });
    expect(works[0].aboutAuthor).toContain('морският лирик');
    expect(works[0].aboutWork).toContain('възпява');
    expect(works[0].motifs).toEqual(['Любовта', 'Красотата']);
    expect(works[0].conflicts).toEqual(['Между възторга и невъзможността']);
    expect(works[0].message).toContain('силата на любовното преклонение');
  });
});

describe('parseGrammarLines', () => {
  it('groups subsections under the three major modules', () => {
    const modules = parseGrammarLines([
      'МОРФОЛОГИЯ',
      'ОПРЕДЕЛЕНИЕ',
      'Морфологията изучава частите на речта.',
      'СЪЩЕСТВИТЕЛНО ИМЕ',
      'Назовава предмети и явления.',
      'СИНТАКСИС',
      'ОПРЕДЕЛЕНИЕ',
      'Синтаксисът изучава изречението.',
      'ПРАВОПИС',
      'С ГЛАВНА БУКВА СЕ ПИШАТ',
      'Собствени имена.'
    ]);

    expect(modules.map((module) => module.module)).toEqual(['Морфология', 'Синтаксис', 'Правопис']);
    expect(modules[0].sections[0].title).toBe('Определение');
    expect(modules[0].sections[1].title).toBe('Съществително име');
    expect(modules[2].sections[0].title).toBe('С главна буква се пишат');
  });
});

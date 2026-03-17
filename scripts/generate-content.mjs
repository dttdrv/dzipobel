import { existsSync } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import AdmZip from "adm-zip";

const DOWNLOADS_DIRECTORY = "C:/Users/deyan/Downloads";
const OUTPUT_ROOT = path.resolve("src/content");
const LITERATURE_OUTPUT = path.join(OUTPUT_ROOT, "literature");
const GRAMMAR_OUTPUT = path.join(OUTPUT_ROOT, "grammar");

const DOC_PATHS = {
  literature: [
    path.join(DOWNLOADS_DIRECTORY, "ЛИТЕРАТУРА (1).docx"),
    path.join(DOWNLOADS_DIRECTORY, "ЛИТЕРАТУРА.docx"),
  ],
  grammar: [path.join(DOWNLOADS_DIRECTORY, "БЪЛГАРСКИ.docx")],
};

const CYRILLIC_TO_LATIN = new Map([
  ["а", "a"],
  ["б", "b"],
  ["в", "v"],
  ["г", "g"],
  ["д", "d"],
  ["е", "e"],
  ["ж", "zh"],
  ["з", "z"],
  ["и", "i"],
  ["й", "y"],
  ["к", "k"],
  ["л", "l"],
  ["м", "m"],
  ["н", "n"],
  ["о", "o"],
  ["п", "p"],
  ["р", "r"],
  ["с", "s"],
  ["т", "t"],
  ["у", "u"],
  ["ф", "f"],
  ["х", "h"],
  ["ц", "ts"],
  ["ч", "ch"],
  ["ш", "sh"],
  ["щ", "sht"],
  ["ъ", "a"],
  ["ь", "y"],
  ["ю", "yu"],
  ["я", "ya"],
]);

const WORK_HEADER_PATTERN = /^[„“"](.+?)[”"“] \((.+?)\) - (.+?)(?:\s+необновено)?$/u;
const MAJOR_GRAMMAR_MODULES = new Set(["МОРФОЛОГИЯ", "СИНТАКСИС", "ПРАВОПИС"]);

const READ_LINKS = {
  "Аз искам да те помня все така…": {
    readUrl: "https://chitanka.info/text/37731-az-iskam-da-te-pomnia-vse-taka",
    readSource: "Читанка",
  },
  "Колко си хубава!": {
    readUrl: "https://chitanka.info/text/47682-kolko-si-hubava",
    readSource: "Читанка",
  },
  "Посвещение": {
    readUrl: "https://slovo.bg/authors/dubarova/posweshtenie.htm",
    readSource: "Словото",
  },
  "Спасова могила": {
    readUrl: "https://chitanka.info/text/12939-spasova-mogila",
    readSource: "Читанка",
  },
  "Молитва": {
    readUrl: "https://chitanka.info/text/22381-molitva",
    readSource: "Читанка",
  },
  "Вяра": {
    readUrl: "https://chitanka.info/text/31518-vjara",
    readSource: "Читанка",
  },
  "Ветрената мелница": {
    readUrl: "https://chitanka.info/text/14241-vetrenata-melnica",
    readSource: "Читанка",
  },
  "Песента на колелетата": {
    readUrl: "https://chitanka.info/text/4982-pesenta-na-koleletata",
    readSource: "Читанка",
  },
  "Балада за Георг Хених": {
    readUrl: "https://chitanka.info/text/16813-balada-za-georg-henih",
    readSource: "Читанка",
  },
  "Две души": {
    readUrl: "https://chitanka.info/text/16247-dve-dushi",
    readSource: "Читанка",
  },
  "Потомка": {
    readUrl: "https://chitanka.info/text/16255-potomka",
    readSource: "Читанка",
  },
  "Честен кръст": {
    readUrl: "https://liternet.bg/publish4/bhristov/chesten_krast.htm",
    readSource: "LiterNet",
  },
};

function resolveDocPath(kind) {
  const resolved = DOC_PATHS[kind].find((candidate) => existsSync(candidate));
  if (!resolved) {
    throw new Error(`Липсва DOCX файл за ${kind}.`);
  }
  return resolved;
}

function normalizeLine(line) {
  return line.replace(/\s+/g, " ").trim();
}

function decodeEntities(text) {
  return text
    .replaceAll("&quot;", '"')
    .replaceAll("&amp;", "&")
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function cleanDocxLines(xmlText) {
  return decodeEntities(
    xmlText
      .replace(/<w:tab[^>]*\/>/g, "\t")
      .replace(/<\/w:p>/g, "\n")
      .replace(/<[^>]+>/g, ""),
  )
    .split(/\n|\t/)
    .map((line) => normalizeLine(line))
    .filter(Boolean);
}

function readDocxLines(filePath) {
  const archive = new AdmZip(filePath);
  const documentEntry = archive.getEntry("word/document.xml");

  if (!documentEntry) {
    throw new Error(`Липсва word/document.xml в ${filePath}.`);
  }

  return cleanDocxLines(documentEntry.getData().toString("utf8"));
}

function titleCase(value) {
  const lower = value.toLocaleLowerCase("bg-BG");
  return lower.charAt(0).toLocaleUpperCase("bg-BG") + lower.slice(1);
}

function sentenceCase(value) {
  return titleCase(value);
}

function isThemeHeading(line) {
  return (
    line === line.toUpperCase() &&
    /[А-ЯA-Z]/u.test(line) &&
    !line.startsWith("ЗА ") &&
    !line.endsWith(":") &&
    !WORK_HEADER_PATTERN.test(line)
  );
}

function isSectionHeading(line) {
  return line === line.toUpperCase() && /[А-ЯA-Z]/u.test(line) && line.length <= 90;
}

function isMeaningfulSectionTitle(line) {
  return line !== "ЗА АВТОРА" && line !== "ЗА ПРОИЗВЕДЕНИЕТО" && line !== "ЗА ТВОРБАТА";
}

function collectSectionItems(lines, startIndex) {
  const items = [];
  let cursor = startIndex;

  while (cursor < lines.length) {
    const current = normalizeLine(lines[cursor]);
    if (
      !current ||
      current.endsWith(":") ||
      /(послание|посланието)/i.test(current) ||
      current === "ЗА АВТОРА" ||
      current === "ЗА ПРОИЗВЕДЕНИЕТО" ||
      current === "ЗА ТВОРБАТА" ||
      WORK_HEADER_PATTERN.test(current) ||
      current.startsWith("Творбата") ||
      (isThemeHeading(current) && WORK_HEADER_PATTERN.test(lines[cursor + 1] ?? ""))
    ) {
      break;
    }

    items.push(current);
    cursor += 1;
  }

  return { items, nextIndex: cursor };
}

export function slugify(value) {
  const transliterated = Array.from(value.toLocaleLowerCase("bg-BG"))
    .map((character) => CYRILLIC_TO_LATIN.get(character) ?? character)
    .join("");

  return transliterated
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

export function parseLiteratureLines(lines) {
  const works = [];
  let currentTheme = "";
  let currentWork = null;
  let currentSection = "";
  let cursor = 0;

  while (cursor < lines.length) {
    const line = normalizeLine(lines[cursor]);
    const nextLine = normalizeLine(lines[cursor + 1] ?? "");

    if (!line) {
      cursor += 1;
      continue;
    }

    if (isThemeHeading(line) && WORK_HEADER_PATTERN.test(nextLine)) {
      currentTheme = titleCase(line);
      cursor += 1;
      continue;
    }

    const workMatch = line.match(WORK_HEADER_PATTERN);
    if (workMatch) {
      if (currentWork) {
        works.push(currentWork);
      }

      currentWork = {
        order: works.length + 1,
        theme: currentTheme,
        title: workMatch[1].trim(),
        genre: sentenceCase(workMatch[2].trim()),
        author: workMatch[3].trim().replace(/\s+необновено$/i, ""),
        aboutAuthor: [],
        aboutWork: [],
        motifs: [],
        conflicts: [],
        message: [],
        sections: [],
      };
      currentSection = "";
      cursor += 1;
      continue;
    }

    if (!currentWork) {
      cursor += 1;
      continue;
    }

    if (line === "ЗА АВТОРА" || line === "ЗА ПРОИЗВЕДЕНИЕТО" || line === "ЗА ТВОРБАТА") {
      currentSection = line;
      cursor += 1;
      continue;
    }

    if (line === "Мотивите са:" || line === "Мотивите е:") {
      const block = collectSectionItems(lines, cursor + 1);
      currentWork.motifs = block.items;
      cursor = block.nextIndex;
      continue;
    }

    if (line === "Конфликтите са:" || line === "Конфликтите е:") {
      const block = collectSectionItems(lines, cursor + 1);
      currentWork.conflicts = block.items;
      cursor = block.nextIndex;
      continue;
    }

    if (line.endsWith(":")) {
      const sectionTitle = line.slice(0, -1).trim();
      const block = collectSectionItems(lines, cursor + 1);
      if (isMeaningfulSectionTitle(sectionTitle) && block.items.length > 0) {
        currentWork.sections.push({
          title: sectionTitle,
          items: block.items,
        });
      }
      cursor = block.nextIndex;
      continue;
    }

    if (currentSection === "ЗА АВТОРА") {
      currentWork.aboutAuthor.push(line);
    } else if (currentSection === "ЗА ПРОИЗВЕДЕНИЕТО" || currentSection === "ЗА ТВОРБАТА") {
      currentWork.aboutWork.push(line);
      if (/(послание|посланието)/i.test(line)) {
        currentWork.message.push(line);
      }
    } else if (/(послание|посланието)/i.test(line)) {
      currentWork.message.push(line);
    }

    cursor += 1;
  }

  if (currentWork) {
    works.push(currentWork);
  }

  return works.map((work) => ({
    order: work.order,
    title: work.title,
    author: work.author,
    genre: work.genre,
    theme: work.theme,
    excerpt: work.aboutWork[0] ?? work.sections[0]?.items[0] ?? "",
    aboutAuthor: work.aboutAuthor.join(" "),
    aboutWork: work.aboutWork.join(" "),
    readUrl:
      READ_LINKS[work.title]?.readUrl ??
      `https://chitanka.info/search?q=${encodeURIComponent(`${work.title} ${work.author}`)}`,
    readSource: READ_LINKS[work.title]?.readSource ?? "Читанка",
    motifs: work.motifs,
    conflicts: work.conflicts,
    message:
      work.message[0] ??
      "Творбата насочва към смисъла на човешкия избор, вътрешната борба и ценностите.",
    tags: work.sections.map((section) => section.title),
    sections: work.sections,
  }));
}

export function parseGrammarLines(lines) {
  const modules = [];
  let currentModule = null;
  let activeSection = null;

  for (const rawLine of lines) {
    const line = normalizeLine(rawLine);
    if (!line) {
      continue;
    }

    if (MAJOR_GRAMMAR_MODULES.has(line)) {
      currentModule = {
        order: modules.length + 1,
        title: titleCase(line),
        module: titleCase(line),
        sectionTitle: titleCase(line),
        sections: [],
      };
      modules.push(currentModule);
      activeSection = null;
      continue;
    }

    if (!currentModule) {
      continue;
    }

    if (isSectionHeading(line)) {
      activeSection = {
        title: titleCase(line),
        items: [],
      };
      currentModule.sections.push(activeSection);
      continue;
    }

    if (!activeSection) {
      activeSection = {
        title: "Обзор",
        items: [],
      };
      currentModule.sections.push(activeSection);
    }

    activeSection.items.push(line);
  }

  return modules.map((module) => {
    const flatItems = module.sections.flatMap((section) => section.items);
    return {
      order: module.order,
      title: module.title,
      module: module.module,
      sectionTitle: module.sectionTitle,
      excerpt: flatItems[0] ?? "",
      bullets: flatItems.slice(0, 5),
      tags: module.sections.map((section) => section.title),
      sections: module.sections,
    };
  });
}

async function prepareDirectory(directory) {
  await rm(directory, { recursive: true, force: true });
  await mkdir(directory, { recursive: true });
}

async function writeCollectionEntries(directory, items) {
  for (const item of items) {
    const fileName = `${slugify(item.title)}.json`;
    await writeFile(path.join(directory, fileName), JSON.stringify(item, null, 2), "utf8");
  }
}

export async function main() {
  await mkdir(OUTPUT_ROOT, { recursive: true });
  await prepareDirectory(LITERATURE_OUTPUT);
  await prepareDirectory(GRAMMAR_OUTPUT);

  const literatureItems = parseLiteratureLines(readDocxLines(resolveDocPath("literature")));
  const grammarItems = parseGrammarLines(readDocxLines(resolveDocPath("grammar")));

  await writeCollectionEntries(LITERATURE_OUTPUT, literatureItems);
  await writeCollectionEntries(GRAMMAR_OUTPUT, grammarItems);
}

const currentFilePath = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === currentFilePath) {
  await main();
}

import { describe, expect, it } from "vitest";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const rootDir = process.cwd();
const literatureDir = join(rootDir, "src", "content", "literature");
const grammarDir = join(rootDir, "src", "content", "grammar");

function readJsonFiles(dir: string) {
  return readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => ({
      name,
      value: JSON.parse(readFileSync(join(dir, name), "utf8")) as Record<string, unknown>,
    }));
}

const knownTypoPatterns = [
  "краеве, крайеве",
  "грубоватни",
  "лежешката",
  "ЗАРАДИ ПРОБКА",
  "Пасарбан",
  "всичко му интересуваше",
  ",,",
];

describe("project records", () => {
  it("keeps the planning records in the repo root", () => {
    expect(existsSync(join(rootDir, "PROJECT_BRIEF.md"))).toBe(true);
    expect(existsSync(join(rootDir, "STATE.yaml"))).toBe(true);
    expect(existsSync(join(rootDir, "LOG.md"))).toBe(true);
  });
});

describe("literature content", () => {
  it("ships 27 literature entries with reading links and exam focus", () => {
    expect(existsSync(literatureDir)).toBe(true);

    const entries = readJsonFiles(literatureDir);

    expect(entries).toHaveLength(27);

    for (const entry of entries) {
      expect(entry.value.title).toBeTypeOf("string");
      expect(entry.value.author).toBeTypeOf("string");
      expect(entry.value.theme).toBeTypeOf("string");
      expect(entry.value.readUrl).toBeTypeOf("string");
      expect(String(entry.value.readUrl)).toMatch(/^https:\/\//);
      expect(entry.value.readSource).toBeTypeOf("string");
      expect(entry.value.examFocus).toMatchObject({
        titleMeaning: expect.any(String),
        examRelevance: expect.any(String),
      });
    }
  });
});

describe("grammar content", () => {
  it("ships all grammar modules", () => {
    expect(existsSync(grammarDir)).toBe(true);

    const entries = readJsonFiles(grammarDir);
    const modules = entries.map((entry) => entry.value.module);

    expect(entries).toHaveLength(9);
    expect(modules).toEqual(
      expect.arrayContaining([
        "Морфология",
        "Синтаксис",
        "Правопис",
        "Фонетика",
        "Лексикология",
        "Словообразуване",
        "Стилистика",
        "Текстолингвистика",
        "Създаване на текст",
      ]),
    );
  });

  it("keeps common mistakes and typo traps sane", () => {
    const entries = readJsonFiles(grammarDir);

    for (const entry of entries) {
      const raw = JSON.stringify(entry.value);
      for (const typo of knownTypoPatterns) {
        expect(raw, `${entry.name} contains ${typo}`).not.toContain(typo);
      }

      const sections = entry.value.sections as Array<{
        commonMistakes?: Array<{ wrong: string; right: string }>;
        quiz?: Array<{ options: unknown[]; correct: number }>;
      }>;

      for (const section of sections) {
        for (const mistake of section.commonMistakes ?? []) {
          expect(mistake.wrong).not.toBe(mistake.right);
        }
        for (const quiz of section.quiz ?? []) {
          expect(Number.isInteger(quiz.correct)).toBe(true);
          expect(quiz.correct).toBeGreaterThanOrEqual(0);
          expect(quiz.correct).toBeLessThan(quiz.options.length);
        }
      }
    }
  });
});

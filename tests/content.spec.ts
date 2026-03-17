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

describe("project records", () => {
  it("keeps the planning records in the repo root", () => {
    expect(existsSync(join(rootDir, "PROJECT_BRIEF.md"))).toBe(true);
    expect(existsSync(join(rootDir, "STATE.yaml"))).toBe(true);
    expect(existsSync(join(rootDir, "LOG.md"))).toBe(true);
  });
});

describe("literature content", () => {
  it("ships 12 literature entries with reading links", () => {
    expect(existsSync(literatureDir)).toBe(true);

    const entries = readJsonFiles(literatureDir);

    expect(entries).toHaveLength(12);

    for (const entry of entries) {
      expect(entry.value.title).toBeTypeOf("string");
      expect(entry.value.author).toBeTypeOf("string");
      expect(entry.value.theme).toBeTypeOf("string");
      expect(entry.value.readUrl).toBeTypeOf("string");
      expect(String(entry.value.readUrl)).toMatch(/^https:\/\//);
      expect(entry.value.readSource).toBeTypeOf("string");
    }
  });
});

describe("grammar content", () => {
  it("ships the three core grammar modules", () => {
    expect(existsSync(grammarDir)).toBe(true);

    const entries = readJsonFiles(grammarDir);
    const modules = entries.map((entry) => entry.value.module);

    expect(entries).toHaveLength(3);
    expect(modules).toEqual(
      expect.arrayContaining(["Морфология", "Синтаксис", "Правопис"]),
    );
  });
});

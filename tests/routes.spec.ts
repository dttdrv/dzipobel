import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";

describe("site routes", () => {
  it("defines the required top-level pages", () => {
    const rootDir = process.cwd();
    expect(existsSync(join(rootDir, "src", "pages", "index.astro"))).toBe(true);
  });
});

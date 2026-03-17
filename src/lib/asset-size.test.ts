import { describe, expect, it } from "vitest";

import { assertAssetSizes, formatBytes } from "./asset-size";

describe("formatBytes", () => {
  it("formats human readable sizes", () => {
    expect(formatBytes(1024)).toBe("1.00 KiB");
  });
});

describe("assertAssetSizes", () => {
  it("returns oversized files when a file exceeds the limit", () => {
    expect(
      assertAssetSizes(
        [
          { path: "assets/index.css", size: 1024 },
          { path: "assets/hero.png", size: 6 * 1024 * 1024 },
        ],
        5 * 1024 * 1024,
      ),
    ).toEqual([
      {
        path: "assets/hero.png",
        size: 6 * 1024 * 1024,
      },
    ]);
  });

  it("returns an empty array when all files are below the limit", () => {
    expect(
      assertAssetSizes(
        [{ path: "assets/app.js", size: 2 * 1024 * 1024 }],
        5 * 1024 * 1024,
      ),
    ).toEqual([]);
  });
});

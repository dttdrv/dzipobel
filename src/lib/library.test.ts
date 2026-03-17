import { describe, expect, it } from "vitest";

import {
  buildLibraryIndex,
  filterLibraryItems,
  normalizeSearchText,
  sortLibraryItems,
} from "./library";

describe("normalizeSearchText", () => {
  it("normalizes mixed case and trims extra whitespace", () => {
    expect(normalizeSearchText("  ВяРа   И   НадЕжДа  ")).toBe("вяра и надежда");
  });
});

describe("filterLibraryItems", () => {
  const items = [
    {
      title: "Молитва",
      href: "/literatura/molitva",
      category: "Литература",
      filterValue: "Вяра и надеждата",
      searchText: normalizeSearchText("Молитва Атанас Далчев вяра и надеждата"),
      type: "literature" as const,
    },
    {
      title: "Правопис",
      href: "/bulgarski/pravopis",
      category: "Български език",
      filterValue: "Правопис",
      searchText: normalizeSearchText("Правопис главна буква запетая"),
      type: "grammar" as const,
    },
  ];

  it("filters by query and section", () => {
    expect(
      filterLibraryItems(items, {
        query: "далчев",
        section: "literature",
      }),
    ).toEqual([items[0]]);
  });

  it("filters by selected category value", () => {
    expect(
      filterLibraryItems(items, {
        query: "",
        filterValue: "Правопис",
      }),
    ).toEqual([items[1]]);
  });
});

describe("sortLibraryItems", () => {
  it("sorts items alphabetically by title", () => {
    const items = [
      { title: "Честен кръст", type: "literature" as const },
      { title: "Аз искам да те помня все така…", type: "literature" as const },
    ];

    expect(sortLibraryItems(items).map((item) => item.title)).toEqual([
      "Аз искам да те помня все така…",
      "Честен кръст",
    ]);
  });
});

describe("buildLibraryIndex", () => {
  it("creates searchable index entries for both collections", () => {
    const index = buildLibraryIndex({
      literature: [
        {
          slug: "viara",
          data: {
            title: "Вяра",
            author: "Никола Вапцаров",
            theme: "Вяра и надеждата",
            genre: "Стихотворение",
            excerpt: "Вярата е двигател на живота.",
            tags: ["вяра", "бъдеще"],
          },
        },
      ],
      grammar: [
        {
          slug: "morfologiya",
          data: {
            title: "Морфология",
            module: "Морфология",
            sectionTitle: "Части на речта",
            excerpt: "Обща характеристика на частите на речта.",
            tags: ["съществително", "глагол"],
          },
        },
      ],
    });

    expect(index).toHaveLength(2);
    expect(index[0]?.searchText).toContain("никола вапцаров");
    expect(index[1]?.searchText).toContain("части на речта");
  });
});

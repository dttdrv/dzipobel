export type LibraryType = "literature" | "grammar";

export type LibraryFilterOptions = {
  query?: string;
  section?: LibraryType;
  filterValue?: string;
};

export type LibraryIndexItem = {
  title: string;
  href: string;
  category: string;
  filterValue: string;
  meta: string;
  description: string;
  searchText: string;
  type: LibraryType;
};

type LiteratureInput = {
  id?: string;
  slug?: string;
  data: {
    title: string;
    author: string;
    theme: string;
    genre: string;
    excerpt: string;
    tags?: string[];
  };
};

type GrammarInput = {
  id?: string;
  slug?: string;
  data: {
    title: string;
    module: string;
    sectionTitle: string;
    excerpt: string;
    tags?: string[];
  };
};

export function normalizeSearchText(value: string) {
  return value.trim().toLocaleLowerCase("bg-BG").replace(/\s+/g, " ");
}

export function filterLibraryItems(
  items: LibraryIndexItem[],
  options: LibraryFilterOptions,
) {
  const query = normalizeSearchText(options.query ?? "");

  return items.filter((item) => {
    if (options.section && item.type !== options.section) {
      return false;
    }

    if (options.filterValue && item.filterValue !== options.filterValue) {
      return false;
    }

    if (query && !item.searchText.includes(query)) {
      return false;
    }

    return true;
  });
}

export function sortLibraryItems<T extends { title: string }>(items: T[]) {
  return [...items].sort((left, right) =>
    left.title.localeCompare(right.title, "bg-BG"),
  );
}

export function buildLibraryIndex(input: {
  literature: LiteratureInput[];
  grammar: GrammarInput[];
}) {
  const literature = input.literature.map<LibraryIndexItem>((entry) => ({
    title: entry.data.title,
    href: `/literatura/${entry.id ?? entry.slug}/`,
    category: "Литература",
    filterValue: entry.data.theme,
    meta: `${entry.data.author} • ${entry.data.genre}`,
    description: entry.data.theme,
    searchText: normalizeSearchText(
      [
        entry.data.title,
        entry.data.author,
        entry.data.theme,
        entry.data.genre,
        entry.data.excerpt,
        ...(entry.data.tags ?? []),
      ].join(" "),
    ),
    type: "literature",
  }));

  const grammar = input.grammar.map<LibraryIndexItem>((entry) => ({
    title: entry.data.title,
    href: `/bulgarski/${entry.id ?? entry.slug}/`,
    category: "Български език",
    filterValue: entry.data.module,
    meta: entry.data.sectionTitle,
    description: entry.data.excerpt,
    searchText: normalizeSearchText(
      [
        entry.data.title,
        entry.data.module,
        entry.data.sectionTitle,
        entry.data.excerpt,
        ...(entry.data.tags ?? []),
      ].join(" "),
    ),
    type: "grammar",
  }));

  return [...literature, ...grammar];
}

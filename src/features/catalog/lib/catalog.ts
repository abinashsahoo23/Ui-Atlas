import { catalogEntries } from "../data/catalog";
import { categoryDefinitions } from "../data/categories";
import type { CatalogCategory } from "../types";

export { categoryDefinitions };

export function getAllCategories() {
  return categoryDefinitions;
}

export function getCategory(slug: string) {
  return categoryDefinitions.find((category) => category.slug === slug);
}

export function getCatalogEntry(slug: string) {
  return catalogEntries.find((entry) => entry.slug === slug);
}

export function getCatalogEntriesForCategory(category: CatalogCategory) {
  return catalogEntries.filter((entry) => entry.category === category);
}

export type SearchCatalogOptions = {
  category?: string;
  sort?: "default" | "alpha-asc" | "alpha-desc" | string;
};

export function searchCatalogEntries(query: string, options?: SearchCatalogOptions) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  let results = [...catalogEntries];

  if (options?.category) {
    results = results.filter((entry) => entry.category === options.category);
  }

  if (normalizedQuery) {
    results = results.filter((entry) =>
      [entry.title, entry.description, entry.style, entry.category, ...entry.tags]
        .join(" ")
        .toLocaleLowerCase()
        .includes(normalizedQuery),
    );
  }

  if (options?.sort === "alpha-asc") {
    results.sort((a, b) => a.title.localeCompare(b.title));
  } else if (options?.sort === "alpha-desc") {
    results.sort((a, b) => b.title.localeCompare(a.title));
  }

  return results;
}

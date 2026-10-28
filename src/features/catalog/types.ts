export const categorySlugs = [
  "hero-sections",
  "navigation",
  "cards",
  "buttons",
  "text-effects",
  "backgrounds",
  "scroll-animations",
  "forms",
  "feedback",
  "galleries",
  "animations",
  "timelines",
  "dashboards",
  "pricing",
  "testimonials",
  "complete-layouts",
] as const;

export type CatalogCategory = (typeof categorySlugs)[number];

export type CategoryDefinition = {
  slug: CatalogCategory;
  title: string;
  description: string;
};

export type CatalogItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: CatalogCategory;
  tags: readonly string[];
  style: string;
  intendedUse: string;
  previewKey: string;
  addedAt?: string;
  sourceUrl: string | null;
  attribution: string;
  license: string;
  dependencies: readonly string[];
  fonts: readonly string[];
  assets: readonly string[];
  responsiveNotes: string;
  interactionNotes: string;
  implementationNotes: string;
};

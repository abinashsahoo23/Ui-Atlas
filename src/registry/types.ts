import type { ComponentType } from "react";
import type { CatalogCategory } from "@/features/catalog/types";

export { categorySlugs, type CatalogCategory, type CategoryDefinition } from "@/features/catalog/types";

export type RegisteredExample = {
  preview: ComponentType;
  category?: CatalogCategory;
};

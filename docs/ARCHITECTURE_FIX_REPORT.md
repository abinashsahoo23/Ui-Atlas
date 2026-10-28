# UI Atlas — Architecture Fix Report

**Date of the work:** 2026-10-21

## 1. Issues Identified

1. **Misplaced catalog components:** `CatalogEntryCard` and `FavoriteButton` were situated in `src/components/catalog/` while `src/features/catalog/components/` existed as an empty directory, confusing generic shared components with feature-specific catalog components.
2. **Catalog and Registry responsibility conflation:** Category definitions (`categoryDefinitions`), category slug lists (`categorySlugs`), and category types were housed in `src/registry/` (`manifest.ts` and `types.ts`). Catalog types had to import category types from registry types, inverting domain dependencies.
3. **Repeated category lookup logic:** Multiple App Router pages (`src/app/page.tsx`, `src/app/library/page.tsx`, `src/app/library/[category]/page.tsx`, `src/app/item/[slug]/page.tsx`, and `SavedCollection`) were performing repeated inline `.find((c) => c.slug === ...)` lookups over `categoryDefinitions`.
4. **Scattered favourite logic and leaky storage coupling:** Both `FavoriteButton` and `SavedCollection` imported `storage.ts` persistence methods (`readSavedEntryIds`, `writeSavedEntryIds`) and performed manual ID filtering and array reconstruction. `useSavedEntryIds` provided read-only state without mutation actions.
5. **Shared utility import bypass:** `src/components/ui/button.tsx` bypassed `@/lib/utils` by importing `cn` directly from the external `"cn"` package.
6. **Documentation drift:** `docs/ARCHITECTURE.md` and `README.md` referenced `src/components/catalog/` and outdated responsibility mappings.

## 2. Files Changed, Moved, Created, or Removed

### Created
- `src/features/catalog/data/categories.ts`: Single source of truth for category definitions (`categoryDefinitions`).
- `src/features/catalog/components/catalog-entry-card.tsx`: Catalog entry card moved to feature components.
- `src/features/catalog/components/catalog-entry-card.module.css`: Colocated card styling.
- `src/features/catalog/components/favorite-button.tsx`: Favorite button moved to catalog feature components.
- `src/features/catalog/components/favorite-button.module.css`: Colocated button styling.
- `docs/ARCHITECTURE_FIX_REPORT.md`: This architecture progress report.

### Modified
- `src/features/catalog/types.ts`: Centralized `categorySlugs`, `CatalogCategory`, `CategoryDefinition`, and `CatalogItem`.
- `src/features/catalog/lib/catalog.ts`: Added `getCategory(slug)` and `getAllCategories()` helpers alongside catalog entries lookup and search.
- `src/registry/types.ts`: Imported `CatalogCategory` and `CategoryDefinition` from `@/features/catalog/types`, defined `RegisteredExample`.
- `src/registry/manifest.ts`: Focused on demo registration (`exampleRegistry`, `getRegisteredExample`); re-exported `categoryDefinitions` from catalog data for backwards compatibility.
- `src/features/collections/lib/storage.ts`: Added safe mutation utilities (`addSavedEntryId`, `removeSavedEntryId`, `toggleSavedEntryId`).
- `src/features/collections/lib/use-saved-entries.ts`: Added `useSavedEntries` (exposing `savedIds`, `isSaved`, `toggleSave`, `saveEntry`, `removeEntry`) and `useSavedEntry(id)` hooks.
- `src/features/collections/components/saved-collection.tsx`: Refactored to use `useSavedEntries` actions and `getCategory()` catalog helper.
- `src/components/ui/button.tsx`: Updated `cn` import to use `@/lib/utils`.
- `src/app/page.tsx`: Updated imports to `@/features/catalog/components/...` and catalog data.
- `src/app/library/page.tsx`: Updated imports to `@/features/catalog/components/...` and catalog lib.
- `src/app/library/[category]/page.tsx`: Updated imports and switched to `getCategory(slug)`.
- `src/app/item/[slug]/page.tsx`: Updated imports and switched to `getCategory(entry.category)`.
- `docs/ARCHITECTURE.md`: Updated folder responsibility map and component boundaries.
- `README.md`: Aligned project map with updated directories.
- `docs/memory.md`: Recorded architecture cleanup and test verification status.

### Removed
- `src/components/catalog/catalog-entry-card.tsx`
- `src/components/catalog/catalog-entry-card.module.css`
- `src/components/catalog/favorite-button.tsx`
- `src/components/catalog/favorite-button.module.css`
- `src/components/catalog/` directory

## 3. What Was Fixed in Each Area

- **Catalog component organisation:** Moved all catalog-specific components to `src/features/catalog/components/`. Verified all consumer imports. Removed obsolete duplicates in `src/components/catalog/`. `src/components/` now holds only genuinely shared components (`layout/site-shell.tsx`, `ui/button.tsx`).
- **Catalog data and registry:** Established `src/features/catalog/` as the single source of truth for categories and catalog items. Registry is strictly responsible for statically registering and loading preview components. Added catalog helper `getCategory` to avoid repetitive search logic across routes.
- **Favourite functionality:** Separated concerns into storage persistence (`storage.ts`), hook state and actions (`use-saved-entries.ts`), and UI presentation (`FavoriteButton`, `SavedCollection`). No direct storage manipulation occurs inside UI components.
- **CSS organisation:** Confirmed global design tokens, typography, and resets reside in `src/app/globals.css`. Component styles are scoped in colocated `.module.css` files. Registry examples retain isolated styling.
- **Utilities and shared code:** Ensured `src/lib/utils.ts` is the single import point for `cn`. Kept feature logic within feature directories.
- **Documentation consistency:** Updated `docs/ARCHITECTURE.md`, `README.md`, and `docs/memory.md` to reflect the actual codebase structure.

## 4. Catalog and Registry Duplication Analysis

- **Duplication found:** Category definitions (`categoryDefinitions`) and type contracts were duplicated across registry files while conceptually belonging to the catalog. Furthermore, multiple routes duplicated category search logic with repetitive `.find()` calls.
- **Resolution:** Centralized `categoryDefinitions` and category types under `src/features/catalog/data/categories.ts` and `src/features/catalog/types.ts`. Re-exported from registry manifest for compatibility. Replaced inline searches with `getCategory()` helper.

## 5. Favourite Logic Consolidation

- **Consolidation:** Created `useSavedEntries()` and `useSavedEntry(id)` in `src/features/collections/lib/use-saved-entries.ts`.
- **Storage encapsulation:** Added `addSavedEntryId`, `removeSavedEntryId`, and `toggleSavedEntryId` in `src/features/collections/lib/storage.ts`.
- **Result:** `FavoriteButton` is now a pure presentation component that calls `toggle()`. `SavedCollection` calls `removeEntry(id)`. Neither component directly accesses localStorage or performs JSON manipulation.

## 6. CSS Responsibilities

- `src/app/globals.css`: Contains CSS variables, theme tokens, typography, reset, focus outlines, and reduced-motion rules.
- `.module.css`: Each component and demo preview maintains isolated, locally scoped CSS Modules.
- `src/app/shadcn-utilities.css`: Verified as unimported vendored utility stylesheet preserved without polluting the bundle.

## 7. Remaining Issues

- **None.** All identified architecture issues have been resolved cleanly with zero regressions.

## 8. Validation Performed and Actual Outcomes

1. `npm run typecheck` (`tsc --noEmit`):
   - **Outcome:** Exited with code 0 (no type errors).
2. `npm run lint` (`eslint`):
   - **Outcome:** Exited with code 0 (clean, no warnings or errors).
3. `npm run build` (`next build`):
   - **Outcome:** Exited with code 0 (successfully compiled with Turbopack, generated and optimized 25 static/partial prerender routes including home, library, categories, item details, and collections).

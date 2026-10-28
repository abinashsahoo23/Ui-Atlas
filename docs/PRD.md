# UI Atlas product requirements

## Vision and problem

UI Atlas is a personal reference workspace for collecting strong interface patterns, sections, layouts, and visual effects. Each entry provides a live preview, copyable implementation source, and an AI-ready prompt that explains what the component is and how to build it.

Design references are scattered across saved links, screenshots, and snippets. UI Atlas gives each reference a searchable home with enough context to study and adapt it later.

## Users and needs

- **Frontend developers and vibe coders** need examples they can understand, compare, and adapt without copying unknown code.
- **Designers who prototype** need a visual reference with enough implementation context to discuss feasibility.
- **A future contributor** needs a predictable way to add an entry without extending a single large page component.

## Main user journeys

1. Open the home page, search a title, style, description, or tag, and open a matching entry.
2. Browse the category index, open a category, compare its previews, and read the details for an entry.
3. Save an entry to the device-local collection, revisit Collections, and remove it when it is no longer useful.
4. Inspect the live preview, copy its TSX or CSS source, or copy an AI prompt generated from the component's catalog details.

## Product goals and success criteria

- A new user can reach the library, a category, an entry detail, or saved entries from visible navigation.
- The starter library demonstrates at least five visibly different, original patterns and each has a dedicated detail route.
- Search finds entries by title, description, style, category, and tag, and an unmatched query gives a useful recovery action.
- A saved entry remains in Collections after navigation and refresh in the same browser; removing it updates the same device's stored list.
- The main routes work with keyboard navigation and at narrow mobile widths without relying on hover for essential information.
- Every entry identifies its attribution and reuse status. Unverified third-party work is not included.

## MVP scope

- Home discovery with a search form, all category links, selected entries, and an entry point to Collections.
- A complete library view and category routes, with query-based search and useful empty states.
- Entry detail pages with an isolated live React preview, read-only TSX/CSS source, copy actions, an AI build prompt, and attribution/reuse status.
- One browser-local saved list backed by localStorage. It is not an account, sync, or named-collection feature.
- A typed catalog and explicit static preview registry.
- Five first-party preview studies: a gradient hero, glass-style briefing card, graphic dashboard panel, native segmented controls, and a reduced-motion-aware scroll note.
- Supporting information pages for the product workflow, attribution and licenses, and recorded project updates.

## Routes

| Route | Requirement |
| --- | --- |
| `/` | Explain the library and provide search, category, selected-study, recently added, and collection entry points. |
| `/library` | Show all entries; accept `q` as a GET search parameter. |
| `/library/[category]` | Show entries in a known category or a useful empty state. Unknown categories return not found. |
| `/item/[slug]` | Show the registered demo, read-only source with copy actions, AI build prompt, and attribution. Unknown slugs return not found. |
| `/collections` | Show the current browser's saved entries and remove controls. |
| `/about` | Explain the local-first product and how to discover, inspect, and adapt entries. |
| `/licenses` | Summarize catalog attribution, bundled font notices, and core runtime package licenses without implying a blanket catalog license. |
| `/changelog` | Record dated product, catalog, and interface updates. |

The category taxonomy includes hero sections, navigation, cards, buttons, text effects, backgrounds, scroll animations, forms, pricing, testimonials, dashboards, and complete layouts. Motion examples are browsed in their relevant library categories and opened as individual component entries.

## Search and filtering

- Search is submitted as a normal GET form so it works without client-side search state.
- Match case-insensitively against entry title, description, visual style, category slug, and tags.
- Category navigation is link-based. Search and category selection do not currently combine into a multi-filter query.
- Show the number of results and an empty state with a clear-search link.

## Catalog and previews

- Each entry has a stable ID and slug, readable metadata, a category, tags, style, intended use, preview key, optional verified `addedAt` date, dependency and asset details, responsive and interaction notes, attribution, source URL when applicable, and reuse status.
- Metadata never contains executable JavaScript or arbitrary module paths.
- The preview registry uses static imports. Preview styles stay in colocated CSS Modules.
- Every registered component has a read-only TSX/CSS source view and source-copy action. Its AI build prompt is generated from the typed catalog description, style, intended use, implementation and interaction notes, responsive behavior, dependencies, assets, and reuse details.
- Detail pages focus on preview and copying. An in-app code editor or component configurator is not part of the product.

## Local favourites

- Save and remove controls update a versioned localStorage key in the browser.
- Server output and initial hydration use the same empty snapshot. The browser store supplies the saved list after hydration through `useSyncExternalStore`.
- Storage reads and writes tolerate unavailable or malformed storage. Saved items do not synchronize between devices or user accounts.

## Functional and quality requirements

- Use semantic landmarks, labels, headings, accessible names, visible keyboard focus, and native controls where suitable.
- Respect reduced-motion preferences; the scroll note remains visible without its optional reveal.
- Keep the shell and catalog responsive from 320px upward. Do not require horizontal page scrolling.
- Use lightweight CSS-built art for starter studies; no stock image dependency is introduced.
- Keep catalog routes server-rendered by default and keep browser state in small client components.
- Build and lint must succeed; TypeScript must pass in strict mode.

## Out of scope for this milestone

- Authentication, database, server APIs, cloud sync, payments, user submissions, third-party code execution, editable collections, and automatic website scraping.
- An in-app code editor/configurator, responsive-device switcher, dark mode, admin interface, or exhaustive catalog population.

## Later opportunities

- Add additional filters, a responsive preview frame, and named user collections.
- Add a backend only when synchronization or multi-user needs are defined.
- Grow the catalog with clear attribution, verified terms, and examples that add real visual variety.

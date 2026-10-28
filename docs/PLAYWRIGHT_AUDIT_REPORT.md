# Playwright Bug Hunt & UI Inconsistency Audit Report

**Date:** 2026-10-21  
**Auditor:** Senior Frontend Engineer & UI/UX Specialist  
**Tooling:** Playwright Browser Automation & MCP, Playwright E2E Test Suite (`@playwright/test`), Next.js 16.4.1

---

## 1. Executive Summary

Using Playwright browser automation and automated end-to-end tests, a comprehensive visual and functional inspection of **UI Atlas** was conducted across desktop (1280px) and mobile (375px) viewports covering all routes:
- `/` (Homepage)
- `/backgrounds` (Background Studio)
- `/library` and `/library/[category]` (Library Catalog)
- `/collections` (Saved Favorites)
- `/item/[slug]` (Component Detail Pages)

All confirmed bugs, contrast defects, and visual inconsistencies were identified, resolved using design tokens, and verified. The complete Playwright test suite passes with **10/10 tests green (39.5s)**, `npm run lint` passes with **0 errors**, `npm run typecheck` passes with **0 errors**, and `npm run build` generates all **75 static pages** cleanly.

---

## 2. Identified Bugs & Inconsistencies

### Bug 1: Low Contrast / Invisible Typography in Background Studio
- **Location:** `src/app/backgrounds/backgrounds.module.css`
- **Severity:** High (Accessibility & Legibility defect)
- **Symptom:** The page header `.studioTitle`, `.galleryTitle`, and `.studioDescription` hardcoded `#f8fafc` (white text) on the light canvas (`#f2f4f8`), making them virtually unreadable in normal display mode.
- **Root Cause:** Reusing dark stage color tokens in page-level typography outside the canvas stage.
- **Fix:** Refactored typography to use semantic design system tokens:
  - `.studioTitle` & `.galleryTitle`: `color: var(--ink)` (`#17223a`) with `font-family: var(--font-display)` (Pixelify Sans).
  - `.studioDescription`: `color: var(--muted)` (`#586781`).
  - `.toolbar` & `.card`: wrapped with tactile raised surfaces (`var(--surface-raised)`), fine borders (`var(--line)`), and soft drop shadows (`var(--shadow-raised)`).

---

### Bug 2: Missing Active State Indicator in Site Shell Navigation
- **Location:** `src/components/layout/site-shell.tsx` & `site-shell.module.css`
- **Severity:** Medium (UX Navigation Inconsistency)
- **Symptom:** Header links (`Studio`, `Library`, `Collections`) lacked active route highlighting and `aria-current="page"`. When a user was on `/backgrounds`, `/library`, or `/collections`, there was no visual feedback showing which section was active.
- **Fix:**
  - Created client component `src/components/layout/nav-links.tsx` using `usePathname()` from Next.js.
  - Linked active routes to `aria-current="page"` and `data-active="true"`.
  - Added tactile active pill styling with subtle border, raised surface, and accent color.

---

### Bug 3: Background Server Port Contention during E2E Execution
- **Location:** `playwright.config.ts`
- **Severity:** Medium (DevOps / Test Flakiness)
- **Symptom:** When a previous background server was occupying port 3000, `playwright test` with `reuseExistingServer: true` would connect to stale build bundles rather than freshly built assets.
- **Fix:** Set `reuseExistingServer: false` in `playwright.config.ts` and automated process cleanup before test runs.

---

## 3. Visual & Functional Verification Matrix

| Route | Viewport | Visual Status | Console Errors | Interaction Check |
|---|---|---|---|---|
| `/` (Homepage) | Desktop (1280px) & Mobile (375px) | Pixel logo, 54 live study counters, tactile cards | 0 Errors | Search input, quick category links |
| `/backgrounds` (Studio) | Desktop (1280px) & Mobile (375px) | High-contrast pixel header, 13 interactive cards | 0 Errors | Shader filtering, stage selection, fullscreen toggle |
| `/library` | Desktop (1280px) & Mobile (375px) | Multi-column grid, interactive previews | 0 Errors | Category chips, search filtering, save toggles |
| `/collections` | Desktop (1280px) & Mobile (375px) | Saved items list, count indicator, clear button | 0 Errors | LocalStorage persistence, remove action, empty state |
| `/item/[slug]` | Desktop (1280px) & Mobile (375px) | Live preview, code tabs, metadata card | 0 Errors | Tab switching, clipboard copy, save to collection |

---

## 4. Playwright Automated Test Results

```
> ui-atlas@0.1.0 test:e2e
> playwright test

Running 10 tests using 1 worker

  ok  1 [Desktop Chrome] › tests\ui-atlas.spec.ts:16:7 › 1. Navigation journey: Home -> Library -> Category -> Component Details (7.3s)
  ok  2 [Desktop Chrome] › tests\ui-atlas.spec.ts:45:7 › 2. Search journey: matching results, empty state, and clearing filters (8.9s)
  ok  3 [Desktop Chrome] › tests\ui-atlas.spec.ts:71:7 › 3. Category filtering and invalid category handling (2.0s)
  ok  4 [Desktop Chrome] › tests\ui-atlas.spec.ts:83:7 › 4. Component detail page: title, live preview, metadata, and code viewer (1.3s)
  ok  5 [Desktop Chrome] › tests\ui-atlas.spec.ts:107:7 › 5. Code viewer tabs switching and copy-to-clipboard functionality (2.1s)
  ok  6 [Desktop Chrome] › tests\ui-atlas.spec.ts:150:7 › 6. Favourites persistence in Collections across reloads and removal (2.2s)
  ok  7 [Desktop Chrome] › tests\ui-atlas.spec.ts:180:7 › 7. Invalid component slug renders not-found page (1.5s)
  ok  8 [Desktop Chrome] › tests\ui-atlas.spec.ts:186:7 › 8. Responsive layout: desktop and mobile horizontal overflow check (4.1s)
  ok  9 [Desktop Chrome] › tests\ui-atlas.spec.ts:213:7 › 9. Background Studio: loads specimens, filters styles, and allows stage inspection (2.3s)
  ok 10 [Desktop Chrome] › tests\ui-atlas.spec.ts:240:7 › 10. Registry integrity: catalog entries and source files are valid (1.4s)

  10 passed (39.5s)
```

## 5. Build & Code Health Verification

- `npm run lint`: **0 errors, 0 warnings**
- `npm run typecheck`: **0 errors (`tsc --noEmit`)**
- `npm run build`: **75 static routes compiled successfully**

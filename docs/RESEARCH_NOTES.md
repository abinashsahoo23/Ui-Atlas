# Technical research notes

**Access date:** 2026-10-27

Research was a focused pass over official or primary sources. The installed framework package is Next.js 16.4.1; where its local documentation was available, it was used to settle version-specific implementation details before code changes. The public Next.js page reported 16.4.2 during this research pass, so the installed package and its local docs remain authoritative for this workspace.

## Framework and styling

| Source | Supported finding | Decision |
| --- | --- | --- |
| Next.js installed docs: `node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md`, `03-layouts-and-pages.md` ([App Router docs](https://nextjs.org/docs/app)) | App Router routes are created from the app folder; in this release `params` and `searchParams` are async page props. `generateStaticParams` identifies known dynamic paths. | Keep the existing `src/app` routes, use promise-based route props, generate known categories and entry slugs, and call `notFound()` for unknown values. |
| Next.js installed docs: `08-caching.md` and `11-css.md` ([CSS guide](https://nextjs.org/docs/app/getting-started/css)) | Cache Components requires runtime-dependent route data such as `searchParams` to be contained by a Suspense boundary. Next recommends global CSS for global rules and CSS Modules for scoped styles; production CSS order should be checked in a build. | Keep library search results inside Suspense. Keep global CSS small and use colocated modules for page and preview styles. |
| Next.js installed docs: `13-fonts.md`; [Font Optimization](https://nextjs.org/docs/app/getting-started/fonts) | `next/font/google` fetches files during build and self-hosts them; `next/font/local` accepts repository font files and also generates self-hosted assets. | Use the local loader for repeatable offline builds and keep font assets self-hosted; avoid remote CSS font imports. |
| Installed declarations: `node_modules/next/dist/compiled/@next/font/dist/google/index.d.ts` | The installed font API exports `Inter`, `Pixelify_Sans`, and `JetBrains_Mono`. | These exact identifiers were checked. The build environment could not reach Google Fonts, so the official Latin WOFF2 files are stored locally and loaded through `next/font/local`. |
| [Tailwind CSS theme variables](https://tailwindcss.com/docs/theme) | Top-level `@theme` variables create utilities; ordinary CSS variables are appropriate for tokens that should not create utilities. | Map shared colors and font families in `@theme inline`; keep detailed surface and semantic values as regular root variables. |
| [shadcn/ui Next.js installation](https://ui.shadcn.com/docs/installation/next) | shadcn/ui is source code installed into the application and can be adapted to the project's existing styling system. | Preserve the repository's existing Base UI preset and local support files. Use custom, scoped Atlas controls where they better fit this visual system; add no UI dependency. |

## Components, icons, and motion

| Source | Supported finding | Decision |
| --- | --- | --- |
| [Motion for React](https://motion.dev/docs/react) | Motion for React provides React animation APIs for interactive use cases. | Keep the already-installed package available for future demos. The starter uses a small CSS view-timeline reveal and does not add a Motion client bundle. |
| [Lucide React](https://lucide.dev/guide/react) | Lucide supplies React icon components. | Import named icons only where used in UI controls and navigation. |
| [MDN reduced-motion media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion) | `prefers-reduced-motion: reduce` indicates a user preference to remove, reduce, or replace nonessential motion. | Keep content visible by default and disable the optional scroll reveal for reduced-motion users. |
| [Codrops animated product grid study (May 27, 2025)](https://tympanus.net/codrops/2025/05/27/animated-product-grid-preview-with-gsap-clip-path/) | A grid can feel more interactive when the hovered item receives a focused preview treatment; the tutorial uses a more involved overlay and GSAP timeline. | Apply the focus and reveal idea to the 16-domain taxonomy with CSS only: run two compact lanes in opposite directions, pause the active lane, and scale its focused card with a brief light sweep. |
| [MDN `transform`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/transform), [MDN reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion), and [WCAG 2.2 Focus Visible](https://www.w3.org/TR/WCAG22/#focus-visible) | Transforms create stacking contexts without changing normal layout, scaling can cause discomfort for some users, and keyboard focus needs a visible indication. | Raise the focused card's grid wrapper, apply the same treatment to `:focus-visible`, and remove zoom and motion transitions for reduced-motion users. |

## Secondary page visual system (October 26, 2026)

| Source | Supported finding | Decision |
| --- | --- | --- |
| [Vercel Web Interface Guidelines](https://vercel.com/design/guidelines) | Current guidance emphasizes deliberate alignment, desktop and mobile coverage, visible focus, reduced motion, and short animations on compositor-friendly properties. | Bring library, studio, collection, and detail-page chrome into one dark Atlas frame; keep card grids aligned and responsive, and make selected studio cards keyboard operable. |
| [Vercel Geist Grid guidance](https://vercel.com/geist/grid) | Use a regular responsive grid for card browsing; decorative guide grids are useful when the guides themselves explain the layout. | Keep specimen collections on simple 3/2/1-column CSS grids with consistent gaps and row alignment. |
| [MDN `minmax()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/minmax) | A zero minimum lets fractional grid tracks shrink below their min-content contribution. | Use `minmax(0, 1fr)` for the shell and page grids so live previews cannot push the application frame wider than the viewport. |

## Natural-height catalog cards (October 26, 2026)

| Source | Supported finding | Decision |
| --- | --- | --- |
| [MDN multi-column layout](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Multicol_layout) and [`break-inside`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/break-inside) | Multi-column layout is widely available, and `break-inside: avoid` keeps each card intact while the browser flows items through columns. | Use three, two, then one natural-height columns as a broad-browser fallback, with a consistent column and card gap. |
| [MDN Grid Lanes](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Grid_lanes), [Can I Use](https://caniuse.com/mdn-css_properties_display_grid-lanes), and [WebKit's compatibility guide](https://webkit.org/blog/17758/when-will-css-grid-lanes-arrive-how-long-until-we-can-use-it/) | Grid Lanes packs items into the lane with the most vertical room, but remains limited availability; Safari 26.4 supports it while Chromium and Firefox support is not yet broadly shipped. DOM source order remains intact, though visual position can differ from row scanning. | Progressively use `display: grid-lanes` where supported; keep the multi-column layout as the no-script fallback so cards stay compact in every browser. |

## Cross-section navigation (October 26, 2026)

| Source | Supported finding | Decision |
| --- | --- | --- |
| [UX by Example navigation patterns (September 11, 2026)](https://uxbyexample.co.uk/entries/navigation-patterns/) | Visible tabs work for a small set of peer destinations; category-heavy libraries benefit from a higher-capacity menu, while mobile navigation should keep the most-used destinations reachable. | Keep the four global destinations visible in the sticky desktop header, add a click-open library section switcher for all 16 categories, and give mobile a four-destination bottom bar. |
| [WAI-ARIA Breadcrumb Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/) and [Vercel Web Interface Guidelines](https://vercel.com/design/guidelines) | Breadcrumbs orient people within a hierarchy; navigation controls need keyboard operation, visible focus, clear links, and should not be covered by sticky elements. | Keep the existing hierarchical breadcrumbs, mark current destinations, and make the new section switcher keyboard operable with Escape and outside-click dismissal. |

## Liquid Glass navigation surface (October 27, 2026)

| Source | Supported finding | Decision |
| --- | --- | --- |
| [Apple HIG: Materials](https://developer.apple.com/design/human-interface-guidelines/materials) and [WWDC25: Meet Liquid Glass](https://developer.apple.com/videos/play/wwdc2025/219/) | Liquid Glass belongs to the functional navigation layer; its tint, highlights, and shadows help it stay legible while allowing content to remain visible. Apple recommends using it sparingly and avoiding stacked glass surfaces. | Use a regular-like tinted glass treatment for the shared header, with CSS blur/saturation, ambient edge lighting, fine grain, and shadow. Keep text above the material, retain the Atlas accent for the primary action, and avoid making the header fully clear. CSS approximates lensing and cannot reproduce Apple's native adaptive refraction. |
| [MDN: `prefers-reduced-transparency`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-transparency) | This media feature can detect a system preference for reducing translucent effects, but has limited browser availability. | Progressively make the header and mobile navigation surfaces nearly opaque and disable backdrop blur when the preference is available; the default fallback remains tinted and readable. |

## Accessibility and repository instructions

| Source | Supported finding | Decision |
| --- | --- | --- |
| [WCAG 2.2](https://www.w3.org/TR/WCAG22/) | WCAG defines testable accessibility criteria, including minimum text contrast and visible focus requirements. | Use semantic HTML, visible focus, keyboard-operable native controls, and target 4.5:1 contrast for normal text and 3:1 for large text. Contrast should be rechecked when tokens or surfaces change. |
| [Codex Prompting Guide: using AGENTS.md](https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide) and [Iterating Development Workflows with Codex](https://developers.openai.com/cookbook/examples/codex/iterating-development-workflows-with-codex) | Codex reads repository instruction files; durable guidance should remain concise and project-specific. | Keep the generated Next.js block intact and add concise UI Atlas architecture, conventions, documentation pointers, and verification commands. Use `docs/memory.md` for material durable decisions and verified status. |

## Fonts and licensing references

- [Pixelify Sans on Google Fonts](https://fonts.google.com/specimen/Pixelify+Sans) is used for the brand and short display text. The [Google Fonts source directory](https://github.com/google/fonts/tree/main/ofl/pixelifysans) includes its OFL license file.
- [Inter's official repository](https://github.com/rsms/inter) identifies its SIL Open Font License 1.1. Inter is reserved for readable body and interface text.
- [JetBrains Mono's official repository](https://github.com/JetBrains/JetBrainsMono) identifies the typeface as OFL-1.1. It is reserved for compact technical labels and metadata.
- Press Start 2P is not loaded. Pixelify Sans already provides the display accent without adding a fourth family.

Font licensing references were checked as part of the research pass. The selected Latin WOFF2 files and matching OFL 1.1 license texts are stored in the repository; Next.js's local font loader emits optimized self-hosted assets during build. Third-party library entries still need their own source and reuse review.

## Assumptions and limits

- The public Next.js docs can advance ahead of the pinned install. Version-sensitive route and cache behavior was checked against Next.js 16.4.1's bundled docs, not copied from a newer package.
- `next/font/google` could not reach Google Fonts in this build environment. The three official local font files and license texts remove that build-time network dependency.
- No third-party interface example or image was added. All five starter demonstrations are original CSS and React compositions.
- The color palette is a design starting point. Recheck actual text/surface pairs against WCAG when introducing new colors or changing the theme.

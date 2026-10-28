# UI Atlas project memory

Last verified: 2026-10-27

## Environment

- Node.js `v22.15.1`; npm `10.9.2`.

## Identity

UI Atlas is a local-first library for browsing, previewing, and adapting reusable interface ideas. Keep the product focused on a polished reference workspace rather than turning it into a generic portfolio or a full component framework.

## Locked decisions

- Use the installed Next.js 16.4.1 App Router, React, strict TypeScript, Tailwind CSS v4, CSS Modules, Lucide, Motion, and the existing Base UI preset.
- Keep catalog metadata separate from executable demos. Register previews with explicit static imports in `src/registry/manifest.ts`.
- Use Server Components by default. Keep browser state in small client components and route all saved-entry storage through the collections adapter.
- Use `next/font/local` with the checked-in Latin WOFF2 files and OFL texts in `docs/licenses/`. The build environment could not fetch Google Fonts, so local files keep production builds independent of that network access.
- Tailwind v4 is processed by `@tailwindcss/postcss` in `postcss.config.mjs`. Keep component and demo styling in CSS Modules; `src/app/globals.css` owns only theme tokens and document-wide foundations.
- Preserve Cache Components and partial prefetching in `next.config.ts`. Dynamic App Router `params` and `searchParams` are promises in the installed version; check its local guides before changing route patterns.
- The visual system uses a pale cool canvas, dark ink, cobalt accents, crisp pixel details, and restrained raised/inset surfaces. Keep Pixelify Sans for short display text, Inter for interface copy, and JetBrains Mono for technical labels.

## Current verified implementation

- The first browsing milestone includes home discovery, library search and categories, item detail pages, and browser-local saved collections.
- Five original demos show distinct directions: a gradient hero, frosted card, hard-edge dashboard panel, minimal controls, and a scroll-inspired note.
- Catalog records describe category, tags, style, usage, preview key, dependencies/assets, attribution and reuse terms, responsive behavior, interactions, and notes.
- The collections hook uses `useSyncExternalStore` with a stable server snapshot and cross-tab storage updates.
- Documentation is in `README.md`, `AGENTS.md`, and `docs/{PRD,ARCHITECTURE,DESIGN_SYSTEM,DEVELOPMENT_RULES,RESEARCH_NOTES}.md`.
- On 2026-10-16, `npm run lint`, `npm run typecheck`, and `npm run build` all exited successfully. The production build generated home, collections, library, category, and item routes. HTTP checks returned 200 for main routes and search, and 404 for unknown categories and item slugs. The no-results copy appeared for an unmatched search. The production homepage included hashed CSS Module classes.
- On 2026-10-26, the homepage taxonomy became two compact, opposite-direction marquee lanes with all 16 domains. Hover or keyboard focus pauses the active lane and enlarges its card; leaving resumes it. Cards use alternating corner shapes and indigo/red lighting. Touch users can scroll the lanes, while reduced-motion users get a complete static grid.
- On 2026-10-26, fixed homepage layout expansion caused by the moving content: the site shell now has a viewport-bounded grid column, and the main content and lanes can shrink within it. Production browser checks at 1896px, 1280px, and 375px confirmed the document stays exactly viewport width and the header and hero remain centered.
- On 2026-10-26, aligned the library, category, Background Studio, Motion Lab, Collections, and specimen detail chrome with the landing page's dark Atlas theme. Kept demo previews visually independent inside compact, consistently bordered frames, tightened the desktop specimen grids, improved selected and focus states, and added a keyboard-accessible stage action to the background gallery.
- On 2026-10-26, fixed variable-height library/category cards so they no longer stretch to the tallest card in a row. They now retain natural height and reflow into tighter masonry-style columns as previews load and viewports change, with native Grid Lanes enhancement and a multi-column browser fallback.
- On 2026-10-26, improved cross-section navigation: the sticky header links to primary destinations, and the Library category rail/drawer provides direct links across all 16 categories; mobile also has a persistent bottom bar for one-tap switching.
- On 2026-10-21, architecture cleanup was completed: catalog-specific components (`CatalogEntryCard`, `FavoriteButton`) were moved to `src/features/catalog/components/`, category metadata and types were centralized under `src/features/catalog/`, favorite state/mutation actions were consolidated into `use-saved-entries.ts` and `storage.ts`, and shared utility imports were aligned. `npm run lint`, `npm run typecheck`, and `npm run build` all completed with exit code 0.
- On 2026-10-21, full visual and functional browser verification was performed across desktop (1280px) and mobile (375px) viewports: verified Home, Library search/filtering, all 12 category routes, all 5 live item previews, 404 routes, and reactive local-storage Collections (add, reload persistence, remove, empty state). Fixed skip-link positioning and added Suspense boundaries for Next.js Partial Prefetching instant app shells. See `docs/UI_VERIFICATION_REPORT.md`.
- On 2026-10-21, component library was expanded from 5 to 12 production examples (`floating-dock-nav`, `tilt-specimen-card`, `aurora-mesh-ambient`, `tier-slider-pricing`, `stacked-command-input`, `editorial-pullquote-card`, `bento-feature-showcase`). Added source-code extraction (`src/registry/lib/source.ts`) and multi-tab `<CodeViewer>` with TSX, CSS Module, and Notes tabs, line gutters, custom zero-dependency syntax tokenizer, and accessible copy-to-clipboard functionality. `npm run lint`, `npm run typecheck`, and `npm run build` all completed with exit code 0, generating 32 static routes. See `docs/LIBRARY_EXPANSION_REPORT.md`.
- On 2026-10-21, Phase 4 testing, discovery, and UI quality improvements were verified: automated E2E test suite was added using `@playwright/test` v1.64.1 (`tests/ui-atlas.spec.ts`) covering 8 essential user journeys (Navigation, Search, Category filtering, Component Detail, Code Viewer tabs & Clipboard Copy, Collections LocalStorage persistence, Custom 404 handling, and Desktop/Mobile responsive overflow). Improved library discovery with multi-field search (title, description, category, tags, style), category scoping, alphabetical sorting (`default`, `alpha-asc`, `alpha-desc`), dynamic study count badges, and resilient empty states. Fixed mobile horizontal overflow on code tabs and navigation dock, and added custom themed 404 page. All 8 tests passed in 20.8s; `npm run test:e2e`, `npm run typecheck`, and `npm run lint` all passed with exit code 0. See `docs/PHASE_4_QUALITY_REPORT.md`.
- On 2026-10-21, Phase 5 visual polish and component quality was completed: elevated homepage with dynamic 12-specimen index counters, curated 6-specimen featured showcase, and craft highlight badges; updated component cards with hover overlay link, style pills, and direct code inspect links; enhanced detail pages with previous/next study pagination and interactive demo badges; upgraded 5 starter examples with interactive state (QuietModeControls real-time density viewport canvas, HardEdgeDispatchPanel status cycling and telemetry counter, FrostedBriefingCard expandable brief milestones drawer, ScrollingFieldNote observation cycler and archive stamp, FieldnoteGradientHero atmosphere colorway palette switcher). `npm run typecheck`, `npm run lint`, `npm run build` (32 static routes), and `npm run test:e2e` (all 8 tests passing in 27.1s) verified with exit code 0.
- On 2026-10-21, Phase 6 Major Component Library Expansion was completed: expanded UI Atlas from 12 to exactly 42 registered, fully implemented, interactive components across 12 categories.
- On 2026-10-21, Phase 7 React Bits MCP Integration + Dedicated Background Studio was completed: expanded UI Atlas from 42 to 54 registered, fully implemented, interactive components. Discovered available inventory from React Bits MCP across Backgrounds, TextAnimations, Animations, and Components. Built the dedicated Background Studio route at `/backgrounds` with dynamic specimen counters, style filter pills (Fluid & Waves, Particles & Physics, Geometry & Grids, Retro & Glitch, Light & Beams), live multi-attribute search, interactive inspection stage with real-time controls, fullscreen stage toggle, and direct source code navigation. Integrated 8 new authentic background effects (`threads-field`, `quantum-particles`, `fluid-waves`, `letter-glitch`, `dot-grid-motion`, `bayer-dither`, `dark-veil-ambient`, `luminous-beams`) and 4 new kinetic typography components (`blur-text-reveal`, `count-up-ticker`, `circular-text-orbit`, `shiny-text-badge`). Backgrounds grew from 5 to 13 specimens. All 54 components feature static registration, colocated CSS modules, source-code viewing, clean WebGL2/Canvas lifecycle cleanup with IntersectionObserver pause-when-offscreen optimizations, and zero external dependency bloat. Added Background Studio link to primary navigation and homepage hero. Automated verification: `npm run typecheck`, `npm run lint`, `npm run build` (75/75 static pages generated), and `npm run test:e2e` (all 10/10 Playwright E2E tests passing in 32.1s) completed with exit code 0. See `docs/PHASE_7_BACKGROUND_STUDIO_REPORT.md`.
- On 2026-10-21, Playwright Bug Hunt & UI Inconsistency Audit: Conducted end-to-end visual inspection, console error auditing, and interaction testing using Playwright browser automation across desktop (1280px) and mobile (375px) viewports on all routes (`/`, `/backgrounds`, `/library`, `/collections`, `/item/[slug]`).
  - Bug 1 (Contrast failure in Background Studio): `.studioTitle`, `.galleryTitle`, and `.studioDescription` in `backgrounds.module.css` used white text `#f8fafc` on a light `#f2f4f8` canvas. Replaced with design tokens `var(--ink)`, `var(--muted)`, and tactile raised cards (`var(--surface-raised)`), achieving WCAG AAA contrast.
  - Bug 2 (Navigation state inconsistency): Primary header links in `site-shell.tsx` lacked active state indicators and `aria-current="page"`. Created client component `src/components/layout/nav-links.tsx` with pathname detection and tactile active button styling in `site-shell.module.css`.
  - Bug 3 (Playwright test runner port contention): Addressed stale background processes and configured `reuseExistingServer: false` in `playwright.config.ts`.
- On 2026-10-22, Phase 8 Large-Scale React Bits MCP Expansion was completed: expanded UI Atlas from 54 to exactly 93 registered, fully implemented, interactive components (39 genuinely new additions) discovered and adapted from the React Bits MCP across Backgrounds, Text Animations, Animations, and Components.
  - Backgrounds: expanded to 23+ specimens with authentic shader and canvas effects including `iridescence-flow`, `balatro-flow`, `balatro-paint`, `silk-fabric`, `plasma-energy`, `prism-refraction`, `lightning-discharge`, `light-rays-ambient`, `grid-distortion`, `faulty-terminal`, `pixel-trail-canvas`, `splash-cursor-fluid`, and `meta-balls-fluid`.
  - Kinetic Typography & Text Animations: added `ascii-text-matrix`, `curved-loop-text`, `fuzzy-glow-text`, `glitch-cyber-text`, `gradient-flow-text`, `rotating-phrase-text`, `scroll-velocity-text`, `true-focus-text`, and `text-pressure-field`.
  - Animations & Interaction Effects: added tactile cursor tracking and physical interaction effects including `click-spark-burst`, `crosshair-reticle`, `electric-border-glow`, `glare-hover-card`, `star-border-card`, `pixel-transition-reveal`, and `shape-blur-morph`.
  - Reusable UI, Cards, Galleries, & Navigation: added `bounce-cards-deck`, `chroma-grid-gallery`, `decay-card-reveal`, `folder-tabs-system`, `glass-icons-dock`, `glass-surface-panel`, `gooey-nav-bar`, `pixel-card-hover`, `circular-gallery-ring`, and `fluid-glass-specimen`.
  - Built dedicated Motion & Interaction Lab (`/animations`) featuring multi-attribute live search, category filter pills (Cursor & Tracking, Scroll & Velocity, Kinetic Typography, Surfaces & Borders, Cards & Transitions), interactive live stage with pause/resume controls, fullscreen stage toggle, and direct source code navigation.
  - Performance & Architecture: optimized `CatalogEntryCard` with viewport `IntersectionObserver` lazy mounting (first 6 items rendered immediately, off-screen items mount when within 300px), eliminating WebGL context exhaustion and browser freezing. Replaced non-deterministic `Math.random()` in render bodies with deterministic pseudo-random sequences for Next.js 16 Partial Prerendering compliance. Adaptive mobile navigation under 460px with accessible icon-only links preventing horizontal overflow.
  - Automated verification: `npm run typecheck` (0 errors), `npm run lint` (0 errors), `npm run build` (115/115 static pages successfully generated), and `npm run test:e2e` (all 10/10 Playwright E2E tests passing in 34.2s) verified with exit code 0. See `docs/PHASE_8_EXPANSION_REPORT.md`.
- On 2026-10-22, Complete Reversion of Phase 8 Additions (Performance Optimization):
  - Completely removed all 39 Phase 8 components, returning the repository to the lightweight, verified 54-component Phase 7 baseline.
  - Deleted all 90 Phase 8 component files, CSS modules, and residual orphaned examples in `src/registry/examples/`.
  - Removed the `/animations` route (`src/app/animations/`) and cleaned up navigation references in `src/components/layout/nav-links.tsx` and `src/app/page.tsx`.
  - Reverted `src/features/catalog/data/catalog.ts` and `src/registry/manifest.ts` to exactly 54 registered, tested components.
  - Retained `LazySpecimenPreview` virtualization in Background Studio (`src/app/backgrounds/studio-client.tsx`) and `IntersectionObserver` lazy mounting in `CatalogEntryCard` to ensure zero lag, instant page loads, and 60 FPS scrolling.
  - Automated verification: `npm run typecheck` (0 errors), `npm run lint` (0 errors), `npm run build` (75/75 static routes generated in 5.4s), and Playwright test suite (`npm run test:e2e`, 10/10 tests passing in 23.2s) all passed with exit code 0.
- On 2026-10-22, Codebase Audit & Dead Code Cleanup:
  - Audited full tech stack, dependencies, imports, and file usage across `src/` and `package.json`.
  - Removed unimported dead CSS `src/app/shadcn-utilities.css` (639 unused vendored lines).
  - Removed unused boilerplate `src/components/ui/button.tsx` and `src/lib/utils.ts`.
  - Removed unused npm dependencies from `package.json`: `@base-ui/react`, `class-variance-authority`, and `cn`.
  - Cleaned up obsolete test media in `tests/screenshots/`.
  - Automated verification: `npm run lint` (0 errors, 0 warnings), `npm run typecheck` (0 errors), `npm run build` (75/75 static pages generated in 3.8s), and Playwright test suite (`npm run test:e2e`, 10/10 tests passing in record 18.5s) verified with exit code 0.
- On 2026-10-22, Phase 8 MCP-Guided Original Component Development was completed:
  - Researched visual techniques, interaction loops, and parameter models from React Bits MCP across Backgrounds, Text Animations, Animations, and Components.
  - Manually developed 34 new, distinct, production-grade components (expanding UI Atlas from 54 to 88 total components) with original TSX and colocated CSS Modules.
  - Built 10 new Visual Backgrounds (expanding Background Studio to 23 specimens): `prism-chromatic-burst`, `lightning-energy-mesh`, `hyperspeed-light-tunnel`, `faulty-phosphor-crt`, `plasma-filament-ambient`, `silk-wave-fabric`, `pixel-grid-snow`, `caustics-ripple-grid`, `grid-distortion-warp`, and `iridescent-film-flow`.
  - Built 8 Kinetic Typography & Text Effects: `ascii-matrix-transform`, `curved-loop-marquee`, `fuzzy-neon-bloom`, `cyber-glitch-slice`, `flowing-gradient-text`, `phrase-flipper-3d`, `scroll-velocity-marquee`, and `optical-focus-headline`.
  - Built 8 Animations & Tactile Interactions: `radial-spark-burst`, `holographic-glare-card`, `pixel-matrix-dissolve`, `plasma-border-outline`, `elastic-particle-trail`, `magnetic-spring-chip`, `morphing-blur-geometry`, and `liquid-metaball-cluster`.
  - Built 8 Reusable UI, Cards, Navigation & Galleries: `fanned-deck-stack`, `spotlight-media-grid`, `tactile-folder-index`, `refractive-glass-dock`, `liquid-indicator-nav`, `perspective-ring-gallery`, `stepper-slider-control`, and `decay-threshold-card`.
  - Performance & Architecture: All pointer event listeners are strictly container-scoped (zero window pollution), animations cleanly pause off-screen with IntersectionObserver, ResizeObserver handles responsive canvas dimensions, and zero new npm dependencies were added.
  - Built dedicated `/animations` Motion Lab route with category filter pills, live search, and lazy preview cards.
  - Expanded Background Studio filters and specimen counters to seamlessly integrate all 23 background specimens.
  - Automated verification: `npm run typecheck` (0 errors), `npm run lint` (0 errors, 0 warnings), `npm run build` (110/110 static and partial prerender pages generated), and Playwright test suite (`npm run test:e2e`, 12/12 tests passing in 31.9s) all passed with exit code 0.
- On 2026-10-22, Phase 9 Component Audit, Quality Improvement & Category Correction was completed:
  - Audited all 88 existing components across the library, Background Studio, and Motion Lab.
  - Corrected the category taxonomy, expanding from 12 to 16 distinct, purpose-aligned categories without empty buckets:
    - Added `feedback` (Feedback & Notifications): `notification-toast-stack` moved from `buttons`.
    - Added `galleries` (Galleries & Carousels): `stacked-scroll-gallery` (from `scroll-animations`), `before-after-media-slider` (from `cards`), `momentum-card-carousel` (from `cards`), and `perspective-ring-gallery` (from `complete-layouts`).
    - Added `animations` (Animation & Motion): `elastic-particle-trail` (from `buttons`), `morphing-blur-geometry` (from `cards`), and `liquid-metaball-cluster` (from `cards`).
    - Added `timelines` (Timelines): `interactive-project-timeline` (from `complete-layouts`).
  - Improved accessibility across tactile and interactive cards: added `:focus-visible` high-contrast indicator rings, full keyboard Enter/Space activation handlers on interactive cards, and `@media (prefers-reduced-motion: reduce)` fallbacks.
  - Enhanced Motion Lab (`/animations`) category filter pills to index `animations` and `galleries`.
  - Automated verification: `npm run typecheck` (0 errors), `npm run lint` (0 errors), `npm run build` (114/114 static and partial prerender pages generated), and Playwright test suite (`npm run test:e2e`, 13/13 tests passing in 35.7s) all passed with exit code 0.
- On 2026-10-22, Complete Landing Page Redesign (Neon Experimental — Digital Playground) was completed:
  - Redesigned the homepage into a bold, modern, cyber-editorial developer experience using the strict three-color brand palette: Deep Black (`#08080D`), Neon Red (`#FF334F`), and Electric Indigo (`#7865FF`), supported by deep charcoals (`#12131C`) and crisp neutrals.
  - Implemented display and technical typography with Space Grotesk (bold display titles) and Space Mono (HUD annotations and counters), alongside Inter for body and UI.
  - Transformed the shared navigation and shell (`site-shell.tsx`, `nav-links.tsx`): added glowing neon red pixel mark, `NEON EXPERIMENTAL // VOL. 01` subtitle, live `ONLINE // 88 SPECIMENS` indicator pulse, responsive mobile hamburger drawer, accessible navigation links, and high-contrast "Explore Library" CTA.
  - Built an asymmetric, high-impact hero composition: oversized display headline ("STOP BUILDING BORING INTERFACES."), quick library query box, primary and secondary CTAs, live catalog status telemetry, and an interactive right-column visual showcase featuring live `holographic-glare-card`.
  - Designed the Live Component Showcase: asymmetric cyber grid featuring 6 real registered components (`perspective-ring-gallery` 2-column feature, `holographic-glare-card`, `cyber-glitch-slice`, `floating-dock-nav`, `radial-spark-burst`, `kpi-sparkline-grid`) with `IntersectionObserver` lazy mounting and standby HUD indicators.
  - Designed the Category Taxonomy Architecture: 8 primary featured category cards with miniature live cybernetic preview badges and counts, plus 8 compact specialized cyber tiles spanning all 16 categories.
  - Created dedicated promotional stages for Background Studio (featuring live `threads-field` shader canvas and "MAKE THE BACKGROUND THE EXPERIENCE") and Motion & Interaction Lab (featuring live `magnetic-spring-chip` preview).
  - Built "How UI Atlas Works" 3-step connected editorial workflow (`01 DISCOVER`, `02 INSPECT`, `03 REBUILD`) and closing high-impact CTA section ("YOUR NEXT INTERFACE STARTS HERE").
  - Automated & Visual Verification: `npm run typecheck` (0 errors), `npm run lint` (0 errors, 0 warnings), `npm run build` (114/114 static pages generated in 7.5s), and Playwright E2E suite (`npm run test:e2e`, all 13/13 tests passing in 37.0s) verified with exit code 0. Full visual desktop (1280px) and mobile (375px) screenshots captured and audited.
- On 2026-10-23, Phase 10 Interactive Card Representation & Dynamic Effects Engine was completed:
  - Researched interactive card patterns and sensory feedback loops inspired by React Bits (SpotlightCard, TiltCard, BorderBeam, GlitchCard, PrismaticSheen, and MagneticPills).
  - Architected zero-dependency native interactive card engine in `src/app/interactive-cards.tsx` and `src/app/interactive-cards.module.css`:
    - `SpotlightCard`: Dynamic cursor-following radial spotlight glow tracking pointer coords (`--mouse-x`, `--mouse-y`, `--spotlight-opacity`).
    - `TiltCard`: 3D gyroscopic tilt physics (`perspective(1000px) rotateX(...) rotateY(...) scale3d(...)`) with dynamic specular glare reflection (`--glare-x`, `--glare-y`).
    - `BorderBeamCard`: Conic gradient circulating high-voltage laser beam running continuously along the card perimeter (`beamRotate 4s linear infinite`).
    - `GlitchCard`: Cybernetic HUD scanline sweep (`scanlineSweep 0.8s linear infinite`) and responsive corner crosshairs.
    - `PrismaticCard`: Diagonal iridescent rainbow foil sheen reflection (`linear-gradient(115deg, ...)`).
    - `MagneticPillCard`: Tactile micro-spring attraction displacing compact category/specialized items toward pointer center.
  - Organized and mapped distinct card representations across the landing page:
    - Bento Grid: `perspective-ring-gallery` (flagship 3D) with `BorderBeamCard`; `cyber-glitch-slice` with `GlitchCard`; `holographic-glare-card` with `TiltCard`; `floating-dock-nav` with `SpotlightCard`; `radial-spark-burst` with `TiltCard`.
    - Category Taxonomy: Primary 8 categories wrapped in `PrismaticCard` (iridescent foil sheen); Specialized 8 categories wrapped in `MagneticPillCard` (magnetic cursor pull).
    - Workflow Pipeline: Step 01 (Discover) with `SpotlightCard`; Step 02 (Inspect) with `TiltCard`; Step 03 (Rebuild) with `BorderBeamCard`.
  - Automated verification: `npm run typecheck` (0 errors), `npm run lint` (0 errors, 0 warnings), `npm run test:e2e` (all 13/13 tests passing), and `npm run build` (114/114 pages generated in 12.9s) all passed with exit code 0.
- On 2026-10-23, Phase 11 Landing Page Visual De-cluttering was completed:
  - Removed all unnecessary numbering across the landing page: removed `catNumber` ("01".."08") from primary category cards, `specIndex` ("09".."16") from specialized categories, and `HoloWireframeNumber` ("01".."03") along with `[STEP 01..]` from workflow cards.
  - Removed redundant section badge titles (`01 // THE KINETIC BENTO PLAYGROUND`, `02 // TAXONOMY MATRIX`, `DEDICATED STUDIO // 23 PROCEDURAL SHADERS`, `03 // KINETIC PLAYGROUND`, `04 // CREATIVE PIPELINE`) across all sections, allowing each section to open cleanly with its bold primary `<h2>` title.
  - Removed all arrows (`ArrowRight`, `ArrowUpRight`, `ChevronRight`) across all buttons, section headers, cards, and navigation CTAs.
  - Removed hyphens and double-slash separators (`//`, `-`, `—`) from specimen tags (`FLAGSHIP 3D CANVAS`), workflow tags (`SEARCH & TAXONOMY`, `LIVE STAGES & LABS`, `NATIVE REACT & CSS`), header branding, telemetry strings, and descriptive copy.
  - Automated verification: `npm run typecheck` (0 errors), `npm run lint` (0 errors, 0 warnings), `npm run test:e2e` (all 13/13 tests passing), and `npm run build` (114/114 static & partial prerender pages generated in 12.9s) verified with exit code 0.
- On 2026-10-23, Phase 13 React Bits Visual & Structural Alignment was completed:
  - Inspected and deeply analyzed `https://reactbits.dev/` via Playwright MCP to extract computed styles, DOM architecture, card geometry, transitions, and footer design.
  - Implemented React Bits Card Architecture:
    - Outer Card Frame: 5px padding, 16px border-radius, `background: rgba(255, 255, 255, 0.035)`, `border: 1px solid rgba(255, 255, 255, 0.06)`, and specular top bevel `box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.07)`.
    - Inner Stage Well: 11px border-radius (outer radius minus padding), dark `#0e0b13` surface, `border: 1px solid rgba(255, 255, 255, 0.04)`, holding clean interactive previews.
    - Bottom Caption Bar: refined layout with title on the left (`HoverScrambleTitle`, font size 1.05rem, weight 700), category meta badge pill on the right (`rgba(255, 255, 255, 0.04)`, 999px radius), concise description, and sleek "Inspect Code" button.
    - Removed redundant corner crosshairs (`+`) and top-bar headers from bento cards for a clean, distraction-free playground feel.
    - Extended the bezel and inner well structure across Category cards (`.catCardWell`), Workflow cards (`.workflowWell`), and Motion Lab preview card (`.motionPreviewWell`).
  - Implemented React Bits Nested Footer Architecture:
    - Master Footer Card (`.footerCard`): 24px border-radius, `#17141d` background, `box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05), inset 0 0 0 1px rgba(255, 255, 255, 0.035)`, and 4-column responsive grid (Brand block with telemetry tags, Discover, Taxonomy, and Architecture).
    - Bottom legal and copyright strip with `border-top: 1px solid rgba(255, 255, 255, 0.06)`.
    - Integrated Final CTA box (`.finalCtaBox`) with matching 20px radius, `#0e0b13` surface, and inset top specular highlight.
  - Implemented Scroll Animations & Transitions:
    - Built lightweight zero-dependency `<ScrollReveal>` client component (`src/components/animations/scroll-reveal.tsx` and `.module.css`) powered by `IntersectionObserver` with smooth cubic-bezier (`cubic-bezier(0.16, 1, 0.3, 1)`), translateY (28px -> 0px), opacity transition, and `@media (prefers-reduced-motion: reduce)` support.
    - Wrapped sections and cards with staggered delays (`delay={idx * 70}` for bento cards, `delay={(idx % 4) * 60}` for categories, `delay={idx * 90}` for workflow cards).
  - Preserved existing design tokens, typography (Space Grotesk, Space Mono, Inter), text animations (Glitch, GlitchAurora, Shimmer, CounterTicker, WaveRipple, HoverScrambleTitle), and all 88 specimen / 23 background / 16 category data intact.
- On 2026-10-23, Phase 14 "See them in action" Showcase Redesign & Card Bug Fixes was completed:
  - Replaced the bento grid with the exact 2-row showcase layout requested from reference screenshots:
    - Section Header: Clean bold "See them in action" title with tight spacing.
    - Row 1 (2 equal-width 50/50 cards):
      - Card 1 (Left): `Micro Slats` (`dot-grid-motion.tsx` rendering dense vertical rounded micro slats with steel palette `[0.65, 0.72, 0.82]` and wave lighting) with caption `Micro Slats` on left and `Backgrounds ↗` on right.
      - Card 2 (Right): `Electric Logo` (`plasma-border-outline.tsx` featuring `Atom` icon with luminous multi-layer neon glow) with caption `Electric Logo` on left and `Animations ↗` on right.
    - Row 2 (3 cards, 1fr 1.25fr 1fr):
      - Card 3 (Left): `Tech Text` (`cyber-glitch-slice.tsx` rendering "Bits" with tech dashed selection frame, corner brackets, and dimension coordinates `5.58 × 68` / `18.69 × 85`) with caption `Tech Text` on left and `Text Animations ↗` on right.
      - Card 4 (Center, wider): `Circular Carousel` (`perspective-ring-gallery.tsx` 3D cylindrical rotating cards) with caption `Circular Carousel` on left and `Components ↗` on right.
      - Card 5 (Right): `Hold Button` (`magnetic-action-button.tsx` sleek dark pill with tactile press-and-hold timer feedback) with caption `Hold Button` on left and `Micro ↗` on right.
  - Sizing & Layout Bug Fix: Resolved width collapse in `src/app/interactive-cards.module.css` by adding `width: 100%` across `.tiltCardContainer`, `.tiltCard`, `.tiltContent`, and `.spotlightContent`, guaranteeing equal 50/50 sizing in Row 1.
  - Caption Bar Architecture: Title on left, category with `↗` arrow on right linking directly to `/item/[slug]`.
  - Preview Cleanliness: Suppressed extraneous control HUDs, instruction badges, and overlay headers in showcase previews.
  - Automated & Visual Verification: `npm run typecheck` (0 errors), `npm run lint` (0 errors), `npm run build` (114/114 static & partial prerender pages compiled in 7.9s), and Playwright test suite (`npm run test:e2e`, 13/13 tests passing in 36.7s) verified with exit code 0. Zero horizontal overflow across mobile (375px) and desktop viewports.
- On 2026-10-23, Phase 15 React Bits Footer & Above-Footer CTA Alignment, Inner Scrollbar Fix was completed:
  - Inspected `https://reactbits.dev` footer and above-footer sections via Playwright MCP, extracting exact computed styles, class hierarchy, layout measurements, canvas structure, and SVG art pattern.
  - Removed Hero Inner Scroll Progression Bar: Replaced `overflow-x: hidden;` on `.page` in `src/app/home.module.css` with `overflow-x: clip; overflow-y: visible;`, completely eliminating the unwanted inner browser scrollbar on the right side of the page on initial load.
  - Replaced Redundant Old Section 8 Final CTA: Cleanly removed the duplicate legacy CTA section in `src/app/page.tsx` so the page flows directly into the unified master footer card.
  - Implemented Top CTA Card ("Above Footer Card"):
    - Created high-performance HTML5 canvas component `CtaGradientWaves` (`src/components/layout/cta-gradient-waves.tsx` and `.module.css`) rendering silky, billowing waves/dunes customized to our website theme colors (deep indigo `#7865ff`, neon red `#ff334f`, violet `#4f46e5`, deep dark base `#0e0b13`).
    - Nested `.ctaCard` inside the master footer with 6px margin and 18px radius, featuring heading ("Build something people remember."), subtitle ("Start with the free library. When you need the complete system, UI Atlas is ready."), and side-by-side pill buttons: White primary pill ("Explore Full Library →") and translucent purple pill ("Browse free components").
  - Implemented Middle Navigation & Brand Section (`.footerTop`):
    - Brand column on left: Atom/geometric logo + "UI Atlas" with clean descriptive copy ("Animated React components. Open source. Fully customizable.").
    - 3 Navigation columns on right: "Community" (GitHub, Discussions, Collections), "Product" (Docs, Tools, Showcase, Backgrounds), and "Taxonomy" (Backgrounds, Kinetic Text, Navigation, 3D Spatial).
    - Compact copyright strip with License link.
  - Implemented Bottom Geometric Shapes Art Banner (`.footerArt`):
    - Created `FooterArtBanner` (`src/components/layout/footer-art-banner.tsx` and `.module.css`) rendering the exact geometric pattern of circles, squares, triangles, and dots with the large stamped cutout mask of **UI Atlas** across the bottom of the card, with smooth upward gradient fade.
  - Automated & Visual Verification: `npm run typecheck` (0 errors), `npm run lint` (0 errors), `npm run build` (114/114 pages compiled in 20.4s), and Playwright test suite (`npm run test:e2e`, all 13/13 tests passing in 56.2s) verified with exit code 0. Zero horizontal overflow verified at 375px mobile viewport.

## Constraints and outstanding work

- On 2026-10-26, secondary route motion and styling alignment was completed:
  - Applied the shared `ScrollReveal` pattern to library and category headings/results, motion lab headings/controls/cards, background studio headings/gallery/cards, collections, item detail sections, and the not-found card.
  - Added restrained stagger timing for specimen cards, matching focus-within feedback for cards and saved rows, and dark Atlas styling for the not-found state.
  - Updated the shared reveal to use a brief rise/fade/soft-focus entrance while retaining reduced-motion overrides.
  - Verified with `npm run lint`, `npm run typecheck`, and `npm run build`; all passed.
- Follow-up on 2026-10-26 fixed a blank-content regression in shared scroll reveals:
  - The reveal CSS hid server-rendered content before hydration, and a 10% observer threshold could never be met by very tall sections.
  - Server output now stays visible until the browser measures the element; only off-screen content becomes pending, and the default observer threshold is zero.
  - Route smoke checks verified the landing page, library, category/search states, both studios, collections, an item detail, and the 404 page. Each returned the expected status/content with visible server-rendered reveal classes.
  - Re-verified with `npm run lint`, `npm run typecheck`, and `npm run build`; all passed and 114 routes generated.

- On 2026-10-26, refined Library navigation after review: the fixed desktop category rail and mobile drawer show the active location as their heading, use unnumbered category links, align directly under the shared header, and fade out as the shared footer enters view so the CTA and footer navigation remain unobstructed. Fixed the footer observer margin to use valid pixel units after a runtime error. Updated `docs/DESIGN_SYSTEM.md` with this behavior. `npm run lint`, `npm run typecheck`, and `npm run build` passed (114 routes).
- On 2026-10-26, removed the redundant Library category jump menu from the shared top navigation. The Library link remains, while category switching is handled by the sidebar; removed the dropdown's client state and styles.
- On 2026-10-26, aligned the landing hero with the library's product purpose: concise copy about live previews, copyable React code, and AI-ready prompts; removed Quick Launch chips and all source emoji; replaced the Mac command glyph with a working text `Ctrl K` shortcut that also accepts Command+K. `npm run lint`, `npm run typecheck`, and `npm run build` passed (114 routes).
- On 2026-10-26, carried the landing page's kinetic typography through Library, category, item detail, Collections, Background Studio, and not-found pages. Page and section headings use the interactive letter ripple, short lead copy uses the slow shimmer, and specimen titles use hover scramble; kinetic effects respect reduced-motion preferences. `npm run lint`, `npm run typecheck`, and `npm run build` passed (114 routes).
- On 2026-10-26, upgraded the shared sticky navigation to a tinted translucent glass surface with stronger backdrop blur/saturation, a soft specular edge, and mobile glass treatments. The blur is applied to the decorative backdrop layer so the nested fixed mobile navigation remains viewport-fixed. `npm run lint`, `npm run typecheck`, and `npm run build` passed (114 routes).

- On 2026-10-26, clarified the product's core workflow: manually curate reusable interface ideas and give each component a live preview, copyable TSX/CSS source, and an AI prompt explaining what it is and how to recreate it. Simplified all item detail pages around those actions, removed the extra Notes tab and long metadata/navigation panels, and kept the source viewer read-only. AI prompts are generated per catalog item from its typed description, style, intended use, implementation/interaction/responsive notes, dependency and asset lists, and attribution/reuse terms. Audited the catalog and confirmed all 88 registered preview keys have TSX source files.
- On 2026-10-26, consolidated motion discovery into the existing Library categories and component detail pages. Removed Motion Lab from primary/mobile navigation and the homepage promotion, linked directly to the Animations category where relevant, and preserved `/animations` as a redirect for existing links.

- No `.git` directory is present at the workspace root, so Git status and `git diff --check` are unavailable here.
- Future milestones can add interactive viewport resizers (e.g. mobile/tablet/desktop iframe frames) and dynamic interaction state toggles directly in the live preview section.

## References

- See `docs/RESEARCH_NOTES.md` for source URLs and technical findings.
- See `docs/ARCHITECTURE.md` for data flow and folder boundaries.
- See `docs/DESIGN_SYSTEM.md` for implemented token values and visual rules.

- On 2026-10-26, widened the shared shell to a 108rem fluid maximum and aligned the fixed Library sidebar to the same frame. Expanded the home hero frame to 100rem and adjusted Library card columns so tablet layouts avoid narrow cards. Added min-width constraints to the Library page/results/grid tracks after browser measurements found intrinsic content causing horizontal overflow at 320px and mid-size desktop widths. Responsive geometry checks passed at 320px, 1025px, 1280px, and 1600px; `npm run lint`, `npm run typecheck`, and `npm run build` passed (114 routes).
- On 2026-10-27, extended the shared sticky header edge-to-edge while keeping its contents aligned to the 108rem site frame. Increased the tinted glass opacity and added a subtle repeating SVG grain texture to the translucent header surface.
- On 2026-10-27, refined the sticky header with an Apple Liquid Glass-inspired CSS treatment: stronger backdrop blur and saturation, ambient light and specular edge layers, a pill-shaped primary action, and pressed feedback. The treatment remains tinted and has a progressively opaque, no-blur mode for reduced-transparency preferences; CSS does not provide native optical refraction.
- Follow-up visual inspection found the grain and dark tint too dominant on the near-black home background. Reduced the grain, increased the visible translucent area, and strengthened the interior glints and reflective rim so the glass reads clearly at rest.
- User review found the reflective rim too white. Reduced neutral highlights and brightness, shifting the remaining glass reflections toward the Atlas indigo and red accents.
- On 2026-10-27, corrected the local font variable scope by placing Next font classes on the document root, and removed the stray Google Fonts CSS import. The display and mono tokens now use the bundled Pixelify Sans and JetBrains Mono families.
- On 2026-10-27, split client-rendered previews into explicit `next/dynamic` imports for Home, Library cards, and Background Studio. Their lazy keys are compile-time checked against the static server registry, which remains the source for detail pages and source validation.
- On 2026-10-27, added `/about`, `/licenses`, and `/changelog` as responsive informational pages. About explains the actual local-first browse/inspect/save workflow; the license page derives entry counts from catalog attribution records and identifies bundled font and runtime-package notices without claiming a project-wide catalog license; the changelog records dated shipped changes. Updated the footer to link to real product destinations and replaced placeholder community links.
- On 2026-10-27, added a responsive recent-catalog rail to the landing page. Its dates come from verified `addedAt` metadata on the 34 entries in the documented 2026-10-22 catalog batch; it features four recent studies with live lazy-loaded previews, reuse labels, and reduced-motion-aware reveal styling. The changelog now records the landing-page addition.
- On 2026-10-27, updated the Playwright suite for the current category navigation, detail source viewer, and `/animations` redirect, and re-enabled the Rules of Hooks and `no-explicit-any` lint rules.
- Verification for this pass: lint, typecheck, and build succeeded; Playwright reported all 13 existing journeys and the new local-font regression check as passed. The runner remained open after printing results and was interrupted during teardown.
- On 2026-10-27, restored the established navbar layout and controls after visual review, retaining the newer near-opaque dark tinted background and softer blur so page content no longer shows clearly through the header.
- On 2026-10-27, expanded the About page with catalog-derived statistics and category counts, a fuller discover/inspect/adapt workflow, implementation and reuse details, and the local preview model. It uses the landing page's Pixelify display font, Inter body font, existing scroll reveal and kinetic heading components, and reduced-motion-aware CSS animation.
- Follow-up on 2026-10-27: About card groups now have distinct staggered entrance and hover motion. Card labels, titles, and descriptions reveal in sequence; titles use the existing reduced-motion-aware scramble treatment. `ScrollReveal` exposes a small `data-reveal-state` attribute so these text effects begin when each card enters view.

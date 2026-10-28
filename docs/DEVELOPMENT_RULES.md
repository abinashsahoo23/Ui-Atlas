# UI Atlas development rules

## TypeScript and React

- Keep TypeScript strict. Prefer explicit catalog types and narrow unions for categories.
- Use React Server Components by default. Add `"use client"` only for browser state or interaction, and keep the client boundary small.
- Props passed to Client Components must be serializable. Never read localStorage during server rendering.
- Use semantic HTML and native controls where they provide correct keyboard behavior.
- Keep one clear responsibility per component. Extract repeated or independently styled sections; avoid abstractions that only wrap one trivial use.

## File and naming conventions

- Keep routes in `src/app`, shared UI in `src/components`, feature behavior under `src/features`, and demos under `src/registry/examples`.
- Name component files descriptively and colocate substantial styles as `<component>.module.css`.
- Keep catalog metadata in `src/features/catalog/data/catalog.ts`; keep executable preview imports in `src/registry/manifest.ts`.
- Add a demo under a category folder with its own CSS Module and register it with a stable preview key.
- Avoid empty scaffolding, duplicate docs, and unnecessary files or dependencies.

## CSS and design tokens

- Keep global selectors limited to the document reset, base typography, tokens, focus, selection, and accessibility foundations.
- Use CSS Modules for page, component, and example-specific styling. Do not use global classes to style individual components.
- Reuse existing token values before introducing a new color, spacing, border, shadow, or focus treatment.
- Use Tailwind v4 theme variables to expose shared color and font utilities. Reserve utilities for straightforward layout and spacing.
- Keep responsive, hover, focus, active, disabled, and selected states beside the component they affect.
- Do not use `!important` routinely or duplicate a rule across global CSS, Tailwind, and modules.

## Responsive design and accessibility

- Check narrow, medium, and wide layouts; the page must not require horizontal scrolling at 320px.
- Use readable contrast, semantic structure, accessible names, keyboard access, and a visible focus indicator.
- Respect `prefers-reduced-motion`. Do not make meaning depend on motion, hover, color, or shadow alone.
- Keep targets comfortable for touch and avoid layout shifts that obscure content.

## Catalog, attribution, and licensing

- IDs are stable and unique; slugs are URL-safe and unique; preview keys resolve to explicit static registrations.
- Metadata describes the preview, use, style, dependencies, fonts/assets, responsive behavior, and interactions.
- Record real source URLs and attribution for third-party entries. Verify the licence and permitted reuse before adding one.
- Mark original work as original. Do not invent sources, licence status, or asset provenance.
- Never execute arbitrary JavaScript from the catalog or load modules from metadata strings.
- Keep preview styles isolated and declare preview-specific packages. Prefer first-party, lightweight demos.

## Storage and error handling

- Keep saved IDs behind `src/features/collections/lib/storage.ts`; use the client hook for React subscriptions.
- Treat browser storage as unavailable or malformed. Do not allow storage errors to break the library UI.
- Unknown route categories and entry slugs should use `notFound()`. A missing preview should display a clear fallback.
- Ignore stale saved IDs when they no longer correspond to catalog entries.

## Dependencies and verification

- Inspect `package.json` before adding packages. Reuse the current Next, React, Tailwind, Lucide, Motion, and Base UI setup where appropriate.
- Read the installed Next.js guide in `node_modules/next/dist/docs/` before changing framework conventions. In particular, check async route props and cache-component behavior against this installed version.
- After app changes, run `npm run lint`, `npm run typecheck`, and `npm run build`.
- Review the changed-file list and run `git diff --check` when Git is available. Report actual command results.
- Preserve unrelated work and avoid commits, pushes, deployment, or destructive cleanup unless requested separately.

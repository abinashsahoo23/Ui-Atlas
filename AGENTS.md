<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# UI Atlas

UI Atlas is a local-first library of interface ideas and reusable React previews. It uses Next.js App Router, React, strict TypeScript, Tailwind CSS v4, CSS Modules, Lucide React, and a typed catalog with statically registered demos.

## Project boundaries

- Keep routes in `src/app`, shared shell and controls in `src/components`, catalog metadata and browsing in `src/features/catalog`, browser-local saves in `src/features/collections`, and preview implementations in `src/registry/examples`.
- Keep catalog metadata separate from executable previews. Register previews with static imports in `src/registry/manifest.ts`; never execute metadata strings or arbitrary source.
- Use Server Components by default. Limit Client Components to browser state or interaction. Keep localStorage access behind the collections adapter and its client hook.
- Keep `src/app/globals.css` to tokens, Tailwind setup, resets, and true document defaults. Put page, component, and demo styling in colocated CSS Modules.
- Prefer the existing dependencies and patterns. Avoid redundant packages, empty scaffolding, and unrelated rewrites.

## Implementation standards

- Use design tokens for shared colors, spacing, borders, focus, and surfaces. Preserve the pixel-inspired geometry and restrained neumorphic depth described in `docs/DESIGN_SYSTEM.md`.
- Use semantic HTML, visible keyboard focus, responsive layouts, reduced-motion support, and readable contrast. Record real source, attribution, and reuse terms for every non-original entry.
- Consult `docs/PRD.md` for product scope, `docs/ARCHITECTURE.md` for boundaries and data flow, `docs/DEVELOPMENT_RULES.md` for implementation conventions, and `docs/RESEARCH_NOTES.md` for verified technical decisions.
- Read `docs/memory.md` when a change depends on earlier decisions or status. Update it when a material project decision, constraint, or verified implementation status changes.
- Preserve the generated Next.js instruction block above. Before changing framework conventions, read the matching guide in `node_modules/next/dist/docs/` for the installed Next version.

## Verification

- Run `npm run lint`, `npm run typecheck`, and `npm run build` after implementation changes that affect the app.
- Review changed files and use `git diff --check` when the workspace is a Git repository. Report checks that could not run; do not infer results.

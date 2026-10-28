# UI Atlas

UI Atlas is a personal, searchable library for interface patterns, React previews, visual references, and reusable ideas. The first milestone includes five original studies, category browsing, entry details, search, and browser-local saves.

## Stack

- Next.js App Router 16 and React 19
- Strict TypeScript
- Tailwind CSS v4 and CSS Modules
- Lucide React; Motion for React is installed for future examples
- Typed catalog metadata and a static preview registry
- localStorage for device-local saved entries

## Prerequisites

- Node.js 20.9 or newer
- npm 10 or newer

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project checks

```bash
npm run lint
npm run typecheck
npm run build
npm run start
```

## Project map

- `src/app/` — App Router pages and global CSS tokens
- `src/components/` — shared shell layout and UI primitives
- `src/features/catalog/` — typed metadata, catalog browsing components, and lookup helpers
- `src/features/collections/` — browser-local saved entries and collections hooks
- `src/registry/` — isolated demo preview components and registry manifest
- `docs/` — requirements, architecture, design system, research, and development rules

## Project documentation

- [Product requirements](docs/PRD.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Design system](docs/DESIGN_SYSTEM.md)
- [Development rules](docs/DEVELOPMENT_RULES.md)
- [Technical research notes](docs/RESEARCH_NOTES.md)
- [Project memory](docs/memory.md)

The catalog has no backend, account system, cloud sync, or payment integration. Third-party references should only be added after checking their source and reuse terms.

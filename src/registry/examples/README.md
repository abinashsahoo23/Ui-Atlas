# Example preview modules

Add each preview in a category folder, for example:

```text
src/registry/examples/hero-sections/editorial-hero.tsx
src/registry/examples/hero-sections/editorial-hero.module.css
```

Keep preview styles in a colocated CSS Module. Register the preview with an explicit
static import in `src/registry/manifest.ts`; catalog data must never provide a module
path or executable source. Use a Client Component only when the preview needs browser
state or interaction. Motion can be imported from `motion/react` in a Client Component
or from `motion/react-client` when a Server Component can render the effect.

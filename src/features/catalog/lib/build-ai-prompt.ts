import type { CatalogItem } from "@/features/catalog/types";

export function buildAiBuildPrompt(entry: CatalogItem): string {
  const dependencies = entry.dependencies.length
    ? entry.dependencies.join(", ")
    : "React and the existing project stack; do not add packages";
  const fonts = entry.fonts.length ? entry.fonts.join(", ") : "Use the project defaults";
  const assets = entry.assets.length ? entry.assets.join(", ") : "No supplied assets";

  return [
    "Build a reusable React component that recreates this UI reference. Treat these details as the source of truth. Keep the result focused on the component itself; do not add a visual editor, playground, or configuration panel.",
    "",
    `Component: ${entry.title}`,
    `Category: ${entry.category}`,
    `What it is: ${entry.description}`,
    `Visual direction: ${entry.style}`,
    `Intended use: ${entry.intendedUse}`,
    `How to build it: ${entry.implementationNotes}`,
    `Interactions: ${entry.interactionNotes}`,
    `Responsive behavior: ${entry.responsiveNotes}`,
    `Tags: ${entry.tags.join(", ")}`,
    `Dependencies: ${dependencies}`,
    `Fonts: ${fonts}`,
    `Assets: ${assets}`,
    `Attribution and reuse: ${entry.attribution}. ${entry.license}`,
    "",
    "Implementation requirements:",
    "- Use React with TypeScript and locally scoped CSS Modules, matching the existing project stack and conventions.",
    "- Recreate the visual hierarchy, spacing, colors, typography, and interactions described above.",
    "- Use semantic, keyboard-accessible controls with visible focus states and respect prefers-reduced-motion.",
    "- Make the component responsive and avoid horizontal overflow.",
    "- Use only the listed dependencies and assets; do not invent third-party attribution.",
    "",
    "Return the complete component source and its CSS Module, ready to copy into a project, followed by a short note explaining how to use it.",
  ].join("\n");
}

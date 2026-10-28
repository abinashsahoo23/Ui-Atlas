import type { CategoryDefinition } from "../types";

export const categoryDefinitions = [
  { slug: "hero-sections", title: "Hero sections", description: "Opening sections that set a page’s visual direction." },
  { slug: "navigation", title: "Navigation", description: "Menus, tabs, breadcrumbs, and wayfinding patterns." },
  { slug: "cards", title: "Cards", description: "Reusable surfaces for grouping related content." },
  { slug: "buttons", title: "Buttons", description: "Action controls and small interaction details." },
  { slug: "text-effects", title: "Text effects", description: "Type treatments, headings, and animated lettering." },
  { slug: "backgrounds", title: "Backgrounds", description: "Textures, gradients, patterns, and ambient surfaces." },
  { slug: "scroll-animations", title: "Scroll animations", description: "Motion tied to scrolling and entering the viewport." },
  { slug: "forms", title: "Forms", description: "Inputs, validation states, and form layouts." },
  { slug: "feedback", title: "Feedback & Notifications", description: "Alerts, toasts, banners, and status messages." },
  { slug: "galleries", title: "Galleries & Carousels", description: "Carousels, sliders, perspective stacks, and media showcases." },
  { slug: "animations", title: "Animation & Motion", description: "Interactive physics, fluid dynamics, and generative motion." },
  { slug: "timelines", title: "Timelines", description: "Chronological narratives, milestones, and sequence tracking." },
  { slug: "pricing", title: "Pricing", description: "Plans, comparison tables, and purchase decision layouts." },
  { slug: "testimonials", title: "Testimonials", description: "Customer quotes and social proof patterns." },
  { slug: "dashboards", title: "Dashboards", description: "Data views, metrics, and application overview screens." },
  { slug: "complete-layouts", title: "Complete layouts", description: "Full-page compositions and larger interface studies." },
] as const satisfies readonly CategoryDefinition[];

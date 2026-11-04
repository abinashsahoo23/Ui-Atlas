import { catalogEntries } from "@/features/catalog/data/catalog";
import { BackgroundStudioClient } from "./studio-client";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Background Studio",
  description:
    "Browse and customize interactive background studies, including procedural shaders, generative canvas effects, and responsive visual surfaces.",
  path: "/backgrounds",
  keywords: ["interactive backgrounds", "React background effects", "canvas backgrounds"],
});

export default function BackgroundStudioPage() {
  const backgroundEntries = catalogEntries.filter((item) => item.category === "backgrounds");

  return <BackgroundStudioClient entries={backgroundEntries} />;
}

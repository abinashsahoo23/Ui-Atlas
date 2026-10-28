import type { Metadata } from "next";
import { catalogEntries } from "@/features/catalog/data/catalog";
import { BackgroundStudioClient } from "./studio-client";

export const metadata: Metadata = {
  title: "Background Studio // UI Atlas",
  description:
    "Interactive studio to browse, compare, customize, and inspect procedural WebGL2 shaders, generative canvas particle physics, and responsive kinetic background surfaces.",
};

export default function BackgroundStudioPage() {
  const backgroundEntries = catalogEntries.filter((item) => item.category === "backgrounds");

  return <BackgroundStudioClient entries={backgroundEntries} />;
}

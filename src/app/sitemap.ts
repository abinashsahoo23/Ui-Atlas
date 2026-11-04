import type { MetadataRoute } from "next";
import { catalogEntries } from "@/features/catalog/data/catalog";
import { categoryDefinitions } from "@/features/catalog/data/categories";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/library`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/backgrounds`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/changelog`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/licenses`, changeFrequency: "monthly", priority: 0.4 },
  ];

  const categoryPages: MetadataRoute.Sitemap = categoryDefinitions.map(({ slug }) => ({
    url: `${SITE_URL}/library/${slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const itemPages: MetadataRoute.Sitemap = catalogEntries.map(({ slug }) => ({
    url: `${SITE_URL}/item/${slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...itemPages];
}

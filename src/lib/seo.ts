import type { Metadata } from "next";

export const SITE_URL = "https://ui-atlas-teal.vercel.app";
export const SITE_NAME = "UI Atlas";
export const SITE_DESCRIPTION =
  "Explore a searchable library of original React interface studies with live previews, component source, responsive notes, and reuse context.";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  robots?: Metadata["robots"];
};

export function createPageMetadata({
  title,
  description,
  path,
  keywords,
  robots,
}: PageMetadataOptions): Metadata {
  const socialTitle = `${title} | ${SITE_NAME}`;
  const image = {
    url: "/opengraph-image",
    width: 1200,
    height: 630,
    alt: "UI Atlas — React interface studies and component previews",
  };

  return {
    title,
    description,
    alternates: { canonical: path },
    ...(keywords?.length ? { keywords } : {}),
    ...(robots ? { robots } : {}),
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: SITE_NAME,
      title: socialTitle,
      description,
      url: path,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [image.url],
    },
  };
}

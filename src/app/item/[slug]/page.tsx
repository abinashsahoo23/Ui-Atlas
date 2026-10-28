import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Suspense } from "react";
import { FavoriteButton } from "@/features/catalog/components/favorite-button";
import { getCatalogEntry, getCategory } from "@/features/catalog/lib/catalog";
import { catalogEntries } from "@/features/catalog/data/catalog";
import { ClientExamplePreview } from "@/registry/client-previews";
import { getExampleSource } from "@/registry/lib/source";
import { CodeViewer } from "@/components/ui/code-viewer";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { buildAiBuildPrompt } from "@/features/catalog/lib/build-ai-prompt";
import { ShimmerText, WaveRippleHeading } from "@/app/kinetic-text-effects";
import styles from "./item.module.css";

type ItemPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return catalogEntries.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ItemPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getCatalogEntry(slug);
  return entry ? { title: entry.title, description: entry.description } : {};
}

export default function ItemPage({ params }: ItemPageProps) {
  return (
    <Suspense fallback={<p role="status">Loading entry…</p>}>
      <ItemContent params={params} />
    </Suspense>
  );
}

async function ItemContent({ params }: ItemPageProps) {
  const { slug } = await params;
  const entry = getCatalogEntry(slug);
  if (!entry) notFound();

  const category = getCategory(entry.category);
  const sourceFiles = getExampleSource(entry.previewKey);

  return (
    <article className={styles.page}>
      <ScrollReveal as="nav" className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/library"><ArrowLeft size={14} aria-hidden="true" /> Library</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/library/${entry.category}`}>{category?.title ?? entry.category}</Link>
        <span aria-hidden="true">/</span>
        <span className={styles.breadcrumbCurrent}>{entry.title}</span>
      </ScrollReveal>

      <ScrollReveal as="header" className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>{category?.title ?? entry.category}</p>
          <h1><WaveRippleHeading text={entry.title} periodChar="" /></h1>
          <p className={styles.intro}>
            <ShimmerText speed="slow" theme="silver">{entry.description}</ShimmerText>
          </p>
        </div>
        <FavoriteButton entryId={entry.id} title={entry.title} />
      </ScrollReveal>

      <ScrollReveal as="section" className={styles.previewSection} aria-labelledby="preview-title">
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.sectionEyebrow}>LIVE COMPONENT</p>
            <h2 id="preview-title"><WaveRippleHeading text="Preview" periodChar="" /></h2>
          </div>
          <span className={styles.previewBadge}>UI ATLAS SPECIMEN</span>
        </div>
        <div className={styles.preview}>
          <ClientExamplePreview previewKey={entry.previewKey} />
        </div>
      </ScrollReveal>

      {sourceFiles ? (
        <ScrollReveal as="section" className={styles.codeSection} aria-labelledby="code-title">
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.sectionEyebrow}>COPY-READY SOURCE</p>
              <h2 id="code-title"><WaveRippleHeading text="Component code" periodChar="" /></h2>
            </div>
          </div>
          <CodeViewer
            previewKey={entry.previewKey}
            tsxCode={sourceFiles.tsx}
            cssCode={sourceFiles.css}
            aiPrompt={buildAiBuildPrompt(entry)}
          />
          <p className={styles.sourceNote}>
            {entry.attribution}. {entry.license}
            {entry.sourceUrl && (
              <a href={entry.sourceUrl} target="_blank" rel="noreferrer">
                View original source <ExternalLink size={12} aria-hidden="true" />
              </a>
            )}
          </p>
        </ScrollReveal>
      ) : (
        <p role="status" className={styles.sourceUnavailable}>
          Source code is not available for this component yet.
        </p>
      )}
    </article>
  );
}

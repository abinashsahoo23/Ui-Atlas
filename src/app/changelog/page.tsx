import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Bookmark, Gauge, Layers3, Sparkles, Terminal } from "lucide-react";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { catalogEntries } from "@/features/catalog/data/catalog";
import { categoryDefinitions } from "@/features/catalog/data/categories";
import { ShimmerText, WaveRippleHeading } from "@/app/kinetic-text-effects";
import styles from "./changelog.module.css";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Product and catalog updates from UI Atlas.",
};

const backgroundCount = catalogEntries.filter((entry) => entry.category === "backgrounds").length;

const updates = [
  {
    date: "2026-10-27",
    displayDate: "October 27, 2026",
    label: "ABOUT UI ATLAS",
    icon: Sparkles,
    title: "A fuller field guide for interface builders",
    description: "The About page now explains the discovery workflow, what each study includes, local-first behavior, and reuse context, with live catalog counts, animated copy, distinct card reveals, and direct paths into key categories.",
  },
  {
    date: "2026-10-27",
    displayDate: "October 27, 2026",
    label: "DISCOVERY",
    icon: Layers3,
    title: "A new shelf for recent additions",
    description: "The landing page now highlights four entries from the latest dated catalog batch, with their add dates, categories, reuse labels, and direct preview links.",
  },
  {
    date: "2026-10-27",
    displayDate: "October 27, 2026",
    label: "PERFORMANCE",
    icon: Gauge,
    title: "Lighter work between pages",
    description: "Item routes resolve only the selected live preview through the lazy client registry. Library cards render directly, removing a duplicate reveal observer from every result.",
  },
  {
    date: "2026-10-27",
    displayDate: "October 27, 2026",
    label: "INTERFACE",
    icon: Sparkles,
    title: "A more readable glass header",
    description: "The familiar full-width navbar keeps its established layout with a darker tinted surface, soft blur, and restrained indigo and red reflections. Reduced-transparency preferences receive a more opaque treatment.",
  },
  {
    date: "2026-10-26",
    displayDate: "October 26, 2026",
    label: "CATALOG",
    icon: Layers3,
    title: "One index for every kind of interface idea",
    description: `The catalog now brings ${catalogEntries.length} registered studies together across ${categoryDefinitions.length} domains, including ${backgroundCount} background entries. Motion work stays in the same searchable library.`,
  },
  {
    date: "2026-10-26",
    displayDate: "October 26, 2026",
    label: "WORKFLOW",
    icon: Bookmark,
    title: "Local saves and copy-ready source",
    description: "Collection saves remain in the current browser. Detail pages pair interactive previews with read-only TSX and CSS, attribution, and an AI-ready implementation prompt.",
  },
];

export default function ChangelogPage() {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}><Terminal size={14} aria-hidden="true" /> THE BUILD LOG / VOL. 01</p>
          <h1><WaveRippleHeading text="What’s new" periodChar="." /></h1>
          <p className={styles.lead}>
            <ShimmerText speed="slow" theme="silver">
              A concise record of the product, catalog, and interface changes shaping UI Atlas.
            </ShimmerText>
          </p>
        </div>
        <div className={styles.latestStamp}>
          <span className={styles.latestDot} />
          <span><strong>{updates.length} UPDATES</strong><br />LATEST / OCT 27</span>
        </div>
      </header>

      <div className={styles.timelineIntro}>
        <span>RELEASE NOTES</span>
        <p>Updates are curated from shipped project changes. Dates reflect the recorded implementation milestones.</p>
      </div>

      <ScrollReveal as="section" className={styles.timeline} aria-label="UI Atlas release history">
        {updates.map(({ date, displayDate, label, icon: Icon, title, description }, index) => (
          <article className={styles.update} key={`${date}-${label}`}>
            <div className={styles.timelineMarker} aria-hidden="true"><span>{String(index + 1).padStart(2, "0")}</span></div>
            <div className={styles.updateCard}>
              <div className={styles.updateMeta}>
                <time dateTime={date}>{displayDate}</time>
                <span className={styles.updateLabel}><Icon size={12} aria-hidden="true" /> {label}</span>
              </div>
              <h2>{title}</h2>
              <p>{description}</p>
            </div>
          </article>
        ))}
      </ScrollReveal>

      <div className={styles.endCard}>
        <div className={styles.endIcon}><Layers3 size={18} aria-hidden="true" /></div>
        <div><p className={styles.eyebrow}>KEEP EXPLORING</p><h2>The latest ideas are in the library.</h2><p>Browse the full index or keep a few useful patterns in your local collection.</p></div>
        <div className={styles.endActions}>
          <Link href="/library">Browse library <ArrowUpRight size={14} aria-hidden="true" /></Link>
          <Link href="/collections">Saved entries <Bookmark size={14} aria-hidden="true" /></Link>
        </div>
      </div>
    </div>
  );
}

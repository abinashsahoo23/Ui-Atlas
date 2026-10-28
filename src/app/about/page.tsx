import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Bookmark,
  Code2,
  Eye,
  Info,
  Layers3,
  LockKeyhole,
  Search,
  Sparkles,
} from "lucide-react";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { catalogEntries } from "@/features/catalog/data/catalog";
import { categoryDefinitions } from "@/features/catalog/data/categories";
import { CounterTicker, HoverScrambleTitle, ShimmerText, WaveRippleHeading } from "@/app/kinetic-text-effects";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About UI Atlas",
  description: "Explore how UI Atlas organizes live interface studies, implementation details, and reuse context.",
};

const backgroundCount = catalogEntries.filter((entry) => entry.category === "backgrounds").length;
const dependencyFreeCount = catalogEntries.filter((entry) => entry.dependencies.length === 0).length;
const spotlightSlugs = ["backgrounds", "navigation", "cards", "animations"] as const;
const spotlightCategories = categoryDefinitions
  .filter((category) => spotlightSlugs.includes(category.slug as (typeof spotlightSlugs)[number]))
  .map((category) => ({
    ...category,
    count: catalogEntries.filter((entry) => entry.category === category.slug).length,
  }));

const workflow = [
  {
    number: "01",
    icon: Search,
    title: "Find a direction",
    description: "Search by title, visual style, category, description, or tag. Browse the taxonomy when you want to explore a whole design territory.",
    footnote: "SEARCH · FILTER · SAVE",
  },
  {
    number: "02",
    icon: Eye,
    title: "Study the behavior",
    description: "Open a live React preview, try its available controls, and check responsive notes before you decide whether the pattern fits.",
    footnote: "PREVIEW · INTERACT · REVIEW",
  },
  {
    number: "03",
    icon: Code2,
    title: "Adapt it to your work",
    description: "Read and copy the component source, scoped styles, or AI-ready prompt, then tailor the idea to your own product.",
    footnote: "READ · COPY · REBUILD",
  },
];

const studyDetails = [
  {
    icon: Eye,
    label: "LIVE SPECIMENS",
    title: "See how it behaves",
    description: "Try each registered component in a working preview. Controls are included where the original idea benefits from interaction.",
  },
  {
    icon: Code2,
    label: "IMPLEMENTATION",
    title: "Read the actual source",
    description: "Inspect copyable React and CSS Module files with dependency, asset, and responsive notes attached to the entry.",
  },
  {
    icon: Sparkles,
    label: "AI-READY CONTEXT",
    title: "Take a useful brief with you",
    description: "Each build prompt explains the pattern, its intended use, interactions, responsive behavior, and implementation constraints.",
  },
  {
    icon: Info,
    label: "REUSE DETAILS",
    title: "Know what you can reuse",
    description: "Attribution and license information stay beside the study they describe, so reuse context is visible before you copy.",
  },
];

const principles = [
  {
    icon: LockKeyhole,
    title: "Your saves stay in this browser",
    description: "Collections use browser storage. There is no account, remote profile, or cross-device sync in the current product.",
  },
  {
    icon: Layers3,
    title: "Previews are registered deliberately",
    description: "Catalog data describes each study; a static registry maps it to its preview. Metadata is never treated as executable code.",
  },
  {
    icon: Bookmark,
    title: "Reference with context",
    description: "Source, dependencies, intended use, responsive notes, attribution, and reuse terms are recorded with each catalog entry.",
  },
];

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <ScrollReveal as="section" className={styles.hero} aria-labelledby="about-title">
        <div className={styles.heroCopy}>
          <p className={`${styles.eyebrow} ${styles.animatedText}`}>THE UI ATLAS / A FIELD GUIDE FOR BUILDERS</p>
          <h1 id="about-title" className={styles.animatedText}>
            <WaveRippleHeading text="Better interfaces start here" periodChar="." />
          </h1>
          <p className={`${styles.lead} ${styles.animatedText}`}>
            <ShimmerText speed="slow" theme="silver">
              UI Atlas is a hands-on reference library for discovering interface patterns, trying real React previews, and understanding what it takes to make each idea your own.
            </ShimmerText>
          </p>
          <div className={styles.heroActions}>
            <Link className={styles.primaryAction} href="/library">
              Explore the library <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
            <Link className={styles.secondaryAction} href="/licenses">
              Reuse and licensing <Info size={15} aria-hidden="true" />
            </Link>
          </div>
          <p className={`${styles.heroNote} ${styles.animatedText}`}>LOCAL FIRST <span /> NO ACCOUNT REQUIRED <span /> BUILT FOR EXPLORATION</p>
        </div>

        <aside className={styles.indexCard} aria-label="UI Atlas catalog snapshot">
          <div className={styles.indexTopline}>
            <span><Layers3 size={14} aria-hidden="true" /> <span className={styles.animatedText}>ATLAS INDEX</span></span>
            <span className={`${styles.indexStatus} ${styles.animatedText}`}>CATALOG / LIVE</span>
          </div>
          <div className={styles.indexArt} aria-hidden="true">
            {Array.from({ length: 24 }, (_, index) => (
              <span key={index} data-tone={index % 7 === 0 ? "red" : index % 4 === 0 ? "violet" : "quiet"} />
            ))}
            <div className={`${styles.artLabel} ${styles.animatedText}`}>IDEAS<br />IN MOTION</div>
          </div>
          <dl className={styles.stats}>
            <div><dt className={styles.animatedText}>STUDIES</dt><dd><CounterTicker value={catalogEntries.length} /></dd></div>
            <div><dt className={styles.animatedText}>DOMAINS</dt><dd><CounterTicker value={categoryDefinitions.length} /></dd></div>
            <div><dt className={styles.animatedText}>BACKGROUNDS</dt><dd><CounterTicker value={backgroundCount} /></dd></div>
            <div><dt className={styles.animatedText}>NO EXTERNAL DEPS</dt><dd><CounterTicker value={dependencyFreeCount} /></dd></div>
          </dl>
          <div className={styles.indexFoot}><span className={styles.animatedText}>LOCAL CATALOG</span><span className={styles.animatedText}>STATIC PREVIEW REGISTRY</span></div>
        </aside>
      </ScrollReveal>

      <ScrollReveal as="section" className={styles.workflow} aria-labelledby="workflow-title">
        <div className={styles.sectionHeading}>
          <div>
            <p className={`${styles.eyebrow} ${styles.animatedText}`}>FROM REFERENCE TO REAL UI</p>
            <h2 id="workflow-title" className={styles.animatedText}><WaveRippleHeading text="A practical creative workflow" periodChar="." /></h2>
          </div>
          <p className={styles.animatedText}>Move from a visual spark to an informed starting point without losing the details along the way.</p>
        </div>
        <div className={styles.stepGrid}>
          {workflow.map(({ number, icon: Icon, title, description, footnote }, index) => (
            <ScrollReveal key={number} delay={index * 90} className={`${styles.cardReveal} ${styles.workflowCardReveal}`}>
              <article className={styles.stepCard}>
                <div className={styles.stepTop}><span className={`${styles.animatedText} ${styles.stepLabel}`}>{number} / 03</span><Icon size={18} aria-hidden="true" /></div>
                <h3 className={`${styles.animatedText} ${styles.stepTitle}`}><HoverScrambleTitle text={title} /></h3>
                <p className={`${styles.animatedText} ${styles.stepCopy}`}>{description}</p>
                <span className={`${styles.stepFoot} ${styles.animatedText}`}>{footnote}</span>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className={styles.detailsSection} aria-labelledby="details-title">
        <div className={styles.sectionHeading}>
          <div>
            <p className={`${styles.eyebrow} ${styles.animatedText}`}>MORE THAN A SCREENSHOT</p>
            <h2 id="details-title" className={styles.animatedText}><WaveRippleHeading text="Everything you need to evaluate an idea" periodChar="." /></h2>
          </div>
          <p className={styles.animatedText}>Each study brings its working preview together with the implementation and context needed to make a considered choice.</p>
        </div>
        <div className={styles.detailGrid}>
          {studyDetails.map(({ icon: Icon, label, title, description }, index) => (
            <ScrollReveal key={label} delay={index * 65} className={`${styles.cardReveal} ${styles.detailCardReveal}`}>
              <article className={styles.detailCard}>
                <span className={styles.detailIcon}><Icon size={18} aria-hidden="true" /></span>
                <p className={`${styles.detailLabel} ${styles.animatedText}`}>{label}</p>
                <h3 className={`${styles.animatedText} ${styles.detailTitle}`}><HoverScrambleTitle text={title} /></h3>
                <p className={`${styles.detailDescription} ${styles.animatedText}`}>{description}</p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className={styles.categorySection} aria-labelledby="category-title">
        <div className={styles.sectionHeading}>
          <div>
            <p className={`${styles.eyebrow} ${styles.animatedText}`}>A WIDE FIELD OF IDEAS</p>
            <h2 id="category-title" className={styles.animatedText}><WaveRippleHeading text="Explore by design territory" periodChar="." /></h2>
          </div>
          <Link className={`${styles.textLink} ${styles.animatedText}`} href="/library">Browse all {categoryDefinitions.length} domains <ArrowUpRight size={15} aria-hidden="true" /></Link>
        </div>
        <div className={styles.categoryGrid}>
          {spotlightCategories.map((category, index) => (
            <ScrollReveal key={category.slug} delay={index * 60} className={`${styles.cardReveal} ${styles.categoryCardReveal}`}>
              <Link className={styles.categoryCard} href={`/library/${category.slug}`}>
                <span className={`${styles.categoryCount} ${styles.animatedText}`}>{String(category.count).padStart(2, "0")} STUDIES</span>
                <h3 className={`${styles.animatedText} ${styles.categoryTitle}`}><HoverScrambleTitle text={category.title} /></h3>
                <p className={`${styles.animatedText} ${styles.categoryDescription}`}>{category.description}</p>
                <span className={styles.categoryArrow} aria-hidden="true"><ArrowUpRight size={17} /></span>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className={styles.principlesSection} aria-labelledby="principles-title">
        <div className={styles.principlesIntro}>
          <p className={`${styles.eyebrow} ${styles.animatedText}`}>THOUGHTFUL DEFAULTS</p>
          <h2 id="principles-title" className={styles.animatedText}><WaveRippleHeading text="Designed for clarity and control" periodChar="." /></h2>
          <p className={styles.animatedText}>UI Atlas is built as a reference tool you can inspect, trust, and take back to your own workspace.</p>
        </div>
        <div className={styles.principlesGrid}>
          {principles.map(({ icon: Icon, title, description }, index) => (
            <ScrollReveal key={title} delay={index * 75} className={`${styles.cardReveal} ${styles.principleCardReveal}`}>
              <article className={styles.principleCard}>
                <span className={styles.principleIcon}><Icon size={18} aria-hidden="true" /></span>
                <h3 className={`${styles.animatedText} ${styles.principleTitle}`}><HoverScrambleTitle text={title} /></h3>
                <p className={`${styles.animatedText} ${styles.principleCopy}`}>{description}</p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className={styles.closingCta} aria-labelledby="about-cta-title">
        <div>
          <p className={`${styles.eyebrow} ${styles.animatedText}`}>YOUR NEXT REFERENCE IS ONE SEARCH AWAY</p>
          <h2 id="about-cta-title" className={styles.animatedText}><WaveRippleHeading text="Start with an idea" periodChar="." /></h2>
          <p className={styles.animatedText}>Explore the catalog, save what matters, and build from a pattern you understand.</p>
        </div>
        <div className={styles.closingActions}>
          <Link className={styles.primaryAction} href="/library">Open the library <ArrowUpRight size={16} aria-hidden="true" /></Link>
          <Link className={styles.secondaryAction} href="/collections"><Bookmark size={15} aria-hidden="true" /> View Collections</Link>
        </div>
      </ScrollReveal>
    </div>
  );
}

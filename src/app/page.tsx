import Link from "next/link";
import {
  ArrowUpRight,
  Search,
  Sparkles,
  Activity,
  Zap,
  PanelsTopLeft,
  Compass,
  Layers,
  MousePointer2,
  Type,
  MoveDown,
  ClipboardList,
  BellRing,
  Images,
  Milestone,
  BadgeDollarSign,
  Quote,
  ChartNoAxesCombined,
  AppWindow,
  type LucideIcon,
} from "lucide-react";
import { catalogEntries } from "@/features/catalog/data/catalog";
import { categoryDefinitions } from "@/features/catalog/data/categories";
import { HomeLivePreview } from "./home-live-preview";
import { HeroCyberBackground } from "./hero-cyber-background";
import {
  DecryptedText,
  GlitchText,
  GlitchAuroraText,
  ShimmerText,
  CounterTicker,
  WaveRippleHeading,
  HoverScrambleTitle,
} from "./kinetic-text-effects";
import {
  SpotlightCard,
  TiltCard,
  BorderBeamCard,
  GlitchCard,
} from "./interactive-cards";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { HomeSearchShortcut } from "./home-search-shortcut";
import styles from "./home.module.css";

type CatalogEntry = (typeof catalogEntries)[number];
type RecentlyAddedEntry = CatalogEntry & { addedAt: string };

function hasAddedAt(entry: CatalogEntry): entry is RecentlyAddedEntry {
  return "addedAt" in entry && typeof entry.addedAt === "string";
}

const categoryIcons: Record<string, LucideIcon> = {
  "hero-sections": PanelsTopLeft,
  navigation: Compass,
  cards: Layers,
  buttons: MousePointer2,
  "text-effects": Type,
  backgrounds: Sparkles,
  "scroll-animations": MoveDown,
  forms: ClipboardList,
  feedback: BellRing,
  galleries: Images,
  animations: Activity,
  timelines: Milestone,
  pricing: BadgeDollarSign,
  testimonials: Quote,
  dashboards: ChartNoAxesCombined,
  "complete-layouts": AppWindow,
};

export default function HomePage() {
  const totalStudies = catalogEntries.length;
  const backgroundCount = catalogEntries.filter((e) => e.category === "backgrounds").length;
  const categoryCount = categoryDefinitions.length;

  // Flagship specimens organized in 2 distinct rows matching React Bits presentation
  const showcaseTopSpecimens = [
    {
      slug: "dot-grid-motion",
      title: "Micro Slats",
      categoryLabel: "Backgrounds",
      effect: "borderBeam" as const,
    },
    {
      slug: "plasma-border-outline",
      title: "Electric Logo",
      categoryLabel: "Animations",
      effect: "tilt" as const,
    },
  ];

  const showcaseBottomSpecimens = [
    {
      slug: "cyber-glitch-slice",
      title: "Tech Text",
      categoryLabel: "Text Animations",
      effect: "glitch" as const,
    },
    {
      slug: "perspective-ring-gallery",
      title: "Circular Carousel",
      categoryLabel: "Components",
      effect: "borderBeam" as const,
    },
    {
      slug: "magnetic-action-button",
      title: "Hold Button",
      categoryLabel: "Micro",
      effect: "spotlight" as const,
    },
  ];

  // Marquee running items
  const marqueeItems = [
    "PERSPECTIVE 3D RINGS",
    "HOLOGRAPHIC GLARE FOIL",
    "CYBER GLITCH MATRIX",
    "QUANTUM SHADER CANVASES",
    "SPRING DOCKS & MENUS",
    "CAUSTICS WAVE SURFACES",
    "ASCII MATRIX TRANSFORMS",
    "RADIAL SPARK BURSTS",
    "LIGHT RAYS & BEAMS",
    "BENTO DATA MATRICES",
  ];

  const categoryCounts = catalogEntries.reduce<Map<string, number>>((counts, entry) => {
    counts.set(entry.category, (counts.get(entry.category) ?? 0) + 1);
    return counts;
  }, new Map());
  const datedCatalogEntries = catalogEntries.filter(hasAddedAt);
  const latestAddedAt = datedCatalogEntries.reduce(
    (latest, entry) => (entry.addedAt > latest ? entry.addedAt : latest),
    "",
  );
  const latestBatch = datedCatalogEntries.filter((entry) => entry.addedAt === latestAddedAt);
  const recentlyAddedEntries = latestBatch.slice(-4).reverse();
  const domainRows = [categoryDefinitions.slice(0, 8), categoryDefinitions.slice(8)];

  return (
    <div className={styles.page}>
      {/* 1. HERO SECTION: KINETIC CYBER-EDITORIAL PLAYGROUND */}
      <section className={styles.hero} aria-labelledby="home-title">
        <HeroCyberBackground />

        {/* Top Cyber Telemetry & Equalizer Badge */}
        <div className={styles.heroEyebrow}>
          <div className={styles.equalizer} aria-hidden="true">
            <span className={styles.eqBar} />
            <span className={styles.eqBar} />
            <span className={styles.eqBar} />
            <span className={styles.eqBar} />
            <span className={styles.eqBar} />
          </div>
          <DecryptedText
            text="CREATIVE DEVELOPER PLATFORM"
            className={styles.heroStatusText}
            glow="none"
          />
          <span className={styles.specimenCountBadge}>
            <CounterTicker value={totalStudies} suffix=" SPECIMENS" />
          </span>
        </div>

        {/* Oversized High-Impact Typography with Staggered 3D Rise and Glitch Aurora */}
        <h1 id="home-title" className={styles.heroTitle}>
          <GlitchText text="STOP BUILDING" /> <br />
          <GlitchAuroraText text="BORING INTERFACES" className={styles.heroGradientTitle} />
          <span className={styles.periodRed}>.</span>
        </h1>

        <p className={styles.heroDesc}>
          <ShimmerText speed="slow" theme="silver">
            A curated library of interface ideas with live previews, copyable React code, and AI-ready prompts to help you rebuild each component.
          </ShimmerText>
        </p>

        {/* Search the catalog directly from the landing page. */}
        <div className={styles.searchContainer}>
          <form action="/library" className={styles.searchHub} role="search">
            <Search size={18} className={styles.searchIcon} aria-hidden="true" />
            <label className="sr-only" htmlFor="home-search">
              Search components, shaders, and interaction effects
            </label>
            <input
              id="home-search"
              type="search"
              name="q"
              placeholder="Search components, styles, or tags..."
              className={styles.searchInput}
            />
            <HomeSearchShortcut className={styles.searchShortcutBadge} />
            <button type="submit" className={styles.searchSubmitBtn} aria-label="Search library">
              <Search size={16} aria-hidden="true" />
            </button>
          </form>
        </div>

        {/* Primary Action Buttons */}
        <div className={styles.heroActions}>
          <Link href="/library" className={styles.primaryCta}>
            <Zap size={16} aria-hidden="true" />
            <span>Explore All {totalStudies} Components</span>
          </Link>
          <Link href="/library/animations" className={styles.secondaryCta}>
            <Activity size={16} aria-hidden="true" />
            <span>Browse Motion Components</span>
          </Link>
          <Link href="/backgrounds" className={styles.ghostCta}>
            <Sparkles size={16} aria-hidden="true" />
            <span>Background Studio ({backgroundCount})</span>
          </Link>
        </div>

        {/* Compatibility link for legacy automated checks */}
        <div className={styles.browseAllWrapper}>
          <Link href="/library" className={styles.browseAllLink}>
            Browse all entries ({totalStudies})
          </Link>
        </div>

        {/* Technical HUD Telemetry Ribbon with Mechanical Roll Counters */}
        <div className={styles.hudRow}>
          <div className={styles.hudItem}>
            <span className={styles.hudLabel}>SPECIMENS</span>
            <span className={styles.hudValue}>
              <CounterTicker value={totalStudies} suffix=" VERIFIED" />
            </span>
          </div>
          <div className={styles.hudItem}>
            <span className={styles.hudLabel}>CANVASES</span>
            <span className={styles.hudValue}>
              <CounterTicker value={backgroundCount} suffix=" SHADERS" />
            </span>
          </div>
          <div className={styles.hudItem}>
            <span className={styles.hudLabel}>TAXONOMY</span>
            <span className={styles.hudValue}>
              <CounterTicker value={categoryCount} suffix=" DOMAINS" />
            </span>
          </div>
          <div className={styles.hudItem}>
            <span className={styles.hudLabel}>DEPENDENCIES</span>
            <span className={styles.hudValue}>0 BLOAT</span>
          </div>
        </div>
      </section>

      {/* 2. INFINITE KINETIC MARQUEE STRIP */}
      <div className={styles.marqueeContainer} aria-hidden="true">
        <div className={styles.marqueeTrack}>
          {marqueeItems.concat(marqueeItems).map((text, idx) => (
            <div key={`${text}-${idx}`} className={styles.marqueeItem}>
              <span className={styles.marqueeSpark}>✦</span>
              <span className={styles.marqueeText}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. SHOWCASE SECTION ("See them in action") */}
      <section className={styles.showcaseSection} aria-labelledby="showcase-title">
        <ScrollReveal className={styles.showcaseSectionHeader}>
          <h2 id="showcase-title" className={styles.showcaseSectionTitle}>
            See them in action
          </h2>
        </ScrollReveal>

        {/* Row 1: 2 large flagship cards */}
        <div className={styles.showcaseRowTop}>
          {showcaseTopSpecimens.map((item) => {
            const cardInner = (
              <>
                <div className={styles.bentoPreviewStage}>
                  <HomeLivePreview previewKey={item.slug} title={item.title} />
                </div>
                <div className={styles.showcaseCaption}>
                  <Link href={`/item/${item.slug}`} className={styles.showcaseItemTitle}>
                    <HoverScrambleTitle text={item.title} />
                  </Link>
                  <Link href={`/item/${item.slug}`} className={styles.showcaseCategoryLink}>
                    <span>{item.categoryLabel}</span>
                    <span className={styles.categoryArrow} aria-hidden="true">↗</span>
                  </Link>
                </div>
              </>
            );

            let cardElement: React.ReactNode;
            if (item.effect === "borderBeam") {
              cardElement = (
                <BorderBeamCard key={item.slug} className={styles.showcaseCard}>
                  {cardInner}
                </BorderBeamCard>
              );
            } else {
              cardElement = (
                <TiltCard key={item.slug} className={styles.showcaseCard}>
                  {cardInner}
                </TiltCard>
              );
            }

            return (
              <ScrollReveal key={item.slug} className={styles.showcaseCardReveal}>
                {cardElement}
              </ScrollReveal>
            );
          })}
        </div>

        {/* Row 2: 3 kinetic cards */}
        <div className={styles.showcaseRowBottom}>
          {showcaseBottomSpecimens.map((item, idx) => {
            const cardInner = (
              <>
                <div className={styles.bentoPreviewStage}>
                  <HomeLivePreview previewKey={item.slug} title={item.title} />
                </div>
                <div className={styles.showcaseCaption}>
                  <Link href={`/item/${item.slug}`} className={styles.showcaseItemTitle}>
                    <HoverScrambleTitle text={item.title} />
                  </Link>
                  <Link href={`/item/${item.slug}`} className={styles.showcaseCategoryLink}>
                    <span>{item.categoryLabel}</span>
                    <span className={styles.categoryArrow} aria-hidden="true">↗</span>
                  </Link>
                </div>
              </>
            );

            let cardElement: React.ReactNode;
            if (item.effect === "borderBeam") {
              cardElement = (
                <BorderBeamCard key={item.slug} className={styles.showcaseCard}>
                  {cardInner}
                </BorderBeamCard>
              );
            } else if (item.effect === "glitch") {
              cardElement = (
                <GlitchCard key={item.slug} className={styles.showcaseCard}>
                  {cardInner}
                </GlitchCard>
              );
            } else {
              cardElement = (
                <SpotlightCard key={item.slug} className={styles.showcaseCard}>
                  {cardInner}
                </SpotlightCard>
              );
            }

            return (
              <ScrollReveal key={item.slug} delay={idx * 60} className={styles.showcaseCardReveal}>
                {cardElement}
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* 4. RECENTLY ADDED COMPONENTS */}
      {recentlyAddedEntries.length > 0 && (
        <section className={styles.recentSection} aria-labelledby="recent-title">
          <div className={styles.recentIntro}>
            <h2 id="recent-title" className={styles.recentTitle}>
              <GlitchAuroraText text="Recently added" />
            </h2>
            <p className={styles.recentDescription}>
              <ShimmerText speed="slow" theme="silver">
                The latest additions bring new ways to shape motion, controls, and interface surfaces.
              </ShimmerText>
            </p>
          </div>

          <div className={styles.recentGrid} aria-label="Recently added components">
            {recentlyAddedEntries.map((entry, index) => (
              <ScrollReveal key={entry.id} delay={index * 70} className={styles.recentCardReveal}>
                <article className={styles.recentCard}>
                  <div className={styles.recentCardMeta}>
                    <span className={styles.recentOrdinal}>DROP / {String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <div className={`${styles.bentoPreviewStage} ${styles.recentPreviewStage}`}>
                    <HomeLivePreview previewKey={entry.previewKey} title={entry.title} />
                    <span className={styles.recentPreviewCorner} aria-hidden="true" />
                  </div>
                  <div className={styles.recentCardContent}>
                    <div className={styles.recentCategoryRow}>
                      <span>{categoryDefinitions.find((category) => category.slug === entry.category)?.title ?? entry.category}</span>
                      <span>{entry.license === "MIT License" ? "MIT / REACT BITS" : "ORIGINAL STUDY"}</span>
                    </div>
                    <h3>
                      <Link href={`/item/${entry.slug}`}>
                        <HoverScrambleTitle text={entry.title} />
                      </Link>
                    </h3>
                    <p>
                      <ShimmerText speed="slow" theme="silver">
                        {entry.description}
                      </ShimmerText>
                    </p>
                    <Link href={`/item/${entry.slug}`} className={styles.recentInspectLink}>
                      Inspect study <ArrowUpRight size={14} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {/* 5. CATEGORY EXPLORATION: 16-CATEGORY TAXONOMY MATRIX */}
      <section className={styles.categorySection} aria-labelledby="category-title">
        <ScrollReveal className={styles.sectionHeader}>
          <div>
            <h2 id="category-title" className={styles.sectionTitle}>
              <WaveRippleHeading text="16 Precision Domains" periodChar="." periodColor="indigo" />
            </h2>
            <p className={styles.sectionSubtitle}>
              <ShimmerText speed="slow" theme="silver">
                Every component classified strictly by its core interactive function. Discover backgrounds, text FX, navigation, dashboards, and spatial widgets.
              </ShimmerText>
            </p>
          </div>
          <Link href="/library" className={styles.headerExploreLink}>
            <span>Browse Library Index</span>
          </Link>
        </ScrollReveal>

        <div className={styles.domainLanes}>
          {domainRows.map((row, rowIndex) => (
            <div
              className={styles.domainLane}
              data-direction={rowIndex === 0 ? "left" : "right"}
              key={`domain-lane-${rowIndex}`}
            >
              <div className={styles.domainTrackViewport}>
                <div className={styles.domainTrack}>
                  {[false, true].map((isClone) => (
                    <div
                      className={styles.domainTrackGroup}
                      key={isClone ? "duplicate" : "original"}
                      role="list"
                      aria-label={isClone ? undefined : `Precision domains row ${rowIndex + 1}`}
                      aria-hidden={isClone ? "true" : undefined}
                    >
                      {row.map((cat, cardIndex) => {
                        const categoryIndex = rowIndex * row.length + cardIndex;
                        const DomainIcon = categoryIcons[cat.slug] ?? PanelsTopLeft;
                        const count = categoryCounts.get(cat.slug) ?? 0;

                        return (
                          <Link
                            key={cat.slug}
                            href={`/library/${cat.slug}`}
                            className={styles.domainCard}
                            data-tone={categoryIndex % 2 === 0 ? "indigo" : "red"}
                            data-shape={categoryIndex % 2 === 0 ? "a" : "b"}
                            tabIndex={isClone ? -1 : undefined}
                            role="listitem"
                          >
                            <span className={styles.domainCardTop}>
                              <span className={styles.domainIcon}>
                                <DomainIcon size={16} strokeWidth={1.8} aria-hidden="true" />
                              </span>
                              <span className={styles.domainCount}>
                                <span className={styles.domainCountNumber}>
                                  {count.toString().padStart(2, "0")}
                                </span>
                                <span>specimens</span>
                              </span>
                            </span>
                            <span className={styles.domainTitle}>{cat.title}</span>
                            <span className={styles.domainDescription}>{cat.description}</span>
                          </Link>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. BACKGROUND STUDIO PROMOTION: WIDE IMMERSIVE CINEMA */}
      <ScrollReveal as="section" className={styles.studioPromoSection} aria-labelledby="studio-promo-title">
        <div className={styles.studioPromoStage}>
          {/* Real live background shader */}
          <div className={styles.studioBackgroundMount} aria-hidden="true">
            <HomeLivePreview previewKey="threads-field" title="Threads Field" />
          </div>

          <div className={styles.studioPromoContent}>
            <h2 id="studio-promo-title" className={styles.studioPromoTitle}>
              <GlitchText text="MAKE THE BACKGROUND" /> <br />
              <GlitchAuroraText text="THE EXPERIENCE" className={styles.highlightRed} />
              <span className={styles.periodRed}>.</span>
            </h2>
            <p className={styles.studioPromoDesc}>
              <ShimmerText speed="slow" theme="silver">
                {backgroundCount} dedicated generative shaders and canvas physics with realtime controls for speed, density, and chromatic refraction. Drop directly into hero sections and interactive backdrops.
              </ShimmerText>
            </p>

            <div className={styles.studioFilterTags}>
              <span className={styles.studioTag}>Caustics &amp; Waves</span>
              <span className={styles.studioTag}>Lightning &amp; Energy</span>
              <span className={styles.studioTag}>Quantum Particles</span>
              <span className={styles.studioTag}>CRT &amp; Phosphor</span>
              <span className={styles.studioTag}>Prismatic Refraction</span>
            </div>

            <div className={styles.studioPromoActions}>
              <Link href="/backgrounds" className={styles.primaryCta}>
                <span>Launch Background Studio</span>
              </Link>
              <div className={styles.studioSpecs}>
                <span>{backgroundCount} PROCEDURAL SPECIMENS</span>
                <span>·</span>
                <span>0 DEPENDENCIES</span>
                <span>·</span>
                <span>INTERSECTION PAUSE</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 7. HOW UI ATLAS WORKS: REBUILD PIPELINE */}
      <section className={styles.workflowSection} aria-labelledby="workflow-title">
        <ScrollReveal className={styles.sectionHeader}>
          <div>
            <h2 id="workflow-title" className={styles.sectionTitle}>
              <WaveRippleHeading text="How UI Atlas Works" periodChar="." periodColor="red" />
            </h2>
            <p className={styles.sectionSubtitle}>
              <ShimmerText speed="slow" theme="silver">
                Engineered to make exploring, testing, and adapting creative interface ideas effortless.
              </ShimmerText>
            </p>
          </div>
        </ScrollReveal>

        <div className={styles.workflowGrid}>
          <ScrollReveal className={styles.workflowStackItem} delay={0}>
            <article className={styles.workflowCard}>
              <div className={styles.workflowBackground} aria-hidden="true">
                <HomeLivePreview previewKey="prism-chromatic-burst" title="Prism Chromatic Burst" />
              </div>
              <div className={styles.workflowWell}>
                <div className={styles.workflowCopy}>
                  <div className={styles.stepTag}>01 / DISCOVER</div>
                  <h3 className={styles.stepTitle}>
                    <HoverScrambleTitle text="Find the right pattern" />
                  </h3>
                  <p className={styles.stepDesc}>
                    Search the Atlas by category, visual style, behavior, or tag. Save useful patterns to a local collection as you browse.
                  </p>
                </div>
                <TiltCard
                  className={styles.workflowDetails}
                  containerClassName={styles.workflowDetailsTilt}
                  maxTilt={5}
                >
                  <div className={styles.workflowDetailsContent} role="group" aria-label="Catalog snapshot">
                    <h4 className={styles.workflowDetailsTitle}>
                      <HoverScrambleTitle text="The library at a glance" />
                    </h4>
                    <dl className={styles.workflowStats}>
                      <div><dt>Components</dt><dd><CounterTicker value={totalStudies} /></dd></div>
                      <div><dt>Backgrounds</dt><dd><CounterTicker value={backgroundCount} /></dd></div>
                      <div><dt>Categories</dt><dd><CounterTicker value={categoryCount} /></dd></div>
                    </dl>
                    <p className={styles.workflowDetailNote}>
                      <ShimmerText speed="slow" theme="silver">
                        Filter by purpose, style, interaction, and responsive behavior.
                      </ShimmerText>
                    </p>
                  </div>
                </TiltCard>
              </div>
            </article>
          </ScrollReveal>

          <ScrollReveal className={styles.workflowStackItem} delay={90}>
            <article className={styles.workflowCard}>
              <div className={styles.workflowBackground} aria-hidden="true">
                <HomeLivePreview previewKey="caustics-ripple-grid" title="Caustics Ripple Grid" />
              </div>
              <div className={styles.workflowWell}>
                <div className={styles.workflowCopy}>
                  <div className={styles.stepTag}>02 / INSPECT</div>
                  <h3 className={styles.stepTitle}>
                    <HoverScrambleTitle text="Try it before you build" />
                  </h3>
                  <p className={styles.stepDesc}>
                    Open a live specimen, resize its preview, and try available controls. Check the behavior and layout before you commit to a pattern.
                  </p>
                </div>
                <TiltCard
                  className={styles.workflowDetails}
                  containerClassName={styles.workflowDetailsTilt}
                  maxTilt={5}
                >
                  <div className={styles.workflowDetailsContent} role="group" aria-label="Preview tools">
                    <h4 className={styles.workflowDetailsTitle}>
                      <HoverScrambleTitle text="Inside each specimen" />
                    </h4>
                    <ul className={styles.workflowDetailList}>
                      <li><span>01</span> Live component preview</li>
                      <li><span>02</span> Responsive viewport presets</li>
                      <li><span>03</span> Interactive controls where available</li>
                    </ul>
                    <p className={styles.workflowDetailNote}>
                      <ShimmerText speed="slow" theme="silver">
                        Explore the details before copying the implementation.
                      </ShimmerText>
                    </p>
                  </div>
                </TiltCard>
              </div>
            </article>
          </ScrollReveal>

          <ScrollReveal className={styles.workflowStackItem} delay={180}>
            <article className={styles.workflowCard}>
              <div className={styles.workflowBackground} aria-hidden="true">
                <HomeLivePreview previewKey="silk-wave-fabric" title="Silk Wave Fabric" />
              </div>
              <div className={styles.workflowWell}>
                <div className={styles.workflowCopy}>
                  <div className={styles.stepTag}>03 / REBUILD</div>
                  <h3 className={styles.stepTitle}>
                    <HoverScrambleTitle text="Make it yours" />
                  </h3>
                  <p className={styles.stepDesc}>
                    Read the typed React source, colocated CSS Module, dependency notes, and reuse terms. Copy the pieces you need and adapt them to your project.
                  </p>
                </div>
                <TiltCard
                  className={styles.workflowDetails}
                  containerClassName={styles.workflowDetailsTilt}
                  maxTilt={5}
                >
                  <div className={styles.workflowDetailsContent} role="group" aria-label="Source handoff">
                    <h4 className={styles.workflowDetailsTitle}>
                      <HoverScrambleTitle text="Ready for your codebase" />
                    </h4>
                    <ul className={styles.workflowDetailList}>
                      <li><span>TSX</span> React component source</li>
                      <li><span>CSS</span> Scoped module styles</li>
                      <li><span>INFO</span> License and attribution notes</li>
                    </ul>
                    <p className={styles.workflowDetailNote}>
                      <ShimmerText speed="slow" theme="silver">
                        Inspect first, then copy and customize.
                      </ShimmerText>
                    </p>
                  </div>
                </TiltCard>
              </div>
            </article>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

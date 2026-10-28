"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import type { ComponentType } from "react";
import {
  Search,
  Sliders,
  Code2,
  Maximize2,
  Minimize2,
  ExternalLink,
  Layers,
  Cpu,
  MousePointer,
  RotateCcw,
} from "lucide-react";
import type { CatalogItem } from "@/features/catalog/types";
import { clientPreviewComponents } from "@/registry/client-previews";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { HoverScrambleTitle, ShimmerText, WaveRippleHeading } from "@/app/kinetic-text-effects";
import styles from "./backgrounds.module.css";

function LazySpecimenPreview({
  preview: Preview,
  isInitial,
}: {
  preview: ComponentType;
  isInitial: boolean;
}) {
  const [isVisible, setIsVisible] = useState(isInitial);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(Boolean(entry?.isIntersecting));
      },
      { rootMargin: "150px" }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", position: "relative" }}>
      {isVisible ? (
        <Preview />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--surface-subtle, #14171d)",
            color: "var(--muted, #64748b)",
            fontSize: "0.75rem",
            fontFamily: "var(--font-ui-mono, monospace)",
          }}
        >
          <span>STANDBY</span>
        </div>
      )}
    </div>
  );
}

const STYLE_FILTERS = [
  { id: "all", label: "All Backgrounds" },
  { id: "fluid", label: "Fluid & Waves", tags: ["waves", "fluid", "ribbons", "contour", "silk", "caustics", "iridescent", "fabric"] },
  { id: "particles", label: "Particles & Physics", tags: ["particles", "constellation", "physics", "snow", "cellular", "prismatic", "refraction"] },
  { id: "grid", label: "Geometry & Grids", tags: ["grid", "dots", "matrix", "pixel", "warp", "distortion", "elastic", "cartesian"] },
  { id: "retro", label: "Retro & Glitch", tags: ["glitch", "dither", "retro", "terminal", "1-bit", "crt", "phosphor", "8bit", "arcade"] },
  { id: "light", label: "Light & Beams", tags: ["beams", "light", "ambient", "orb", "aurora", "hyperspeed", "tunnel", "lightning", "energy", "plasma"] },
];

export function BackgroundStudioClient({ entries }: { entries: CatalogItem[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeStageSlug, setActiveStageSlug] = useState<string>(
    entries[0]?.slug ?? "threads-field"
  );
  const [isFullscreenStage, setIsFullscreenStage] = useState(false);

  // Filtered background list
  const filteredEntries = useMemo(() => {
    return entries.filter((item) => {
      // Search text match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.style.toLowerCase().includes(query) ||
        item.tags.some((t) => t.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      // Category filter match
      if (activeFilter === "all") return true;

      const currentFilter = STYLE_FILTERS.find((f) => f.id === activeFilter);
      if (!currentFilter?.tags) return true;

      return item.tags.some((tag) => currentFilter.tags.includes(tag.toLowerCase()));
    });
  }, [entries, searchQuery, activeFilter]);

  const activeStageItem = useMemo(() => {
    return entries.find((e) => e.slug === activeStageSlug) ?? entries[0];
  }, [entries, activeStageSlug]);

  const ActiveStagePreview = activeStageItem
    ? clientPreviewComponents[activeStageItem.previewKey]
    : null;

  return (
    <div className={styles.studioRoot}>
      {/* Studio Header */}
      <ScrollReveal as="header" className={styles.studioHeader}>
        <div className={styles.headerTitleWrap}>
          <div className={styles.tagline}>
            <span className={styles.pulseDot} />
            <span>STUDIO // ATMOSPHERIC LAB</span>
            <span className={styles.separator}>/</span>
            <span className={styles.countBadge}>
              {entries.length} BACKGROUND SPECIMENS
            </span>
          </div>
          <h1 className={styles.studioTitle}><WaveRippleHeading text="Background Studio" periodChar="" /></h1>
          <p className={styles.studioDescription}>
            <ShimmerText speed="slow" theme="silver">
              Explore, preview, calibrate, and export high-performance procedural WebGL2 shaders,
              dynamic particle physics, and responsive kinetic surfaces for modern interfaces.
            </ShimmerText>
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search size={16} className={styles.searchIcon} aria-hidden="true" />
            <input
              type="search"
              placeholder="Filter by shader name, effect, physics, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              aria-label="Filter background specimens"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className={styles.clearSearchBtn}
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
          </div>

          <div className={styles.filterPills} role="tablist" aria-label="Style filters">
            {STYLE_FILTERS.map((f) => (
              <button
                key={f.id}
                role="tab"
                aria-selected={activeFilter === f.id}
                onClick={() => setActiveFilter(f.id)}
                className={styles.filterPill}
                data-active={activeFilter === f.id}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Main Interactive Stage */}
      {activeStageItem && ActiveStagePreview && (
        <section
          className={`${styles.stageSection} ${
            isFullscreenStage ? styles.stageFullscreen : ""
          }`}
          aria-label="Active background inspection stage"
        >
          <div className={styles.stageHeader}>
            <div className={styles.stageMeta}>
              <span className={styles.stageEyebrow}>ACTIVE STAGE // {activeStageItem.id.toUpperCase()}</span>
              <h2 className={styles.stageHeading}><HoverScrambleTitle text={activeStageItem.title} /></h2>
              <div className={styles.stageBadges}>
                <span className={styles.specimenBadge}>
                  <Cpu size={12} aria-hidden="true" />
                  {activeStageItem.tags.includes("webgl2") ? "WebGL2 Shader" : "2D Canvas Engine"}
                </span>
                <span className={styles.specimenBadge}>
                  <MousePointer size={12} aria-hidden="true" />
                  Cursor Reactive
                </span>
                <span className={styles.specimenBadge}>
                  <Layers size={12} aria-hidden="true" />
                  {activeStageItem.style}
                </span>
              </div>
            </div>

            <div className={styles.stageActions}>
              <Link
                href={`/item/${activeStageItem.slug}`}
                className={styles.inspectCodeBtn}
                title="Open complete source code and implementation notes"
              >
                <Code2 size={15} aria-hidden="true" />
                <span>Source Code</span>
                <ExternalLink size={12} aria-hidden="true" />
              </Link>

              <button
                type="button"
                className={styles.stageControlBtn}
                onClick={() => setIsFullscreenStage((prev) => !prev)}
                aria-label={isFullscreenStage ? "Exit expanded stage" : "Expand stage"}
                title={isFullscreenStage ? "Collapse stage" : "Expand stage"}
              >
                {isFullscreenStage ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            </div>
          </div>

          <div className={styles.stageCanvasWrap}>
            <ActiveStagePreview />
          </div>

          <div className={styles.stageFooter}>
            <p className={styles.stageDesc}>
              <ShimmerText speed="slow" theme="silver">{activeStageItem.description}</ShimmerText>
            </p>
            <span className={styles.stageLicense}>
              {activeStageItem.attribution} · {activeStageItem.license}
            </span>
          </div>
        </section>
      )}

      {/* Grid of Background Cards */}
      <ScrollReveal as="section" className={styles.gallerySection} aria-label="Background specimens gallery">
        <div className={styles.galleryHeader}>
          <h3 className={styles.galleryTitle}>
            <WaveRippleHeading text="Catalog Specimen Gallery" periodChar="" />
            <span className={styles.galleryCount}>({filteredEntries.length} items)</span>
          </h3>
          <span className={styles.galleryHint}>
            Select any card to mount into the interactive inspection stage
          </span>
        </div>

        {filteredEntries.length === 0 ? (
          <div className={styles.emptyState}>
            <Sliders size={32} className={styles.emptyIcon} />
            <p className={styles.emptyTitle}>No matching backgrounds found</p>
            <p className={styles.emptyText}>
              Try adjusting your query or resetting the style filter to view all available shaders.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("all");
              }}
              className={styles.resetBtn}
            >
              <RotateCcw size={14} /> Reset Filters
            </button>
          </div>
        ) : (
          <div className={styles.cardGrid}>
            {filteredEntries.map((item, index) => {
              const PreviewComponent = clientPreviewComponents[item.previewKey];
              const isSelected = activeStageSlug === item.slug;

              return (
                <ScrollReveal key={item.id} delay={(index % 6) * 40} className={styles.cardReveal}>
                  <article
                    className={styles.card}
                    data-selected={isSelected}
                    onClick={() => setActiveStageSlug(item.slug)}
                  >
                    <div className={styles.previewBox}>
                      {PreviewComponent ? (
                        <div className={styles.previewInner}>
                          <LazySpecimenPreview preview={PreviewComponent} isInitial={index < 4} />
                        </div>
                      ) : (
                        <div className={styles.previewFallback}>Preview unavailable</div>
                      )}

                      <div className={styles.previewOverlay}>
                        <span className={styles.overlayPrompt}>
                          {isSelected ? "Currently in Stage" : "Click to Inspect in Stage"}
                        </span>
                      </div>
                    </div>

                    <div className={styles.cardInfo}>
                      <div className={styles.cardTop}>
                        <span className={styles.styleBadge}>{item.style}</span>
                        <span className={styles.engineBadge}>
                          {item.tags.includes("webgl2") ? "WebGL2" : "Canvas"}
                        </span>
                      </div>

                      <h4 className={styles.cardTitle}><HoverScrambleTitle text={item.title} /></h4>
                      <p className={styles.cardDesc}>{item.description}</p>

                      <div className={styles.cardFooter}>
                        <span className={styles.interactionHint}>
                          <MousePointer size={11} aria-hidden="true" />
                          Hover / Drag
                        </span>

                        <button
                          type="button"
                          className={styles.stageSelectBtn}
                          onClick={(event) => {
                            event.stopPropagation();
                            setActiveStageSlug(item.slug);
                          }}
                          aria-pressed={isSelected}
                          aria-label={`${isSelected ? "Keep" : "Show"} ${item.title} in the inspection stage`}
                        >
                          {isSelected ? "In stage" : "Stage"}
                        </button>

                        <Link
                          href={`/item/${item.slug}`}
                          className={styles.codeLink}
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`View code for ${item.title}`}
                        >
                          <Code2 size={13} aria-hidden="true" />
                          <span>Code</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </ScrollReveal>
    </div>
  );
}

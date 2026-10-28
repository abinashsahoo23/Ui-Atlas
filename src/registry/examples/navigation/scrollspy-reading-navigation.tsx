"use client";

import { useState, useRef } from "react";
import { BookOpen, Hash, ArrowUp } from 'lucide-react';
import styles from "./scrollspy-reading-navigation.module.css";

const SECTIONS = [
  { id: "foundations", title: "Foundations & Tokens", summary: "Design systems thrive on immutable token foundations: spacing scales, high-contrast typography, and surface depth hierarchies." },
  { id: "component-craft", title: "Component Craft", summary: "Every primitive should expose predictable state variants: default, hover, active, focus-visible, and disabled." },
  { id: "motion-physics", title: "Motion Physics", summary: "Purposeful motion communicates spatial relationships. Spring-based damping curves provide tactile responsiveness without jarring transitions." },
  { id: "accessibility", title: "Semantic Accessibility", summary: "True visual excellence begins with semantic HTML, native ARIA roles, visible focus indicators, and reduced-motion fallbacks." },
];

export default function ScrollspyReadingNavigation() {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const scrollTop = el.scrollTop;
    const scrollHeight = el.scrollHeight - el.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    setScrollProgress(progress);

    // Detect active section based on child offsets
    for (let i = SECTIONS.length - 1; i >= 0; i--) {
      const sectionEl = el.querySelector(`#section-${SECTIONS[i].id}`) as HTMLElement | null;
      if (sectionEl && sectionEl.offsetTop - el.offsetTop <= scrollTop + 60) {
        setActiveSection(SECTIONS[i].id);
        break;
      }
    }
  };

  const scrollToSection = (id: string) => {
    const el = scrollContainerRef.current;
    const sectionEl = el?.querySelector(`#section-${id}`) as HTMLElement | null;
    if (el && sectionEl) {
      el.scrollTo({
        top: sectionEl.offsetTop - el.offsetTop,
        behavior: "smooth",
      });
    }
  };

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.container}>
      <header className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <BookOpen size={14} className={styles.bookIcon} aria-hidden="true" />
          <span className={styles.docTitle}>SPECIMEN DOCS / CRAFT MANIFESTO</span>
        </div>
        <div className={styles.progressContainer}>
          <span className={styles.progressLabel}>{Math.round(scrollProgress)}% READ</span>
          <div className={styles.progressBarBg}>
            <div className={styles.progressBarFill} style={{ width: `${scrollProgress}%` }} />
          </div>
        </div>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar} aria-label="Table of contents">
          <p className={styles.sidebarHeading}>ON THIS PAGE</p>
          <nav className={styles.navRail}>
            {SECTIONS.map((sec, idx) => {
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => scrollToSection(sec.id)}
                  className={styles.railLink}
                  data-active={isActive}
                  aria-current={isActive ? "true" : undefined}
                >
                  <span className={styles.railIndex}>{String(idx + 1).padStart(2, "0")}</span>
                  <span className={styles.railTitle}>{sec.title}</span>
                </button>
              );
            })}
          </nav>

          <button type="button" onClick={scrollToTop} className={styles.topBtn} aria-label="Scroll back to top">
            <ArrowUp size={12} aria-hidden="true" />
            <span>Top</span>
          </button>
        </aside>

        <main
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className={styles.contentViewport}
          tabIndex={0}
          aria-label="Document content scroll area"
        >
          {SECTIONS.map((sec) => (
            <section key={sec.id} id={`section-${sec.id}`} className={styles.docSection}>
              <div className={styles.sectionHeader}>
                <Hash size={14} className={styles.hashIcon} aria-hidden="true" />
                <h3>{sec.title}</h3>
              </div>
              <p className={styles.sectionBody}>{sec.summary}</p>
              <div className={styles.sampleCodeBlock}>
                <code>{`// Token specification\nconst ${sec.id.replace(/-/g, "_")} = { status: "active", verified: true };`}</code>
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Sliders, Sparkles } from 'lucide-react';
import styles from "./scroll-reveal-editorial-heading.module.css";

const LINES = [
  "CRAFT IS NOT AN ACCIDENT",
  "IT IS THE RESIDUAL MEMORY",
  "OF A THOUSAND OBSESSIONS",
];

export default function ScrollRevealEditorialHeading() {
  const [stage, setStage] = useState(3); // 0 to 3 lines revealed

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.tag} data-preview-chrome>
          <Sparkles size={13} className={styles.sparkle} aria-hidden="true" />
          <span>EDITORIAL KINETIC REVEAL // VOL. 06</span>
        </div>
        <div className={styles.controls} data-preview-chrome>
          <Sliders size={13} aria-hidden="true" />
          <span>Reveal stage:</span>
          {[1, 2, 3].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStage(s)}
              className={styles.stageBtn}
              data-active={stage >= s}
              aria-label={`Show ${s} lines`}
            >
              0{s}
            </button>
          ))}
        </div>
      </header>

      <div className={styles.editorialCanvas}>
        <span className={styles.issueNumber}>ISSUE // NO. 42</span>
        <div className={styles.maskedLines}>
          {LINES.map((line, idx) => {
            const isVisible = stage > idx;
            return (
              <div key={idx} className={styles.maskWrapper}>
                <h2
                  className={styles.lineText}
                  style={{
                    transform: isVisible ? "translateY(0%)" : "translateY(110%)",
                    opacity: isVisible ? 1 : 0,
                    transitionDelay: `${idx * 120}ms`,
                  }}
                >
                  {line}
                </h2>
              </div>
            );
          })}
        </div>

        <p className={styles.editorialSubhead}>
          An inquiry into high-density interface design, semantic rhythm, and the tactile balance between
          geometric restraint and digital depth.
        </p>
      </div>

      <footer className={styles.footer}>
        <span>ATLAS MONOGRAPH</span>
        <span>SWISS EDITORIAL LAYOUT</span>
      </footer>
    </div>
  );
}

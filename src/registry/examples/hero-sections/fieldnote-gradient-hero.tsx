"use client";

import { useState } from "react";
import styles from "./fieldnote-gradient-hero.module.css";

const PALETTES = [
  { name: "Solstice", disc: "radial-gradient(circle, #fca5a5 0%, #a855f7 60%, #3b82f6 100%)", orbit: "rgba(168, 85, 247, 0.25)" },
  { name: "Verdant", disc: "radial-gradient(circle, #a7f3d0 0%, #10b981 50%, #065f46 100%)", orbit: "rgba(16, 185, 129, 0.25)" },
  { name: "Ember", disc: "radial-gradient(circle, #fde047 0%, #f97316 55%, #ef4444 100%)", orbit: "rgba(249, 115, 22, 0.25)" },
];

export default function FieldnoteGradientHero() {
  const [paletteIdx, setPaletteIdx] = useState(0);
  const activePalette = PALETTES[paletteIdx];

  return (
    <section className={styles.hero} aria-label="Gradient hero example">
      <div className={styles.copy}>
        <span className={styles.kicker}>A SMALL STUDIO FOR BIG IDEAS</span>
        <h2>Make room for the next good thing.</h2>
        <p>Thoughtful digital work for people building what comes next.</p>
        
        <div className={styles.paletteRow}>
          <span className={styles.paletteLabel}>Colorway:</span>
          {PALETTES.map((p, i) => (
            <button
              key={p.name}
              type="button"
              onClick={() => setPaletteIdx(i)}
              className={styles.paletteBtn}
              data-active={paletteIdx === i}
              aria-label={`Switch palette to ${p.name}`}
            >
              {p.name}
            </button>
          ))}
        </div>

        <button type="button" className={styles.actionBtn}>
          <span>Explore the studio</span>
          <span aria-hidden="true">↗</span>
        </button>
      </div>
      <div className={styles.art} aria-hidden="true">
        <span className={styles.orbit} style={{ borderColor: activePalette.orbit }} />
        <span className={styles.disc} style={{ background: activePalette.disc }} />
        <span className={styles.artLabel}>FIELDNOTE / {activePalette.name.toUpperCase()}</span>
      </div>
    </section>
  );
}

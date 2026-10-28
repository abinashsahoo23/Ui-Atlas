"use client";

import { useState } from "react";
import { Grid } from 'lucide-react';
import styles from "./interactive-pixel-terrain.module.css";

const PALETTES = {
  monochrome: { active: "#182440", idle: "#e2e8f0", bg: "#f8fafc" },
  electric: { active: "#2563eb", idle: "#dbeafe", bg: "#eff6ff" },
  sunset: { active: "#ea580c", idle: "#ffedd5", bg: "#fff7ed" },
};

const ROWS = 8;
const COLS = 14;

export default function InteractivePixelTerrain() {
  const [paletteKey, setPaletteKey] = useState<keyof typeof PALETTES>("electric");
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number } | null>(null);

  const palette = PALETTES[paletteKey];

  return (
    <div className={styles.container} style={{ background: palette.bg }}>
      <header className={styles.header}>
        <div className={styles.titleGroup} data-preview-chrome>
          <Grid size={14} className={styles.icon} aria-hidden="true" />
          <span>PIXEL TERRAIN // DISCRETE MATRIX</span>
        </div>
        <div className={styles.palettePicker} data-preview-chrome>
          {(["monochrome", "electric", "sunset"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setPaletteKey(key)}
              className={styles.paletteBtn}
              data-active={paletteKey === key}
              aria-label={`Switch to ${key} palette`}
            >
              {key}
            </button>
          ))}
        </div>
      </header>

      <div
        className={styles.grid}
        onMouseLeave={() => setHoveredCell(null)}
        role="region"
        aria-label="Interactive pixel terrain grid"
      >
        {Array.from({ length: ROWS }).map((_, r) => (
          <div key={r} className={styles.gridRow}>
            {Array.from({ length: COLS }).map((_, c) => {
              // Calculate distance to hovered cell for localized ripple elevation
              let dist = 999;
              if (hoveredCell) {
                dist = Math.hypot(hoveredCell.r - r, hoveredCell.c - c);
              }

              const isDirect = dist < 0.5;
              const isNearby = dist < 2.5;

              return (
                <div
                  key={c}
                  onMouseEnter={() => setHoveredCell({ r, c })}
                  className={styles.pixel}
                  style={{
                    backgroundColor: isDirect
                      ? palette.active
                      : isNearby
                      ? `color-mix(in srgb, ${palette.active} ${Math.max(15, (2.5 - dist) * 40)}%, ${palette.idle})`
                      : palette.idle,
                    transform: isDirect ? "scale(1.28) translateY(-3px)" : isNearby ? "scale(1.1) translateY(-1px)" : "scale(1)",
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      <footer className={styles.footer}>
        <span>GRID: 14×8 TILES (112 PIXELS)</span>
        <span>HOVER INTERACTION ACTIVE</span>
      </footer>
    </div>
  );
}

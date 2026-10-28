"use client";

import { useState } from "react";
import { Sparkles, Palette } from 'lucide-react';
import styles from "./shiny-text-badge.module.css";

const COLORWAYS = [
  { id: "gold", name: "24K Aurum", base: "#785b1a", shimmer: "#ffec99", badge: "#1a1304" },
  { id: "cyan", name: "Bioluminescent", base: "#0e5a6a", shimmer: "#a5f3fc", badge: "#04151a" },
  { id: "platinum", name: "Liquid Platinum", base: "#4b5563", shimmer: "#ffffff", badge: "#111827" },
];

export default function ShinyTextBadge() {
  const [colorIdx, setColorIdx] = useState(0);
  const [shimmerSpeed, setShimmerSpeed] = useState(2.8);

  const currentColor = COLORWAYS[colorIdx];

  return (
    <div className={styles.container}>
      <div className={styles.hud} data-preview-chrome>
        <div className={styles.badge} data-preview-chrome>
          <Sparkles size={14} className={styles.icon} />
          <span className={styles.title}>SHINY TEXT // METALLIC SWEEP</span>
        </div>

        <div className={styles.controls} data-preview-chrome>
          <button
            type="button"
            className={styles.controlBtn}
            onClick={() => setColorIdx((idx) => (idx + 1) % COLORWAYS.length)}
            aria-label="Cycle shimmer metallic colorway"
          >
            <Palette size={14} />
          </button>

          <div className={styles.sliderGroup}>
            <span className={styles.label}>SPEED</span>
            <input
              type="range"
              min="1.2"
              max="5.0"
              step="0.2"
              value={shimmerSpeed}
              onChange={(e) => setShimmerSpeed(parseFloat(e.target.value))}
              className={styles.slider}
              aria-label="Shimmer speed in seconds"
            />
          </div>
        </div>
      </div>

      <div className={styles.displayArea}>
        <div
          className={styles.pillBadge}
          style={{
            backgroundColor: currentColor.badge,
            borderColor: `${currentColor.base}44`,
          }}
        >
          <span className={styles.pip} style={{ backgroundColor: currentColor.shimmer }} />
          <span
            className={styles.shinyText}
            style={
              {
                "--base-color": currentColor.base,
                "--shimmer-color": currentColor.shimmer,
                animationDuration: `${shimmerSpeed}s`,
              } as React.CSSProperties
            }
          >
            ✦ LEVEL 4 PROTOCOL VERIFIED // ZERO TRUST SPECIMEN
          </span>
        </div>

        <h3
          className={styles.headline}
          style={
            {
              "--base-color": currentColor.base,
              "--shimmer-color": currentColor.shimmer,
              animationDuration: `${shimmerSpeed * 1.25}s`,
            } as React.CSSProperties
          }
        >
          LUMINOUS REFRACTIVE TYPOGRAPHY
        </h3>

        <p className={styles.caption} data-preview-chrome>
          CSS gradient-mask sweeping across hardware composited glyphs with adaptive luminosity.
        </p>
      </div>
    </div>
  );
}

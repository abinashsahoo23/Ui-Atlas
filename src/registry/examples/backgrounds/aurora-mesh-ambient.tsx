"use client";

import { useState } from "react";
import { Moon, Sun, Wand2, Compass } from 'lucide-react';
import styles from "./aurora-mesh-ambient.module.css";

type AuroraTheme = "boreal" | "twilight" | "solar";

export default function AuroraMeshAmbient() {
  const [theme, setTheme] = useState<AuroraTheme>("boreal");
  const [intensity, setIntensity] = useState<"subtle" | "vivid">("vivid");

  return (
    <div className={`${styles.viewport} ${styles[theme]} ${styles[intensity]}`}>
      {/* Animated Aurora Mesh Blobs */}
      <div className={styles.meshCanvas} aria-hidden="true">
        <div className={`${styles.orb} ${styles.orb1}`} />
        <div className={`${styles.orb} ${styles.orb2}`} />
        <div className={`${styles.orb} ${styles.orb3}`} />
        <div className={styles.noiseOverlay} />
      </div>

      {/* Foreground Content Demonstration */}
      <div className={styles.foreground}>
        <div className={styles.ambientPill} data-preview-chrome>
          <Wand2 size={13} className={styles.ambientIcon} aria-hidden="true" />
          <span>AMBIENT ATMOSPHERE ENGINE</span>
        </div>

        <h3 className={styles.heroTitle} data-preview-chrome>Luminous Surface Depth</h3>
        <p className={styles.heroSubtitle} data-preview-chrome>
          Hardware-accelerated CSS blur filters and multi-point mesh gradients produce
          an organic aurora backdrop with zero external canvas or WebGL libraries.
        </p>

        <div className={styles.controlDeck} data-preview-chrome>
          <div className={styles.controlGroup}>
            <span className={styles.controlTitle}>PALETTE:</span>
            <div className={styles.buttonRow}>
              <button
                type="button"
                className={`${styles.presetBtn} ${theme === "boreal" ? styles.active : ""}`}
                onClick={() => setTheme("boreal")}
              >
                <Compass size={13} aria-hidden="true" /> Boreal
              </button>
              <button
                type="button"
                className={`${styles.presetBtn} ${theme === "twilight" ? styles.active : ""}`}
                onClick={() => setTheme("twilight")}
              >
                <Moon size={13} aria-hidden="true" /> Twilight
              </button>
              <button
                type="button"
                className={`${styles.presetBtn} ${theme === "solar" ? styles.active : ""}`}
                onClick={() => setTheme("solar")}
              >
                <Sun size={13} aria-hidden="true" /> Solar
              </button>
            </div>
          </div>

          <div className={styles.controlGroup}>
            <span className={styles.controlTitle}>ENERGY:</span>
            <div className={styles.buttonRow}>
              <button
                type="button"
                className={`${styles.presetBtn} ${intensity === "subtle" ? styles.active : ""}`}
                onClick={() => setIntensity("subtle")}
              >
                Calm
              </button>
              <button
                type="button"
                className={`${styles.presetBtn} ${intensity === "vivid" ? styles.active : ""}`}
                onClick={() => setIntensity("vivid")}
              >
                Vivid
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

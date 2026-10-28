"use client";

import { useState } from "react";
import styles from "./quiet-mode-controls.module.css";

export default function QuietModeControls() {
  const [density, setDensity] = useState<"comfortable" | "compact" | "focus">("comfortable");

  return (
    <section className={styles.panel} aria-label="Segmented control example">
      <p className={styles.caption} data-preview-chrome>DISPLAY PREFERENCE</p>
      <h2>Choose your pace.</h2>
      <fieldset className={styles.group}>
        <legend className={styles.visuallyHidden}>Display density</legend>
        <label className={styles.option}>
          <input
            type="radio"
            name="atlas-density-preview"
            value="comfortable"
            checked={density === "comfortable"}
            onChange={() => setDensity("comfortable")}
          />
          <span>Comfortable</span>
        </label>
        <label className={styles.option}>
          <input
            type="radio"
            name="atlas-density-preview"
            value="compact"
            checked={density === "compact"}
            onChange={() => setDensity("compact")}
          />
          <span>Compact</span>
        </label>
        <label className={styles.option}>
          <input
            type="radio"
            name="atlas-density-preview"
            value="focus"
            checked={density === "focus"}
            onChange={() => setDensity("focus")}
          />
          <span>Focus</span>
        </label>
      </fieldset>

      <div className={styles.previewCanvas} data-density={density}>
        <div className={styles.previewHeader}>
          <span className={styles.previewDot} aria-hidden="true" />
          <span>Active Viewport: {density.toUpperCase()}</span>
        </div>
        <div className={styles.previewBody}>
          <p className={styles.previewTitle}>The quick brown fox jumps over the lazy dog</p>
          <span className={styles.previewMeta}>
            Padding: {density === "comfortable" ? "16px" : density === "compact" ? "8px" : "4px"} · Leading:{" "}
            {density === "comfortable" ? "1.6" : density === "compact" ? "1.3" : "1.1"}
          </span>
        </div>
      </div>

      <p className={styles.hint} data-preview-chrome>A native choice, with real-time responsive density adaptation.</p>
    </section>
  );
}

"use client";

import { useState } from "react";
import { Sparkles, RefreshCw, Palette, Gauge } from "lucide-react";
import styles from "./flowing-gradient-text.module.css";

const HEADLINES = [
  "RADICAL SIMPLICITY",
  "FUTURE ARCHITECTURE",
  "HYPER-LUMINOUS DEPTH",
  "KINETIC CHROMATICS",
];

export default function FlowingGradientText() {
  const [headlineIdx, setHeadlineIdx] = useState(0);
  const [theme, setTheme] = useState<"prism" | "aurora" | "molten">("prism");
  const [flowSpeed, setFlowSpeed] = useState<"standard" | "fast" | "super">("standard");

  const text = HEADLINES[headlineIdx];

  const getThemeClass = () => {
    if (theme === "prism") return styles.prismTheme;
    if (theme === "aurora") return styles.auroraTheme;
    return styles.moltenTheme;
  };

  const getSpeedClass = () => {
    if (flowSpeed === "fast") return styles.fastFlow;
    if (flowSpeed === "super") return styles.superFlow;
    return "";
  };

  return (
    <div className={styles.container}>
      <div className={styles.centerStage}>
        <h2 className={`${styles.gradientHeading} ${getThemeClass()} ${getSpeedClass()}`}>
          {text}
        </h2>
      </div>

      <div className={styles.overlay} data-preview-chrome>
        <div className={styles.badge}>
          <Sparkles size={12} aria-hidden="true" />
          <span>Multi-Stop Spectral Sweep</span>
        </div>
        <h3 className={styles.title}>Flowing Gradient Text</h3>
        <p className={styles.description}>
          Hardware-accelerated linear gradient text clipping animated smoothly across multi-stop color fields with velocity toggling.
        </p>
      </div>

      <div className={styles.controls} data-preview-chrome>
        <div className={styles.controlGroup} role="toolbar" aria-label="Text controls">
          <button
            type="button"
            className={styles.btn}
            onClick={() => setHeadlineIdx((prev) => (prev + 1) % HEADLINES.length)}
          >
            <RefreshCw size={13} aria-hidden="true" />
            <span>Headline ({headlineIdx + 1}/{HEADLINES.length})</span>
          </button>
        </div>

        <div className={styles.controlGroup} role="radiogroup" aria-label="Gradient palette">
          <button
            type="button"
            className={`${styles.btn} ${theme === "prism" ? styles.active : ""}`}
            onClick={() => setTheme("prism")}
            role="radio"
            aria-checked={theme === "prism"}
          >
            <Palette size={13} aria-hidden="true" />
            <span>Prism Spectral</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${theme === "aurora" ? styles.active : ""}`}
            onClick={() => setTheme("aurora")}
            role="radio"
            aria-checked={theme === "aurora"}
          >
            <span>Boreal Aurora</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${theme === "molten" ? styles.active : ""}`}
            onClick={() => setTheme("molten")}
            role="radio"
            aria-checked={theme === "molten"}
          >
            <span>Molten Ember</span>
          </button>
        </div>

        <div className={styles.controlGroup} role="radiogroup" aria-label="Flow velocity">
          <button
            type="button"
            className={`${styles.btn} ${flowSpeed === "standard" ? styles.active : ""}`}
            onClick={() => setFlowSpeed("standard")}
            role="radio"
            aria-checked={flowSpeed === "standard"}
          >
            <span>Gentle (6s)</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${flowSpeed === "fast" ? styles.active : ""}`}
            onClick={() => setFlowSpeed("fast")}
            role="radio"
            aria-checked={flowSpeed === "fast"}
          >
            <Gauge size={13} aria-hidden="true" />
            <span>Dynamic (2.5s)</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${flowSpeed === "super" ? styles.active : ""}`}
            onClick={() => setFlowSpeed("super")}
            role="radio"
            aria-checked={flowSpeed === "super"}
          >
            <span>Super (1.2s)</span>
          </button>
        </div>
      </div>
    </div>
  );
}

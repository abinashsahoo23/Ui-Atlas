"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, RefreshCw, Zap } from "lucide-react";
import styles from "./cyber-glitch-slice.module.css";

const SAMPLES = ["Bits", "Tech Text", "System Breach", "Protocol Zero"];

export default function CyberGlitchSlice() {
  const [sampleIdx, setSampleIdx] = useState(0);
  const [glitchRate, setGlitchRate] = useState<"standard" | "overclock">("standard");
  const [glitchActive, setGlitchActive] = useState(false);
  const [sliceOffsets, setSliceOffsets] = useState({ redX: -3, redY: 1, cyanX: 3, cyanY: -1 });

  const text = SAMPLES[sampleIdx];

  useEffect(() => {
    const intervalTime = glitchRate === "overclock" ? 120 : 350;
    const interval = setInterval(() => {
      const isBurst = Math.random() < 0.65;
      setGlitchActive(isBurst);

      if (isBurst) {
        setSliceOffsets({
          redX: (Math.random() - 0.5) * 14,
          redY: (Math.random() - 0.5) * 6,
          cyanX: (Math.random() - 0.5) * 14,
          cyanY: (Math.random() - 0.5) * 6,
        });
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [glitchRate]);

  const triggerManualGlitch = () => {
    setGlitchActive(true);
    setSliceOffsets({
      redX: (Math.random() - 0.5) * 22,
      redY: (Math.random() - 0.5) * 8,
      cyanX: (Math.random() - 0.5) * 22,
      cyanY: (Math.random() - 0.5) * 8,
    });
    setTimeout(() => setGlitchActive(false), 200);
  };

  return (
    <div className={styles.container} onClick={triggerManualGlitch}>
      <div className={styles.scanlines} aria-hidden="true" />

      <div className={styles.centerStage}>
        <div
          className={styles.glitchWrapper}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setSampleIdx((prev) => (prev + 1) % SAMPLES.length);
            }
          }}
          aria-label={`Glitch text headline, current: ${text}`}
        >
          {/* Tech wireframe bounding box */}
          <div className={styles.wireframeBox} aria-hidden="true">
            <span className={styles.wireCoordTL}>5.58 × 68</span>
            <span className={styles.wireMarkerTL} />
            <span className={styles.wireMarkerTR} />
            <span className={styles.wireMarkerBL} />
            <span className={styles.wireMarkerBR} />
            <span className={styles.wireCoordBR}>18.69 × 85</span>
          </div>
          {/* Cyan chromatic channel slice */}
          {glitchActive && (
            <span
              className={`${styles.glitchLayer} ${styles.cyanSlice}`}
              style={{
                transform: `translate(${sliceOffsets.cyanX}px, ${sliceOffsets.cyanY}px)`,
              }}
              aria-hidden="true"
            >
              {text}
            </span>
          )}

          {/* Red chromatic channel slice */}
          {glitchActive && (
            <span
              className={`${styles.glitchLayer} ${styles.redSlice}`}
              style={{
                transform: `translate(${sliceOffsets.redX}px, ${sliceOffsets.redY}px)`,
              }}
              aria-hidden="true"
            >
              {text}
            </span>
          )}

          {/* Solid white typographic core */}
          <span className={styles.baseText}>
            {text}
          </span>
        </div>
      </div>

      <div className={styles.overlay} data-preview-chrome>
        <div className={styles.badge}>
          <ShieldAlert size={12} aria-hidden="true" />
          <span>Channel Separation Matrix</span>
        </div>
        <h3 className={styles.title}>Cyber Glitch Slice</h3>
        <p className={styles.description}>
          High-frequency RGB color channel split and horizontal polygon clip-path slice displacement with analog raster jitter.
        </p>
      </div>

      <div className={styles.controls} data-preview-chrome onClick={(e) => e.stopPropagation()}>
        <div className={styles.controlGroup} role="toolbar" aria-label="Text controls">
          <button
            type="button"
            className={styles.btn}
            onClick={() => setSampleIdx((prev) => (prev + 1) % SAMPLES.length)}
          >
            <RefreshCw size={13} aria-hidden="true" />
            <span>Phrase ({sampleIdx + 1}/{SAMPLES.length})</span>
          </button>
        </div>

        <div className={styles.controlGroup} role="radiogroup" aria-label="Glitch frequency">
          <button
            type="button"
            className={`${styles.btn} ${glitchRate === "standard" ? styles.active : ""}`}
            onClick={() => setGlitchRate("standard")}
            role="radio"
            aria-checked={glitchRate === "standard"}
          >
            <span>Standard Sync</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${glitchRate === "overclock" ? styles.active : ""}`}
            onClick={() => setGlitchRate("overclock")}
            role="radio"
            aria-checked={glitchRate === "overclock"}
          >
            <Zap size={13} aria-hidden="true" />
            <span>Overclocked Bursts</span>
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Sparkles, RefreshCw, Eye, Flame } from "lucide-react";
import styles from "./fuzzy-neon-bloom.module.css";

const SAMPLES = ["NEON DRIFT", "CHROMATIC", "SYNTHWAVE", "HYPERGLOW"];

export default function FuzzyNeonBloom() {
  const [sampleIdx, setSampleIdx] = useState(0);
  const [bloomIntensity, setBloomIntensity] = useState<"soft" | "intense">("intense");
  const [isHovered, setIsHovered] = useState(false);
  const [jitterOffset, setJitterOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let animId: number;
    const updateJitter = () => {
      const mag = isHovered ? 4 : 1.2;
      setJitterOffset({
        x: (Math.random() - 0.5) * mag,
        y: (Math.random() - 0.5) * mag,
      });
      animId = requestAnimationFrame(updateJitter);
    };
    animId = requestAnimationFrame(updateJitter);
    return () => cancelAnimationFrame(animId);
  }, [isHovered]);

  const text = SAMPLES[sampleIdx];
  const blurRadius = bloomIntensity === "intense" ? (isHovered ? 22 : 14) : 8;

  return (
    <div className={styles.container}>
      <div className={styles.centerStage}>
        <div className={styles.deepAura} aria-hidden="true" />
        <div
          className={styles.fuzzyWrapper}
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
          onClick={() => setSampleIdx((prev) => (prev + 1) % SAMPLES.length)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setSampleIdx((prev) => (prev + 1) % SAMPLES.length);
            }
          }}
          aria-label={`Cycle neon text, current: ${text}`}
        >
          {/* Chromatic bloom layers */}
          <span
            className={`${styles.bloomLayer} ${styles.cyanBloom}`}
            style={{
              filter: `blur(${blurRadius}px)`,
              transform: `translate(${-3 + jitterOffset.x}px, ${-2 + jitterOffset.y}px)`,
            }}
            aria-hidden="true"
          >
            {text}
          </span>
          <span
            className={`${styles.bloomLayer} ${styles.magentaBloom}`}
            style={{
              filter: `blur(${blurRadius}px)`,
              transform: `translate(${3 - jitterOffset.x}px, ${2 - jitterOffset.y}px)`,
            }}
            aria-hidden="true"
          >
            {text}
          </span>

          {/* Crisp foreground typography */}
          <span
            className={styles.fuzzyText}
            style={{
              transform: `translate(${jitterOffset.x * 0.5}px, ${jitterOffset.y * 0.5}px)`,
              textShadow: `0 0 10px rgba(255, 255, 255, 0.8), 0 0 ${blurRadius * 1.5}px #ec4899`,
            }}
          >
            {text}
          </span>
        </div>
      </div>

      <div className={styles.overlay} data-preview-chrome>
        <div className={styles.badge}>
          <Sparkles size={12} aria-hidden="true" />
          <span>Multi-Pass Phosphor Glow</span>
        </div>
        <h3 className={styles.title}>Fuzzy Neon Bloom</h3>
        <p className={styles.description}>
          High-frequency stochastic jitter layered over dual-channel cyan and magenta chromatic bloom. Hover or click to amplify energy.
        </p>
      </div>

      <div className={styles.controls} data-preview-chrome>
        <div className={styles.controlGroup} role="toolbar" aria-label="Text controls">
          <button
            type="button"
            className={styles.btn}
            onClick={() => setSampleIdx((prev) => (prev + 1) % SAMPLES.length)}
          >
            <RefreshCw size={13} aria-hidden="true" />
            <span>Cycle Text ({sampleIdx + 1}/{SAMPLES.length})</span>
          </button>
        </div>

        <div className={styles.controlGroup} role="radiogroup" aria-label="Bloom intensity">
          <button
            type="button"
            className={`${styles.btn} ${bloomIntensity === "soft" ? styles.active : ""}`}
            onClick={() => setBloomIntensity("soft")}
            role="radio"
            aria-checked={bloomIntensity === "soft"}
          >
            <Eye size={13} aria-hidden="true" />
            <span>Soft Dispersion</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${bloomIntensity === "intense" ? styles.active : ""}`}
            onClick={() => setBloomIntensity("intense")}
            role="radio"
            aria-checked={bloomIntensity === "intense"}
          >
            <Flame size={13} aria-hidden="true" />
            <span>Hyper Bloom</span>
          </button>
        </div>
      </div>
    </div>
  );
}

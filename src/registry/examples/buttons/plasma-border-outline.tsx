"use client";

import { useState } from "react";
import { Zap, Flame, Atom } from "lucide-react";
import styles from "./plasma-border-outline.module.css";

export default function PlasmaBorderOutline() {
  const [speed, setSpeed] = useState<"standard" | "fast">("standard");
  const [pulseCount, setPulseCount] = useState(0);

  const handleClick = () => {
    setPulseCount((prev) => prev + 1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.centerStage}>
        <div
          className={styles.plasmaWrapper}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleClick();
            }
          }}
          aria-label="High-voltage plasma outline action button"
        >
          {/* Animated conic plasma outline beam */}
          <div
            className={`${styles.plasmaRing} ${speed === "fast" ? styles.plasmaFast : ""}`}
            aria-hidden="true"
          />

          {/* Deep dark container payload */}
          <div className={styles.innerButton}>
            <Atom size={28} className={styles.atomLogo} aria-hidden="true" />
            <span className={styles.buttonText}>INITIALIZE ION FLUX ({pulseCount})</span>
          </div>
        </div>
      </div>

      <div className={styles.overlay} data-preview-chrome>
        <div className={styles.badge}>
          <Zap size={12} aria-hidden="true" />
          <span>High-Voltage Perimeter Conic Beam</span>
        </div>
        <h3 className={styles.title}>Plasma Border Outline</h3>
        <p className={styles.description}>
          Conic gradient perimeter traversal with glowing focal refraction and hardware compositing. Hover or click to pulse the plasma ring.
        </p>
      </div>

      <div className={styles.controls} data-preview-chrome>
        <div className={styles.controlGroup} role="radiogroup" aria-label="Circulation speed">
          <button
            type="button"
            className={`${styles.btn} ${speed === "standard" ? styles.active : ""}`}
            onClick={() => setSpeed("standard")}
            role="radio"
            aria-checked={speed === "standard"}
          >
            <span>Standard (3.0s)</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${speed === "fast" ? styles.active : ""}`}
            onClick={() => setSpeed("fast")}
            role="radio"
            aria-checked={speed === "fast"}
          >
            <Flame size={13} aria-hidden="true" />
            <span>Overclocked (1.2s)</span>
          </button>
        </div>
      </div>
    </div>
  );
}

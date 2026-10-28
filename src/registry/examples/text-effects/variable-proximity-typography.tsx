"use client";

import { useState, useRef, MouseEvent } from "react";
import styles from "./variable-proximity-typography.module.css";

const HEADLINE = "PROXIMITY CRAFT";

export default function VariableProximityTypography() {
  const containerRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [weights, setWeights] = useState<number[]>(() => new Array(HEADLINE.length).fill(400));
  const [mouseActive, setMouseActive] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    setMouseActive(true);
    const newWeights = letterRefs.current.map((el) => {
      if (!el) return 400;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
      const maxDist = 120; // 120px interaction radius

      if (dist < maxDist) {
        // Interpolate weight from 400 (distant) up to 900 (close)
        const intensity = 1 - dist / maxDist;
        return Math.round(400 + intensity * 500);
      }
      return 400;
    });

    setWeights(newWeights);
  };

  const handleMouseLeave = () => {
    setMouseActive(false);
    setWeights(new Array(HEADLINE.length).fill(400));
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={styles.container}
    >
      <header className={styles.header} data-preview-chrome>
        <span className={styles.tag}>DYNAMIC FONT AXIS / PROXIMITY</span>
        <span className={styles.hint}>
          {mouseActive ? "Proximity tracking engaged" : "Glide cursor across characters"}
        </span>
      </header>

      <div className={styles.textContainer} aria-label={HEADLINE}>
        {HEADLINE.split("").map((char, index) => {
          const weight = weights[index] || 400;
          return (
            <span
              key={index}
              ref={(el) => {
                letterRefs.current[index] = el;
              }}
              className={styles.char}
              style={{
                fontWeight: weight,
                color: weight > 600 ? "#1e3a8a" : weight > 450 ? "#334155" : "#64748b",
                transform: `scale(${1 + (weight - 400) / 3000})`,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          );
        })}
      </div>

      <div className={styles.weightGauges} aria-hidden="true">
        {HEADLINE.split("").map((char, index) => {
          const weight = weights[index] || 400;
          const heightPct = ((weight - 400) / 500) * 100;
          return (
            <div key={index} className={styles.gaugeCol}>
              <div className={styles.gaugeBar} style={{ height: `${Math.max(15, heightPct)}%` }} />
              <span className={styles.gaugeVal}>{weight}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

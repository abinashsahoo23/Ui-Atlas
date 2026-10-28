"use client";

import { useEffect, useState } from "react";
import { TrendingUp, RefreshCw } from 'lucide-react';
import styles from "./count-up-ticker.module.css";

const METRICS = [
  { label: "DAILY TRANSACTIONS", target: 48920, prefix: "", suffix: "", duration: 1600 },
  { label: "GLOBAL LATENCY", target: 14.8, prefix: "", suffix: "ms", decimals: 1, duration: 1400 },
  { label: "ACTIVE CLUSTER NODES", target: 1024, prefix: "", suffix: " NODES", duration: 1800 },
];

export default function CountUpTicker() {
  const [metricIdx, setMetricIdx] = useState(0);
  const [val, setVal] = useState(0);
  const [key, setKey] = useState(0);

  const currentMetric = METRICS[metricIdx];

  useEffect(() => {
    let startTime: number | null = null;
    let animId: number;

    const startVal = 0;
    const endVal = currentMetric.target;
    const dur = currentMetric.duration;

    const tick = (now: number) => {
      if (!startTime) startTime = now;
      const progress = Math.min((now - startTime) / dur, 1.0);
      // Quintic ease out
      const eased = 1 - Math.pow(1 - progress, 5);
      const curr = startVal + (endVal - startVal) * eased;
      setVal(curr);

      if (progress < 1.0) {
        animId = requestAnimationFrame(tick);
      }
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [key, currentMetric]);

  const handleRestart = () => {
    setKey((prev) => prev + 1);
  };

  const handleCycle = () => {
    setMetricIdx((prev) => (prev + 1) % METRICS.length);
    setKey((prev) => prev + 1);
  };

  const formattedValue = currentMetric.decimals
    ? val.toFixed(currentMetric.decimals)
    : Math.floor(val).toLocaleString();

  return (
    <div className={styles.container}>
      <div className={styles.hud} data-preview-chrome>
        <div className={styles.badge} data-preview-chrome>
          <TrendingUp size={14} className={styles.icon} />
          <span className={styles.title}>COUNT UP TICKER // SPRING NUMERICS</span>
        </div>

        <div className={styles.controls} data-preview-chrome>
          <button
            type="button"
            className={styles.controlBtn}
            onClick={handleRestart}
            aria-label="Replay ticker count animation"
          >
            <RefreshCw size={14} />
          </button>

          <button
            type="button"
            className={styles.cycleBtn}
            onClick={handleCycle}
            aria-label="Cycle between metric targets"
          >
            SWITCH METRIC ({metricIdx + 1}/{METRICS.length})
          </button>
        </div>
      </div>

      <div className={styles.displayArea}>
        <span className={styles.metricLabel}>{currentMetric.label}</span>
        
        <div className={styles.numberWrapper} aria-live="polite">
          {currentMetric.prefix && <span className={styles.affix}>{currentMetric.prefix}</span>}
          <span className={styles.digits}>{formattedValue}</span>
          {currentMetric.suffix && <span className={styles.affix}>{currentMetric.suffix}</span>}
        </div>

        <div className={styles.track}>
          <div
            className={styles.progressBar}
            style={{
              width: `${Math.min((val / currentMetric.target) * 100, 100)}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Focus, Play, Pause, RefreshCw } from "lucide-react";
import styles from "./optical-focus-headline.module.css";

const SENTENCES = [
  ["ARCHITECTURAL", "PRECISION", "REVEALS", "TRUE", "BEAUTY"],
  ["DISCOVER", "LUMINOUS", "DIGITAL", "SPECIMENS", "DAILY"],
  ["ENGINEERED", "WITH", "ZERO", "RUNTIME", "LATENCY"],
];

export default function OpticalFocusHeadline() {
  const [sentenceIdx, setSentenceIdx] = useState(0);
  const [focusedIdx, setFocusedIdx] = useState(1);
  const [isAutoCycle, setIsAutoCycle] = useState(true);

  const words = SENTENCES[sentenceIdx];
  const isAutoRef = useRef(isAutoCycle);

  useEffect(() => {
    isAutoRef.current = isAutoCycle;
  }, [isAutoCycle]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isAutoRef.current) {
        setFocusedIdx((prev) => (prev + 1) % words.length);
      }
    }, 2200);
    return () => clearInterval(timer);
  }, [words.length]);

  const handleCycleSentence = () => {
    setSentenceIdx((prev) => (prev + 1) % SENTENCES.length);
    setFocusedIdx(0);
  };

  return (
    <div className={styles.container}>
      <div className={styles.centerStage}>
        <div className={styles.phraseContainer} role="region" aria-label="Optical focal headline">
          {words.map((word, idx) => {
            const isTarget = idx === focusedIdx;
            return (
              <div
                key={idx}
                className={`${styles.focusWord} ${isTarget ? styles.focused : styles.defocused}`}
                onPointerEnter={() => {
                  setFocusedIdx(idx);
                  setIsAutoCycle(false);
                }}
                onClick={() => setFocusedIdx(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setFocusedIdx(idx);
                  }
                }}
                aria-label={`Word ${word}, ${isTarget ? "in optical focus" : "defocused"}`}
              >
                <div className={`${styles.reticleBracket} ${styles.bracketTL}`} />
                <div className={`${styles.reticleBracket} ${styles.bracketTR}`} />
                <div className={`${styles.reticleBracket} ${styles.bracketBL}`} />
                <div className={`${styles.reticleBracket} ${styles.bracketBR}`} />
                <span>{word}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.overlay} data-preview-chrome>
        <div className={styles.badge}>
          <Focus size={12} aria-hidden="true" />
          <span>Depth-of-Field Aperture Tracker</span>
        </div>
        <h3 className={styles.title}>Optical Focus Headline</h3>
        <p className={styles.description}>
          Simulated optical camera depth-of-field tracking words with reticle aperture brackets and progressive Gaussian blur falloff.
        </p>
      </div>

      <div className={styles.controls} data-preview-chrome>
        <div className={styles.controlGroup} role="toolbar" aria-label="Playback controls">
          <button
            type="button"
            className={`${styles.btn} ${isAutoCycle ? styles.active : ""}`}
            onClick={() => setIsAutoCycle(!isAutoCycle)}
            aria-pressed={isAutoCycle}
          >
            {isAutoCycle ? <Pause size={13} aria-hidden="true" /> : <Play size={13} aria-hidden="true" />}
            <span>{isAutoCycle ? "Auto Tracking" : "Manual Lens"}</span>
          </button>
          <button
            type="button"
            className={styles.btn}
            onClick={handleCycleSentence}
          >
            <RefreshCw size={13} aria-hidden="true" />
            <span>Cycle Phrase ({sentenceIdx + 1}/{SENTENCES.length})</span>
          </button>
        </div>
      </div>
    </div>
  );
}

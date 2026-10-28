"use client";

import { useEffect, useRef, useState } from "react";
import { Rotate3D, Play, Pause, RefreshCw } from "lucide-react";
import styles from "./phrase-flipper-3d.module.css";

const PHRASES = [
  "REVOLUTIONARY UI",
  "PRECISION HARDWARE",
  "NEUMORPHIC DEPTH",
  "ZERO LATENCY",
  "TACTILE DYNAMICS",
];

export default function PhraseFlipper3d() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [flipDegree, setFlipDegree] = useState(0);

  const isPlayingRef = useRef(isPlaying);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const handleNext = () => {
    setFlipDegree((prev) => prev + 180);
    setCurrentIndex((prev) => (prev + 1) % PHRASES.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (isPlayingRef.current) {
        handleNext();
      }
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const frontPhrase = PHRASES[currentIndex % PHRASES.length];
  const backPhrase = PHRASES[(currentIndex + 1) % PHRASES.length];

  return (
    <div className={styles.container}>
      <div className={styles.centerStage}>
        <div className={styles.prefixText}>ENGINEERED FOR</div>
        <div
          className={styles.cardFlipper}
          style={{ transform: `rotateX(${flipDegree}deg)` }}
          onClick={handleNext}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleNext();
            }
          }}
          aria-label={`Current phrase: ${frontPhrase}. Click to flip to next capability.`}
        >
          {/* Front card face */}
          <div className={styles.phraseCard}>
            <span className={styles.phraseText}>{frontPhrase}</span>
          </div>

          {/* Back card face */}
          <div className={`${styles.phraseCard} ${styles.cardFaceBack}`}>
            <span className={styles.phraseText}>{backPhrase}</span>
          </div>
        </div>
      </div>

      <div className={styles.overlay} data-preview-chrome>
        <div className={styles.badge}>
          <Rotate3D size={12} aria-hidden="true" />
          <span>Perspective Spatial Flip</span>
        </div>
        <h3 className={styles.title}>Phrase Flipper 3D</h3>
        <p className={styles.description}>
          3D perspective revolving capability flipper with spring trajectory dynamics. Tap card or let automatic cycle rotate.
        </p>
      </div>

      <div className={styles.controls} data-preview-chrome>
        <div className={styles.controlGroup} role="toolbar" aria-label="Playback controls">
          <button
            type="button"
            className={`${styles.btn} ${isPlaying ? styles.active : ""}`}
            onClick={() => setIsPlaying(!isPlaying)}
            aria-pressed={isPlaying}
          >
            {isPlaying ? <Pause size={13} aria-hidden="true" /> : <Play size={13} aria-hidden="true" />}
            <span>{isPlaying ? "Auto Flip" : "Paused"}</span>
          </button>
          <button
            type="button"
            className={styles.btn}
            onClick={handleNext}
          >
            <RefreshCw size={13} aria-hidden="true" />
            <span>Next ({currentIndex + 1}/{PHRASES.length})</span>
          </button>
        </div>
      </div>
    </div>
  );
}

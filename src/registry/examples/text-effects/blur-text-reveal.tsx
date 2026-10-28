"use client";

import { useState } from "react";
import { RotateCcw, Sparkles } from 'lucide-react';
import styles from "./blur-text-reveal.module.css";

const SAMPLES = [
  "ARCHITECTURE IS FROZEN MUSIC",
  "PRECISION ENGINEERING AT SCALE",
  "THE MATRIX OF DIGITAL SPECIMENS",
];

export default function BlurTextReveal() {
  const [sampleIdx, setSampleIdx] = useState(0);
  const [key, setKey] = useState(0);
  const [delayStep, setDelayStep] = useState(0.045);

  const text = SAMPLES[sampleIdx];
  const words = text.split(" ");

  const handleReplay = () => {
    setKey((prev) => prev + 1);
  };

  const handleCycle = () => {
    setSampleIdx((prev) => (prev + 1) % SAMPLES.length);
    setKey((prev) => prev + 1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.hud} data-preview-chrome>
        <div className={styles.badge} data-preview-chrome>
          <Sparkles size={14} className={styles.icon} />
          <span className={styles.title}>BLUR TEXT REVEAL // MOTION TYPOGRAPHY</span>
        </div>

        <div className={styles.controls} data-preview-chrome>
          <button
            type="button"
            className={styles.controlBtn}
            onClick={handleReplay}
            aria-label="Replay blur reveal animation"
          >
            <RotateCcw size={14} />
          </button>

          <button
            type="button"
            className={styles.cycleBtn}
            onClick={handleCycle}
            aria-label="Cycle display statement"
          >
            PHRASE {sampleIdx + 1}/{SAMPLES.length}
          </button>

          <div className={styles.sliderGroup}>
            <span className={styles.label}>STAGGER</span>
            <input
              type="range"
              min="0.02"
              max="0.10"
              step="0.01"
              value={delayStep}
              onChange={(e) => setDelayStep(parseFloat(e.target.value))}
              className={styles.slider}
              aria-label="Word stagger delay"
            />
          </div>
        </div>
      </div>

      <div className={styles.displayArea} key={key} aria-live="polite">
        <h2 className={styles.heading}>
          {words.map((word, wIdx) => (
            <span key={wIdx} className={styles.wordWrapper}>
              {word.split("").map((char, cIdx) => {
                const totalCharIdx = words.slice(0, wIdx).join("").length + cIdx;
                const animDelay = `${totalCharIdx * delayStep}s`;

                return (
                  <span
                    key={cIdx}
                    className={styles.character}
                    style={{ animationDelay: animDelay }}
                  >
                    {char}
                  </span>
                );
              })}
              <span className={styles.space}>&nbsp;</span>
            </span>
          ))}
        </h2>

        <p className={styles.subtext}>
          Progressive optical de-blurring rendered via hardware-accelerated CSS keyframes and modular staggers.
        </p>
      </div>
    </div>
  );
}

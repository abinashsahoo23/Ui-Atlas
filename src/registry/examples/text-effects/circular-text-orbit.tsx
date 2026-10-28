"use client";

import { useState } from "react";
import { Play, Pause, RotateCw, Orbit } from 'lucide-react';
import styles from "./circular-text-orbit.module.css";

const SAMPLES = [
  "UI ATLAS • COMPONENT DISCOVERY ENGINE • ",
  "RADIAL KINETIC TYPOGRAPHY • REACT BITS • ",
  "HIGH PERFORMANCE WEBGL • CREATIVE INTERACTION • ",
];

export default function CircularTextOrbit() {
  const [sampleIdx, setSampleIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(12);

  const text = SAMPLES[sampleIdx];
  const chars = text.split("");
  const total = chars.length;
  const angleStep = 360 / total;

  return (
    <div className={styles.container}>
      <div className={styles.hud} data-preview-chrome>
        <div className={styles.badge} data-preview-chrome>
          <Orbit size={14} className={styles.icon} />
          <span className={styles.title}>CIRCULAR TEXT // RADIAL ORBIT</span>
        </div>

        <div className={styles.controls} data-preview-chrome>
          <button
            type="button"
            className={styles.controlBtn}
            onClick={() => setIsPlaying((p) => !p)}
            aria-label={isPlaying ? "Pause orbit rotation" : "Play orbit rotation"}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>

          <button
            type="button"
            className={styles.cycleBtn}
            onClick={() => setSampleIdx((idx) => (idx + 1) % SAMPLES.length)}
            aria-label="Cycle orbital string"
          >
            TEXT {sampleIdx + 1}/{SAMPLES.length}
          </button>

          <div className={styles.sliderGroup}>
            <span className={styles.label}>SPEED</span>
            <input
              type="range"
              min="5"
              max="24"
              step="1"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value, 10))}
              className={styles.slider}
              aria-label="Orbit speed in seconds"
            />
          </div>
        </div>
      </div>

      <div className={styles.displayArea}>
        <div
          className={styles.orbitRing}
          data-playing={isPlaying}
          style={{ animationDuration: `${speed}s` }}
        >
          {chars.map((char, i) => {
            const rot = i * angleStep;
            return (
              <span
                key={i}
                className={styles.char}
                style={{
                  transform: `rotate(${rot}deg) translateY(-110px)`,
                }}
              >
                {char}
              </span>
            );
          })}

          <div className={styles.centerNode}>
            <RotateCw size={24} className={styles.nodeIcon} />
            <span className={styles.nodeLabel}>CORE</span>
          </div>
        </div>
      </div>
    </div>
  );
}

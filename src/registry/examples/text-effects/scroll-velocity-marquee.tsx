"use client";

import { useEffect, useRef, useState } from "react";
import { Gauge, Play, Pause, Wind } from "lucide-react";
import styles from "./scroll-velocity-marquee.module.css";

const ROW_1_TEXT = ["HIGH SPEED VELOCITY", "REACTIVE MARQUEE", "SPECIMEN RUNTIME"];
const ROW_2_TEXT = ["HARDWARE ACCELERATED", "BI-DIRECTIONAL MOTION", "KINETIC TYPE"];

export default function ScrollVelocityMarquee() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [offset1, setOffset1] = useState(0);
  const [offset2, setOffset2] = useState(0);

  const isPlayingRef = useRef(isPlaying);
  const speedRef = useRef(speedMultiplier);
  const velocityBoostRef = useRef(0);
  const lastPointerXRef = useRef<number | null>(null);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    speedRef.current = speedMultiplier;
  }, [isPlaying, speedMultiplier]);

  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (isPlayingRef.current) {
        // Decay velocity boost smoothly
        velocityBoostRef.current *= 0.95;
        const totalSpeed = (40 * speedRef.current + velocityBoostRef.current) * dt;

        setOffset1((prev) => (prev - totalSpeed) % 1200);
        setOffset2((prev) => (prev + totalSpeed * 0.8) % 1200);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    lastPointerXRef.current = e.clientX;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (lastPointerXRef.current !== null) {
      const delta = e.clientX - lastPointerXRef.current;
      velocityBoostRef.current = delta * 4;
      lastPointerXRef.current = e.clientX;
    }
  };

  const handlePointerUp = () => {
    lastPointerXRef.current = null;
  };

  return (
    <div
      className={styles.container}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div className={styles.marqueeStage}>
        {/* Row 1: Leftward sweep */}
        <div
          className={`${styles.marqueeRow} ${styles.rowPrimary}`}
          style={{ transform: `translateX(${offset1}px)` }}
        >
          {[0, 1, 2, 3].map((set) => (
            <span key={set} className={styles.marqueeItem}>
              {ROW_1_TEXT.map((item, idx) => (
                <span key={idx}>
                  {item} <span className={styles.separator}>✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>

        {/* Row 2: Rightward sweep (Outlined) */}
        <div
          className={`${styles.marqueeRow} ${styles.rowSecondary}`}
          style={{ transform: `translateX(${offset2}px)` }}
        >
          {[0, 1, 2, 3].map((set) => (
            <span key={set} className={styles.marqueeItem}>
              {ROW_2_TEXT.map((item, idx) => (
                <span key={idx}>
                  {item} <span className={styles.separator}>✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.overlay} data-preview-chrome>
        <div className={styles.badge}>
          <Gauge size={12} aria-hidden="true" />
          <span>Momentum Stream Frustum</span>
        </div>
        <h3 className={styles.title}>Scroll Velocity Marquee</h3>
        <p className={styles.description}>
          Dual bi-directional kinetic marquee strips with interactive pointer swipe velocity injection and hardware GPU compositing.
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
            <span>{isPlaying ? "Pause" : "Resume"}</span>
          </button>
        </div>

        <div className={styles.controlGroup} role="radiogroup" aria-label="Velocity multipliers">
          <button
            type="button"
            className={`${styles.btn} ${speedMultiplier === 1 ? styles.active : ""}`}
            onClick={() => setSpeedMultiplier(1)}
            role="radio"
            aria-checked={speedMultiplier === 1}
          >
            <span>1x Flow</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${speedMultiplier === 2 ? styles.active : ""}`}
            onClick={() => setSpeedMultiplier(2)}
            role="radio"
            aria-checked={speedMultiplier === 2}
          >
            <Wind size={13} aria-hidden="true" />
            <span>2x Boost</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${speedMultiplier === 3.5 ? styles.active : ""}`}
            onClick={() => setSpeedMultiplier(3.5)}
            role="radio"
            aria-checked={speedMultiplier === 3.5}
          >
            <Gauge size={13} aria-hidden="true" />
            <span>3.5x Warp</span>
          </button>
        </div>
      </div>
    </div>
  );
}

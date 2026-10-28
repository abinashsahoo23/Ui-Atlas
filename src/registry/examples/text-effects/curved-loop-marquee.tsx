"use client";

import { useEffect, useRef, useState } from "react";
import { Orbit, Play, Pause, ArrowLeftRight, Activity } from "lucide-react";
import styles from "./curved-loop-marquee.module.css";

const BASE_TEXT = "• ARCHITECTURE • FLUID GEOMETRY • SYSTEM SPECIMEN • KINETIC INTERFACE ";

export default function CurvedLoopMarquee() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [amplitude, setAmplitude] = useState<"subtle" | "dramatic">("dramatic");
  const [offset, setOffset] = useState(0);

  const isPlayingRef = useRef(isPlaying);
  const directionRef = useRef(direction);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    directionRef.current = direction;
  }, [isPlaying, direction]);

  useEffect(() => {
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (isPlayingRef.current) {
        setOffset((prev) => (prev + directionRef.current * dt * 45) % 1000);
      }
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  // Compute undulating cubic bezier wave path
  const curveY = amplitude === "dramatic" ? 110 : 55;
  const pathD = `M -200 240 Q 200 ${240 - curveY} 600 240 T 1400 240 T 2200 240`;

  return (
    <div className={styles.container}>
      <div className={styles.svgWrapper} aria-hidden="true">
        <svg
          viewBox="0 0 1200 480"
          className={styles.svg}
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="50%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
            <path id="curveWaveTrack" d={pathD} />
          </defs>

          <path d={pathD} className={styles.wavePath} />

          <text className={styles.curvedText}>
            <textPath
              href="#curveWaveTrack"
              startOffset={`${offset}px`}
              method="align"
              spacing="auto"
            >
              {BASE_TEXT.repeat(4)}
            </textPath>
          </text>
        </svg>
      </div>

      <div className={styles.overlay} data-preview-chrome>
        <div className={styles.badge}>
          <Orbit size={12} aria-hidden="true" />
          <span>Bézier Spline Track</span>
        </div>
        <h3 className={styles.title}>Curved Loop Marquee</h3>
        <p className={styles.description}>
          Continuous typography flow streaming across a dynamic mathematical SVG cubic Bézier wave path with velocity acceleration.
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
          <button
            type="button"
            className={styles.btn}
            onClick={() => setDirection((prev) => (prev === 1 ? -1 : 1))}
            title="Reverse direction"
          >
            <ArrowLeftRight size={13} aria-hidden="true" />
            <span>Reverse</span>
          </button>
        </div>

        <div className={styles.controlGroup} role="radiogroup" aria-label="Wave amplitude">
          <button
            type="button"
            className={`${styles.btn} ${amplitude === "subtle" ? styles.active : ""}`}
            onClick={() => setAmplitude("subtle")}
            role="radio"
            aria-checked={amplitude === "subtle"}
          >
            <span>Subtle Wave</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${amplitude === "dramatic" ? styles.active : ""}`}
            onClick={() => setAmplitude("dramatic")}
            role="radio"
            aria-checked={amplitude === "dramatic"}
          >
            <Activity size={13} aria-hidden="true" />
            <span>Dramatic Spline</span>
          </button>
        </div>
      </div>
    </div>
  );
}

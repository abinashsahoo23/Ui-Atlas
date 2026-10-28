"use client";

import { useEffect, useRef, useState } from "react";
import { CircleDot, Play, Pause, Waves } from "lucide-react";
import styles from "./liquid-metaball-cluster.module.css";

interface Metaball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

export default function LiquidMetaballCluster() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [viscosity, setViscosity] = useState<"standard" | "syrup">("standard");

  const isPlayingRef = useRef(isPlaying);
  const viscosityRef = useRef(viscosity);
  const pointerRef = useRef({ x: 0.5, y: 0.5, active: false });

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    viscosityRef.current = viscosity;
  }, [isPlaying, viscosity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animId: number;
    let isVisible = true;

    const BALLS_COUNT = 7;
    const balls: Metaball[] = [];

    const initBalls = () => {
      balls.length = 0;
      for (let i = 0; i < BALLS_COUNT; i++) {
        balls.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 2.5,
          vy: (Math.random() - 0.5) * 2.5,
          r: Math.random() * 28 + 36,
        });
      }
    };

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      initBalls();
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => updateSize());
    resizeObserver.observe(container);

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(container);

    const render = () => {
      if (isVisible && isPlayingRef.current && width > 0 && height > 0) {
        ctx.clearRect(0, 0, width, height);

        const currentViscosity = viscosityRef.current;
        const drag = currentViscosity === "syrup" ? 0.985 : 0.995;

        // Draw balls with smooth radial blur for gooey filter fusion
        ctx.fillStyle = "#38bdf8";

        for (let i = 0; i < balls.length; i++) {
          const b = balls[i];
          b.x += b.vx;
          b.y += b.vy;
          b.vx *= drag;
          b.vy *= drag;

          // Bounce off container boundary
          if (b.x - b.r < 0) {
            b.x = b.r;
            b.vx *= -1;
          }
          if (b.x + b.r > width) {
            b.x = width - b.r;
            b.vx *= -1;
          }
          if (b.y - b.r < 0) {
            b.y = b.r;
            b.vy *= -1;
          }
          if (b.y + b.r > height) {
            b.y = height - b.r;
            b.vy *= -1;
          }

          // Gentle attraction toward center
          b.vx += (width * 0.5 - b.x) * 0.0004;
          b.vy += (height * 0.5 - b.y) * 0.0004;

          // Pointer magnetic interaction
          if (pointerRef.current.active) {
            const pX = pointerRef.current.x * width;
            const pY = pointerRef.current.y * height;
            const dist = Math.hypot(b.x - pX, b.y - pY);
            if (dist < 180) {
              const force = (1 - dist / 180) * 0.3;
              b.vx += (pX - b.x) * force * 0.05;
              b.vy += (pY - b.y) * force * 0.05;
            }
          }

          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw cursor metaball if active
        if (pointerRef.current.active) {
          ctx.beginPath();
          ctx.arc(
            pointerRef.current.x * width,
            pointerRef.current.y * height,
            45,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      observer.disconnect();
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
      active: true,
    };
  };

  const handlePointerLeave = () => {
    pointerRef.current.active = false;
  };

  return (
    <div
      ref={containerRef}
      className={styles.container}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* SVG Gooey Contrast Filter Definition */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <filter id="gooeyFilter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div className={styles.centerStage}>
        <canvas ref={canvasRef} className={styles.metaballCanvas} aria-hidden="true" />
      </div>

      <div className={styles.overlay} data-preview-chrome>
        <div className={styles.badge}>
          <CircleDot size={12} aria-hidden="true" />
          <span>Organic Viscous Fluid Fusion</span>
        </div>
        <h3 className={styles.title}>Liquid Metaball Cluster</h3>
        <p className={styles.description}>
          SVG feColorMatrix contrast-threshold filtering merging organic fluid metaballs dynamically. Move cursor to attract fluid spheres.
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

        <div className={styles.controlGroup} role="radiogroup" aria-label="Fluid viscosity">
          <button
            type="button"
            className={`${styles.btn} ${viscosity === "standard" ? styles.active : ""}`}
            onClick={() => setViscosity("standard")}
            role="radio"
            aria-checked={viscosity === "standard"}
          >
            <span>Standard Water</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${viscosity === "syrup" ? styles.active : ""}`}
            onClick={() => setViscosity("syrup")}
            role="radio"
            aria-checked={viscosity === "syrup"}
          >
            <Waves size={13} aria-hidden="true" />
            <span>High Viscosity Syrup</span>
          </button>
        </div>
      </div>
    </div>
  );
}

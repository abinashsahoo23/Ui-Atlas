"use client";

import { useEffect, useRef, useState } from "react";
import { Rocket, Play, Pause, Gauge, Sparkles, Compass } from "lucide-react";
import styles from "./hyperspeed-light-tunnel.module.css";

type WarpVelocity = "sublight" | "hyperspeed" | "ludicrous";

interface StarStreak {
  x: number;
  y: number;
  z: number;
  prevZ: number;
  color: string;
}

export default function HyperspeedLightTunnel() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [velocity, setVelocity] = useState<WarpVelocity>("hyperspeed");
  const [palette, setPalette] = useState<"neon-cyan" | "deep-cosmic">("neon-cyan");

  const isPlayingRef = useRef(isPlaying);
  const velocityRef = useRef(velocity);
  const paletteRef = useRef(palette);
  const pointerRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    velocityRef.current = velocity;
    paletteRef.current = palette;
  }, [isPlaying, velocity, palette]);

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

    const STAR_COUNT = 600;
    const stars: StarStreak[] = [];

    const getStarColor = (isCosmic: boolean): string => {
      if (isCosmic) {
        const colors = ["#a855f7", "#ec4899", "#8b5cf6", "#f43f5e", "#ffffff"];
        return colors[Math.floor(Math.random() * colors.length)];
      }
      const colors = ["#38bdf8", "#06b6d4", "#60a5fa", "#e0f2fe", "#34d399"];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    const initStars = () => {
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) {
        const z = Math.random() * 1000 + 1;
        stars.push({
          x: (Math.random() - 0.5) * 2000,
          y: (Math.random() - 0.5) * 2000,
          z,
          prevZ: z,
          color: getStarColor(paletteRef.current === "deep-cosmic"),
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
      initStars();
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
        // Smooth pointer interpolation
        pointerRef.current.x += (pointerRef.current.targetX - pointerRef.current.x) * 0.08;
        pointerRef.current.y += (pointerRef.current.targetY - pointerRef.current.y) * 0.08;

        const currentVelocity = velocityRef.current;
        let speed = 25;
        if (currentVelocity === "sublight") speed = 8;
        if (currentVelocity === "ludicrous") speed = 65;

        // Dark exposure trail
        ctx.fillStyle = currentVelocity === "ludicrous" ? "rgba(2, 4, 8, 0.35)" : "rgba(2, 4, 8, 0.45)";
        ctx.fillRect(0, 0, width, height);

        const centerX = width * 0.5 + pointerRef.current.x * 120;
        const centerY = height * 0.5 + pointerRef.current.y * 120;
        const fov = 400;

        ctx.save();
        ctx.globalCompositeOperation = "lighter";

        for (let i = 0; i < stars.length; i++) {
          const s = stars[i];
          s.prevZ = s.z;
          s.z -= speed;

          if (s.z <= 0) {
            s.z = 1000;
            s.prevZ = 1000;
            s.x = (Math.random() - 0.5) * 2000;
            s.y = (Math.random() - 0.5) * 2000;
            s.color = getStarColor(paletteRef.current === "deep-cosmic");
          }

          const k = fov / s.z;
          const px = s.x * k + centerX;
          const py = s.y * k + centerY;

          const prevK = fov / s.prevZ;
          const prevPx = s.x * prevK + centerX;
          const prevPy = s.y * prevK + centerY;

          // Render only within visible frustum
          if (px >= 0 && px <= width && py >= 0 && py <= height) {
            const alpha = Math.min(1, (1000 - s.z) / 400);
            ctx.beginPath();
            ctx.strokeStyle = s.color;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = Math.min(3.5, (1000 - s.z) / 300 + 0.5);
            ctx.moveTo(prevPx, prevPy);
            ctx.lineTo(px, py);
            ctx.stroke();
          }
        }

        ctx.restore();
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
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    pointerRef.current.targetX = nx * 2;
    pointerRef.current.targetY = ny * 2;
  };

  const handlePointerLeave = () => {
    pointerRef.current.targetX = 0;
    pointerRef.current.targetY = 0;
  };

  return (
    <div
      ref={containerRef}
      className={styles.container}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

      <div className={styles.overlay} data-preview-chrome>
        <div className={styles.badge}>
          <Rocket size={12} aria-hidden="true" />
          <span>Relativistic Warp Frustum</span>
        </div>
        <h3 className={styles.title}>Hyperspeed Light Tunnel</h3>
        <p className={styles.description}>
          3D perspective star streaks with relativistic velocity projection and directional steering. Move cursor to pilot trajectory.
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

        <div className={styles.controlGroup} role="radiogroup" aria-label="Warp velocity">
          <button
            type="button"
            className={`${styles.btn} ${velocity === "sublight" ? styles.active : ""}`}
            onClick={() => setVelocity("sublight")}
            role="radio"
            aria-checked={velocity === "sublight"}
          >
            <Compass size={13} aria-hidden="true" />
            <span>0.2c Sublight</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${velocity === "hyperspeed" ? styles.active : ""}`}
            onClick={() => setVelocity("hyperspeed")}
            role="radio"
            aria-checked={velocity === "hyperspeed"}
          >
            <Gauge size={13} aria-hidden="true" />
            <span>Warp 5</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${velocity === "ludicrous" ? styles.active : ""}`}
            onClick={() => setVelocity("ludicrous")}
            role="radio"
            aria-checked={velocity === "ludicrous"}
          >
            <Sparkles size={13} aria-hidden="true" />
            <span>Ludicrous Speed</span>
          </button>
        </div>

        <div className={styles.controlGroup} role="radiogroup" aria-label="Spectral theme">
          <button
            type="button"
            className={`${styles.btn} ${palette === "neon-cyan" ? styles.active : ""}`}
            onClick={() => setPalette("neon-cyan")}
            role="radio"
            aria-checked={palette === "neon-cyan"}
          >
            <span>Neon Cyan</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${palette === "deep-cosmic" ? styles.active : ""}`}
            onClick={() => setPalette("deep-cosmic")}
            role="radio"
            aria-checked={palette === "deep-cosmic"}
          >
            <span>Deep Cosmic</span>
          </button>
        </div>
      </div>
    </div>
  );
}

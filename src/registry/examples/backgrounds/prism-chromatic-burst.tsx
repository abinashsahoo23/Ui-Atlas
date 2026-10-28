"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, Play, Pause, Compass, Zap } from "lucide-react";
import styles from "./prism-chromatic-burst.module.css";

type PaletteMode = "spectral" | "ultraviolet" | "amber-fire";

export default function PrismChromaticBurst() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [mode, setMode] = useState<PaletteMode>("spectral");
  const [density, setDensity] = useState<"standard" | "dense">("standard");

  const isPlayingRef = useRef(isPlaying);
  const modeRef = useRef(mode);
  const densityRef = useRef(density);
  const pointerRef = useRef({ x: 0.5, y: 0.5, active: false });

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    modeRef.current = mode;
    densityRef.current = density;
  }, [isPlaying, mode, density]);

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
    let time = 0;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
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
        time += 0.015;
        ctx.fillStyle = "rgba(7, 9, 14, 0.22)";
        ctx.fillRect(0, 0, width, height);

        const currentMode = modeRef.current;
        const currentDensity = densityRef.current;
        const beamCount = currentDensity === "dense" ? 48 : 28;

        const centerX = width * 0.5 + (pointerRef.current.x - 0.5) * 80;
        const centerY = height * 0.5 + (pointerRef.current.y - 0.5) * 80;

        ctx.save();
        ctx.globalCompositeOperation = "screen";

        for (let i = 0; i < beamCount; i++) {
          const angle = (i / beamCount) * Math.PI * 2 + time * 0.4;
          const wobble = Math.sin(time * 2 + i * 0.5) * 40;
          const length = Math.max(width, height) * 0.85 + wobble;

          const endX = centerX + Math.cos(angle) * length;
          const endY = centerY + Math.sin(angle) * length;

          const grad = ctx.createLinearGradient(centerX, centerY, endX, endY);
          let hue = 0;
          if (currentMode === "spectral") {
            hue = ((i / beamCount) * 360 + time * 50) % 360;
          } else if (currentMode === "ultraviolet") {
            hue = 240 + Math.sin(i * 0.3 + time) * 60;
          } else {
            hue = 15 + Math.sin(i * 0.3 + time) * 45;
          }

          grad.addColorStop(0, `hsla(${hue}, 95%, 70%, 0.8)`);
          grad.addColorStop(0.3, `hsla(${hue + 20}, 90%, 55%, 0.25)`);
          grad.addColorStop(1, `hsla(${hue + 40}, 85%, 40%, 0)`);

          ctx.beginPath();
          ctx.strokeStyle = grad;
          ctx.lineWidth = currentDensity === "dense" ? 2.5 : 4;
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
        }

        // Inner glowing refraction ring
        ctx.beginPath();
        const ringGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 70);
        ringGrad.addColorStop(0, "rgba(255, 255, 255, 0.9)");
        ringGrad.addColorStop(0.4, "rgba(165, 180, 252, 0.4)");
        ringGrad.addColorStop(1, "rgba(7, 9, 14, 0)");
        ctx.fillStyle = ringGrad;
        ctx.arc(centerX, centerY, 70, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

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
    pointerRef.current = { x: 0.5, y: 0.5, active: false };
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
          <Sparkles size={12} aria-hidden="true" />
          <span>Optics Refraction Grid</span>
        </div>
        <h3 className={styles.title}>Prism Chromatic Dispersion</h3>
        <p className={styles.description}>
          Multi-frequency refractive beam dispersion with interactive vector deflection and hardware-accelerated canvas compositing.
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

        <div className={styles.controlGroup} role="radiogroup" aria-label="Refraction spectrum">
          <button
            type="button"
            className={`${styles.btn} ${mode === "spectral" ? styles.active : ""}`}
            onClick={() => setMode("spectral")}
            role="radio"
            aria-checked={mode === "spectral"}
          >
            <Compass size={13} aria-hidden="true" />
            <span>Spectral</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${mode === "ultraviolet" ? styles.active : ""}`}
            onClick={() => setMode("ultraviolet")}
            role="radio"
            aria-checked={mode === "ultraviolet"}
          >
            <Zap size={13} aria-hidden="true" />
            <span>Ultraviolet</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${mode === "amber-fire" ? styles.active : ""}`}
            onClick={() => setMode("amber-fire")}
            role="radio"
            aria-checked={mode === "amber-fire"}
          >
            <Sparkles size={13} aria-hidden="true" />
            <span>Amber Fire</span>
          </button>
        </div>

        <div className={styles.controlGroup} role="radiogroup" aria-label="Beam density">
          <button
            type="button"
            className={`${styles.btn} ${density === "standard" ? styles.active : ""}`}
            onClick={() => setDensity("standard")}
            role="radio"
            aria-checked={density === "standard"}
          >
            <span>Standard</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${density === "dense" ? styles.active : ""}`}
            onClick={() => setDensity("dense")}
            role="radio"
            aria-checked={density === "dense"}
          >
            <span>High Density</span>
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Terminal, Play, Pause, RefreshCw, ShieldAlert } from "lucide-react";
import styles from "./faulty-phosphor-crt.module.css";

type PhosphorColor = "p1-green" | "p3-amber" | "p4-white";

export default function FaultyPhosphorCrt() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [phosphor, setPhosphor] = useState<PhosphorColor>("p1-green");
  const [glitchIntensity, setGlitchIntensity] = useState<"nominal" | "degraded">("nominal");

  const isPlayingRef = useRef(isPlaying);
  const phosphorRef = useRef(phosphor);
  const glitchRef = useRef(glitchIntensity);
  const degaussRef = useRef(0);
  const pointerRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    phosphorRef.current = phosphor;
    glitchRef.current = glitchIntensity;
  }, [isPlaying, phosphor, glitchIntensity]);

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
    let frame = 0;

    const GLYPHS = "0123456789ABCDEF<>[]{}/*-+=~#$@%&_";

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
        frame++;

        // Phosphor decay persistence
        ctx.fillStyle = "rgba(3, 8, 4, 0.22)";
        ctx.fillRect(0, 0, width, height);

        const currentPhosphor = phosphorRef.current;
        let glowColor = "#22c55e";
        let dimColor = "rgba(34, 197, 94, 0.25)";
        if (currentPhosphor === "p3-amber") {
          glowColor = "#f59e0b";
          dimColor = "rgba(245, 158, 11, 0.25)";
        } else if (currentPhosphor === "p4-white") {
          glowColor = "#e2e8f0";
          dimColor = "rgba(226, 232, 240, 0.25)";
        }

        const isDegraded = glitchRef.current === "degraded";
        const jitter = isDegraded ? (Math.random() - 0.5) * 8 : (Math.random() - 0.5) * 1.5;

        // Degauss magnetic wobble decay
        if (degaussRef.current > 0) {
          degaussRef.current *= 0.92;
        }

        ctx.save();

        if (degaussRef.current > 0.02) {
          const degaussOffset = Math.sin(frame * 0.5) * degaussRef.current * 30;
          ctx.translate(degaussOffset, 0);
        }

        ctx.font = '12px "JetBrains Mono", monospace';
        ctx.textBaseline = "top";

        const cols = Math.floor(width / 18);
        const rows = Math.floor(height / 22);

        for (let r = 0; r < rows; r++) {
          const y = r * 22 + jitter;
          // Rolling horizontal beam band
          const scanDist = Math.abs((y - (frame * 3) % height));
          const scanBoost = Math.max(0, 1 - scanDist / 60) * 0.7;

          for (let c = 0; c < cols; c++) {
            const x = c * 18;
            const distFromPointer = Math.hypot(x - pointerRef.current.x * width, y - pointerRef.current.y * height);
            const isNearPointer = distFromPointer < 90;

            const charIndex = (r * 13 + c * 7 + Math.floor(frame * 0.1)) % GLYPHS.length;
            const char = isNearPointer || (isDegraded && Math.random() < 0.05)
              ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
              : GLYPHS[charIndex];

            if (isNearPointer) {
              ctx.fillStyle = glowColor;
              ctx.shadowColor = glowColor;
              ctx.shadowBlur = 10;
              ctx.fillText(char, x, y);
              ctx.shadowBlur = 0;
            } else if (Math.random() < 0.75 + scanBoost) {
              ctx.fillStyle = scanBoost > 0.2 ? glowColor : dimColor;
              ctx.fillText(char, x, y);
            }
          }
        }

        // Horizontal sync glitch slices
        if (isDegraded && Math.random() < 0.15) {
          const sliceY = Math.random() * height;
          const sliceH = Math.random() * 20 + 5;
          const sliceOffset = (Math.random() - 0.5) * 24;
          const imgData = ctx.getImageData(0, sliceY, width, sliceH);
          ctx.putImageData(imgData, sliceOffset, sliceY);
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
    pointerRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  };

  const handleDegauss = () => {
    degaussRef.current = 1.0;
  };

  return (
    <div
      ref={containerRef}
      className={styles.container}
      onPointerMove={handlePointerMove}
      onClick={handleDegauss}
    >
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      <div className={styles.scanlines} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />

      <div className={styles.overlay} data-preview-chrome>
        <div className={styles.badge}>
          <Terminal size={12} aria-hidden="true" />
          <span>Cathode Ray Tube Telemetry</span>
        </div>
        <h3 className={styles.title}>Faulty Phosphor CRT</h3>
        <p className={styles.description}>
          Analog phosphor decay, rolling raster scanlines, and magnetic degauss jitter. Hover to decode character matrix or click to degauss.
        </p>
      </div>

      <div className={styles.controls} data-preview-chrome onClick={(e) => e.stopPropagation()}>
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
            onClick={handleDegauss}
            title="Trigger electromagnetic coil degauss"
          >
            <RefreshCw size={13} aria-hidden="true" />
            <span>Degauss</span>
          </button>
        </div>

        <div className={styles.controlGroup} role="radiogroup" aria-label="Phosphor type">
          <button
            type="button"
            className={`${styles.btn} ${phosphor === "p1-green" ? styles.active : ""}`}
            onClick={() => setPhosphor("p1-green")}
            role="radio"
            aria-checked={phosphor === "p1-green"}
          >
            <span>P1 Green</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${phosphor === "p3-amber" ? styles.active : ""}`}
            onClick={() => setPhosphor("p3-amber")}
            role="radio"
            aria-checked={phosphor === "p3-amber"}
          >
            <span>P3 Amber</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${phosphor === "p4-white" ? styles.active : ""}`}
            onClick={() => setPhosphor("p4-white")}
            role="radio"
            aria-checked={phosphor === "p4-white"}
          >
            <span>P4 Monochrome</span>
          </button>
        </div>

        <div className={styles.controlGroup} role="radiogroup" aria-label="Sync integrity">
          <button
            type="button"
            className={`${styles.btn} ${glitchIntensity === "nominal" ? styles.active : ""}`}
            onClick={() => setGlitchIntensity("nominal")}
            role="radio"
            aria-checked={glitchIntensity === "nominal"}
          >
            <span>Nominal Sync</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${glitchIntensity === "degraded" ? styles.active : ""}`}
            onClick={() => setGlitchIntensity("degraded")}
            role="radio"
            aria-checked={glitchIntensity === "degraded"}
          >
            <ShieldAlert size={13} aria-hidden="true" />
            <span>Sync Glitch</span>
          </button>
        </div>
      </div>
    </div>
  );
}

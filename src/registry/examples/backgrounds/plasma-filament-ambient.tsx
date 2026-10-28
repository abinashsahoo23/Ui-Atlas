"use client";

import { useEffect, useRef, useState } from "react";
import { Activity, Play, Pause, Sun, Moon, Flame } from "lucide-react";
import styles from "./plasma-filament-ambient.module.css";

type PlasmaCore = "astral" | "solar" | "cyberpunk";

export default function PlasmaFilamentAmbient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [core, setCore] = useState<PlasmaCore>("astral");
  const [turbulence, setTurbulence] = useState<"fluid" | "energetic">("fluid");

  const isPlayingRef = useRef(isPlaying);
  const coreRef = useRef(core);
  const turbulenceRef = useRef(turbulence);
  const pointerRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    coreRef.current = core;
    turbulenceRef.current = turbulence;
  }, [isPlaying, core, turbulence]);

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

    const FILAMENTS = 18;

    const render = () => {
      if (isVisible && isPlayingRef.current && width > 0 && height > 0) {
        pointerRef.current.x += (pointerRef.current.targetX - pointerRef.current.x) * 0.05;
        pointerRef.current.y += (pointerRef.current.targetY - pointerRef.current.y) * 0.05;

        time += turbulenceRef.current === "energetic" ? 0.024 : 0.012;

        ctx.fillStyle = "rgba(5, 5, 15, 0.2)";
        ctx.fillRect(0, 0, width, height);

        ctx.save();
        ctx.globalCompositeOperation = "screen";

        const currentCore = coreRef.current;
        const pX = pointerRef.current.x * width;
        const pY = pointerRef.current.y * height;

        for (let i = 0; i < FILAMENTS; i++) {
          const progress = i / FILAMENTS;
          const phase = progress * Math.PI * 2 + time;

          let strokeColor = "";
          if (currentCore === "astral") {
            const h = (220 + progress * 80 + Math.sin(time) * 20) % 360;
            strokeColor = `hsla(${h}, 90%, 65%, 0.35)`;
          } else if (currentCore === "solar") {
            const h = (20 + progress * 45) % 360;
            strokeColor = `hsla(${h}, 95%, 60%, 0.35)`;
          } else {
            const h = (150 + progress * 140) % 360;
            strokeColor = `hsla(${h}, 90%, 55%, 0.35)`;
          }

          ctx.beginPath();
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 3.5;

          const steps = 60;
          for (let s = 0; s <= steps; s++) {
            const t = s / steps;
            const x = t * width;

            // Multi-frequency sinusoidal synthesis
            const f1 = Math.sin(t * 5 + phase) * 60;
            const f2 = Math.cos(t * 9 - time * 1.5 + progress * 4) * 35;
            const f3 = Math.sin(t * 14 + time * 2) * 15;

            // Gravitational magnetic pull toward pointer
            const distFromPointer = Math.hypot(x - pX, height * 0.5 - pY);
            const pull = Math.max(0, 1 - distFromPointer / (width * 0.4)) * (pY - height * 0.5) * 0.6;

            const y = height * 0.5 + f1 + f2 + f3 + pull;

            if (s === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.stroke();
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
    pointerRef.current.targetX = (e.clientX - rect.left) / rect.width;
    pointerRef.current.targetY = (e.clientY - rect.top) / rect.height;
  };

  const handlePointerLeave = () => {
    pointerRef.current.targetX = 0.5;
    pointerRef.current.targetY = 0.5;
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
          <Activity size={12} aria-hidden="true" />
          <span>Multi-Harmonic Ion Flow</span>
        </div>
        <h3 className={styles.title}>Plasma Filament Ambient</h3>
        <p className={styles.description}>
          Fourier-synthesized energetic plasma filaments responding to magnetic pointer displacement with non-linear turbulence.
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

        <div className={styles.controlGroup} role="radiogroup" aria-label="Plasma spectrum">
          <button
            type="button"
            className={`${styles.btn} ${core === "astral" ? styles.active : ""}`}
            onClick={() => setCore("astral")}
            role="radio"
            aria-checked={core === "astral"}
          >
            <Moon size={13} aria-hidden="true" />
            <span>Astral Violet</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${core === "solar" ? styles.active : ""}`}
            onClick={() => setCore("solar")}
            role="radio"
            aria-checked={core === "solar"}
          >
            <Sun size={13} aria-hidden="true" />
            <span>Solar Corona</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${core === "cyberpunk" ? styles.active : ""}`}
            onClick={() => setCore("cyberpunk")}
            role="radio"
            aria-checked={core === "cyberpunk"}
          >
            <Flame size={13} aria-hidden="true" />
            <span>Cyberpunk Neon</span>
          </button>
        </div>

        <div className={styles.controlGroup} role="radiogroup" aria-label="Turbulence frequency">
          <button
            type="button"
            className={`${styles.btn} ${turbulence === "fluid" ? styles.active : ""}`}
            onClick={() => setTurbulence("fluid")}
            role="radio"
            aria-checked={turbulence === "fluid"}
          >
            <span>Fluid Drift</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${turbulence === "energetic" ? styles.active : ""}`}
            onClick={() => setTurbulence("energetic")}
            role="radio"
            aria-checked={turbulence === "energetic"}
          >
            <span>Energetic High</span>
          </button>
        </div>
      </div>
    </div>
  );
}

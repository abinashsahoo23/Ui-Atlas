"use client";

import { useEffect, useRef, useState } from "react";
import { Waves, Play, Pause, Palette, Wind } from "lucide-react";
import styles from "./silk-wave-fabric.module.css";

type SilkSheen = "rose-quartz" | "onyx-pearl" | "sapphire-drape";

export default function SilkWaveFabric() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [sheen, setSheen] = useState<SilkSheen>("rose-quartz");
  const [drapeFlow, setDrapeFlow] = useState<"gentle" | "breeze">("gentle");

  const isPlayingRef = useRef(isPlaying);
  const sheenRef = useRef(sheen);
  const drapeRef = useRef(drapeFlow);
  const pointerRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    sheenRef.current = sheen;
    drapeRef.current = drapeFlow;
  }, [isPlaying, sheen, drapeFlow]);

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

    const STRIPS = 32;

    const render = () => {
      if (isVisible && isPlayingRef.current && width > 0 && height > 0) {
        pointerRef.current.x += (pointerRef.current.targetX - pointerRef.current.x) * 0.04;
        pointerRef.current.y += (pointerRef.current.targetY - pointerRef.current.y) * 0.04;

        time += drapeRef.current === "breeze" ? 0.018 : 0.009;

        ctx.fillStyle = "#0b0d14";
        ctx.fillRect(0, 0, width, height);

        const currentSheen = sheenRef.current;
        const pX = pointerRef.current.x * width;
        const pY = pointerRef.current.y * height;

        ctx.save();

        for (let i = 0; i < STRIPS; i++) {
          const ratio = i / STRIPS;
          const baseY = ratio * (height * 1.2) - height * 0.1;

          let color1 = "";
          let color2 = "";
          if (currentSheen === "rose-quartz") {
            const l = 35 + Math.sin(ratio * 6 + time * 2) * 20;
            color1 = `hsla(330, 60%, ${l}%, 0.45)`;
            color2 = `hsla(340, 75%, ${l + 25}%, 0.15)`;
          } else if (currentSheen === "onyx-pearl") {
            const l = 30 + Math.sin(ratio * 6 + time * 2) * 25;
            color1 = `hsla(220, 15%, ${l}%, 0.5)`;
            color2 = `hsla(210, 20%, ${l + 30}%, 0.2)`;
          } else {
            const l = 35 + Math.sin(ratio * 6 + time * 2) * 22;
            color1 = `hsla(215, 70%, ${l}%, 0.45)`;
            color2 = `hsla(190, 80%, ${l + 25}%, 0.15)`;
          }

          const grad = ctx.createLinearGradient(0, baseY - 60, width, baseY + 60);
          grad.addColorStop(0, color1);
          grad.addColorStop(0.5, color2);
          grad.addColorStop(1, color1);

          ctx.beginPath();
          ctx.fillStyle = grad;

          const points: { x: number; y: number }[] = [];
          const stepCount = 40;

          for (let s = 0; s <= stepCount; s++) {
            const x = (s / stepCount) * width;
            const wave1 = Math.sin(s * 0.25 + time * 2 + i * 0.3) * 45;
            const wave2 = Math.cos(s * 0.15 - time + i * 0.2) * 25;

            const dist = Math.hypot(x - pX, baseY - pY);
            const ripple = Math.max(0, 1 - dist / 220) * 40;

            const y = baseY + wave1 + wave2 + ripple;
            points.push({ x, y });
          }

          ctx.moveTo(points[0].x, points[0].y);
          for (let p = 1; p < points.length; p++) {
            ctx.lineTo(points[p].x, points[p].y);
          }
          ctx.lineTo(width, height);
          ctx.lineTo(0, height);
          ctx.closePath();
          ctx.fill();

          // Delicate specular ridge highlight
          ctx.beginPath();
          ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
          ctx.lineWidth = 1.2;
          ctx.moveTo(points[0].x, points[0].y);
          for (let p = 1; p < points.length; p++) {
            ctx.lineTo(points[p].x, points[p].y);
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
          <Waves size={12} aria-hidden="true" />
          <span>Fluid Satin Drape</span>
        </div>
        <h3 className={styles.title}>Silk Wave Fabric</h3>
        <p className={styles.description}>
          Anisotropic specular cloth simulation with continuous harmonic undulations. Touch or hover to ripple the silk weave.
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

        <div className={styles.controlGroup} role="radiogroup" aria-label="Silk sheen">
          <button
            type="button"
            className={`${styles.btn} ${sheen === "rose-quartz" ? styles.active : ""}`}
            onClick={() => setSheen("rose-quartz")}
            role="radio"
            aria-checked={sheen === "rose-quartz"}
          >
            <Palette size={13} aria-hidden="true" />
            <span>Rose Quartz</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${sheen === "onyx-pearl" ? styles.active : ""}`}
            onClick={() => setSheen("onyx-pearl")}
            role="radio"
            aria-checked={sheen === "onyx-pearl"}
          >
            <span>Onyx Pearl</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${sheen === "sapphire-drape" ? styles.active : ""}`}
            onClick={() => setSheen("sapphire-drape")}
            role="radio"
            aria-checked={sheen === "sapphire-drape"}
          >
            <span>Sapphire Drape</span>
          </button>
        </div>

        <div className={styles.controlGroup} role="radiogroup" aria-label="Airflow dynamics">
          <button
            type="button"
            className={`${styles.btn} ${drapeFlow === "gentle" ? styles.active : ""}`}
            onClick={() => setDrapeFlow("gentle")}
            role="radio"
            aria-checked={drapeFlow === "gentle"}
          >
            <span>Gentle Ripple</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${drapeFlow === "breeze" ? styles.active : ""}`}
            onClick={() => setDrapeFlow("breeze")}
            role="radio"
            aria-checked={drapeFlow === "breeze"}
          >
            <Wind size={13} aria-hidden="true" />
            <span>High Breeze</span>
          </button>
        </div>
      </div>
    </div>
  );
}

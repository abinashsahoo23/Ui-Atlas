"use client";

import { useEffect, useRef, useState } from "react";
import { Shapes, Play, Pause, Sparkles } from "lucide-react";
import styles from "./morphing-blur-geometry.module.css";

type MorphGeometry = "super-ellipse" | "astral-clover" | "polygon-star";

export default function MorphingBlurGeometry() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [geometry, setGeometry] = useState<MorphGeometry>("super-ellipse");
  const [blurMode, setBlurMode] = useState<"optical-soft" | "radiant-intense">("radiant-intense");

  const isPlayingRef = useRef(isPlaying);
  const geometryRef = useRef(geometry);
  const blurRef = useRef(blurMode);
  const pointerRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    geometryRef.current = geometry;
    blurRef.current = blurMode;
  }, [isPlaying, geometry, blurMode]);

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
        time += 0.016;

        ctx.fillStyle = "#04050d";
        ctx.fillRect(0, 0, width, height);

        const centerX = width * 0.5 + (pointerRef.current.x - 0.5) * 60;
        const centerY = height * 0.5 + (pointerRef.current.y - 0.5) * 60;
        const baseRadius = Math.min(width, height) * 0.28;

        ctx.save();
        ctx.globalCompositeOperation = "screen";

        const currentGeom = geometryRef.current;
        const currentBlur = blurRef.current;
        const blurPasses = currentBlur === "radiant-intense" ? 4 : 2;

        for (let pass = 0; pass < blurPasses; pass++) {
          const passRadius = baseRadius + pass * 16;
          const passAlpha = 0.5 / (pass + 1);

          ctx.beginPath();
          const vertices = 120;

          for (let i = 0; i <= vertices; i++) {
            const angle = (i / vertices) * Math.PI * 2;
            let rMod = 0;

            if (currentGeom === "super-ellipse") {
              rMod = Math.sin(angle * 4 + time * 2) * 25 + Math.cos(angle * 2 - time) * 15;
            } else if (currentGeom === "astral-clover") {
              rMod = Math.cos(angle * 6 + time * 2.5) * 35;
            } else {
              // Polygon star
              const k = Math.sin(angle * 8 + time * 3);
              rMod = (k > 0 ? 30 : -20) + Math.sin(time * 2) * 10;
            }

            const r = Math.max(20, passRadius + rMod);
            const x = centerX + Math.cos(angle) * r;
            const y = centerY + Math.sin(angle) * r;

            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();

          const grad = ctx.createRadialGradient(
            centerX,
            centerY,
            10,
            centerX,
            centerY,
            passRadius + 40
          );
          const hue = (260 + pass * 30 + time * 35) % 360;
          grad.addColorStop(0, `hsla(${hue}, 95%, 70%, ${passAlpha})`);
          grad.addColorStop(0.6, `hsla(${(hue + 40) % 360}, 90%, 55%, ${passAlpha * 0.5})`);
          grad.addColorStop(1, `hsla(${hue}, 90%, 40%, 0)`);

          ctx.fillStyle = grad;
          ctx.fill();

          ctx.strokeStyle = `hsla(${hue}, 95%, 85%, ${passAlpha * 1.5})`;
          ctx.lineWidth = 1.5;
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
    pointerRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  };

  const handlePointerLeave = () => {
    pointerRef.current = { x: 0.5, y: 0.5 };
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
          <Shapes size={12} aria-hidden="true" />
          <span>Harmonic Spline Morphism</span>
        </div>
        <h3 className={styles.title}>Morphing Blur Geometry</h3>
        <p className={styles.description}>
          Continuous parametric shape morphing with multi-pass focal blur dispersion. Move pointer to offset harmonic focal centers.
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

        <div className={styles.controlGroup} role="radiogroup" aria-label="Parametric contour">
          <button
            type="button"
            className={`${styles.btn} ${geometry === "super-ellipse" ? styles.active : ""}`}
            onClick={() => setGeometry("super-ellipse")}
            role="radio"
            aria-checked={geometry === "super-ellipse"}
          >
            <span>Super Ellipse</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${geometry === "astral-clover" ? styles.active : ""}`}
            onClick={() => setGeometry("astral-clover")}
            role="radio"
            aria-checked={geometry === "astral-clover"}
          >
            <Shapes size={13} aria-hidden="true" />
            <span>Astral Clover</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${geometry === "polygon-star" ? styles.active : ""}`}
            onClick={() => setGeometry("polygon-star")}
            role="radio"
            aria-checked={geometry === "polygon-star"}
          >
            <Sparkles size={13} aria-hidden="true" />
            <span>Harmonic Star</span>
          </button>
        </div>

        <div className={styles.controlGroup} role="radiogroup" aria-label="Blur pass">
          <button
            type="button"
            className={`${styles.btn} ${blurMode === "optical-soft" ? styles.active : ""}`}
            onClick={() => setBlurMode("optical-soft")}
            role="radio"
            aria-checked={blurMode === "optical-soft"}
          >
            <span>Soft 2-Pass</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${blurMode === "radiant-intense" ? styles.active : ""}`}
            onClick={() => setBlurMode("radiant-intense")}
            role="radio"
            aria-checked={blurMode === "radiant-intense"}
          >
            <span>Radiant 4-Pass</span>
          </button>
        </div>
      </div>
    </div>
  );
}

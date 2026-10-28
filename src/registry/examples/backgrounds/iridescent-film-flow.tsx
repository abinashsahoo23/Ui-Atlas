"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, Play, Pause, Disc, Eye } from "lucide-react";
import styles from "./iridescent-film-flow.module.css";

type FilmPalette = "opal-prism" | "oil-slick" | "aurora-pearl";

export default function IridescentFilmFlow() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [palette, setPalette] = useState<FilmPalette>("opal-prism");
  const [sheenPurity, setSheenPurity] = useState<"luminous" | "deep">("luminous");

  const isPlayingRef = useRef(isPlaying);
  const paletteRef = useRef(palette);
  const purityRef = useRef(sheenPurity);
  const pointerRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    paletteRef.current = palette;
    purityRef.current = sheenPurity;
  }, [isPlaying, palette, sheenPurity]);

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

    const RINGS = 22;

    const render = () => {
      if (isVisible && isPlayingRef.current && width > 0 && height > 0) {
        pointerRef.current.x += (pointerRef.current.targetX - pointerRef.current.x) * 0.05;
        pointerRef.current.y += (pointerRef.current.targetY - pointerRef.current.y) * 0.05;

        time += 0.014;

        ctx.fillStyle = "#080914";
        ctx.fillRect(0, 0, width, height);

        const centerX = width * 0.5 + (pointerRef.current.x - 0.5) * 100;
        const centerY = height * 0.5 + (pointerRef.current.y - 0.5) * 100;
        const maxRadius = Math.max(width, height) * 0.75;

        ctx.save();
        ctx.globalCompositeOperation = "screen";

        const currentPalette = paletteRef.current;

        for (let i = 0; i < RINGS; i++) {
          const ratio = i / RINGS;
          const radius = ratio * maxRadius;

          let hue = 0;
          if (currentPalette === "opal-prism") {
            hue = (ratio * 360 + time * 45) % 360;
          } else if (currentPalette === "oil-slick") {
            hue = (140 + ratio * 200 + Math.sin(time + ratio * 4) * 50) % 360;
          } else {
            hue = (260 + ratio * 160 + Math.cos(time + ratio * 5) * 40) % 360;
          }

          const alpha = purityRef.current === "luminous" ? 0.35 : 0.22;
          const grad = ctx.createRadialGradient(
            centerX + Math.cos(time + i * 0.3) * 30,
            centerY + Math.sin(time + i * 0.3) * 30,
            Math.max(0, radius - 40),
            centerX,
            centerY,
            radius + 40
          );

          grad.addColorStop(0, `hsla(${hue}, 90%, 65%, 0)`);
          grad.addColorStop(0.5, `hsla(${hue}, 95%, 70%, ${alpha})`);
          grad.addColorStop(1, `hsla(${(hue + 45) % 360}, 90%, 60%, 0)`);

          ctx.beginPath();
          ctx.fillStyle = grad;

          // Non-circular organic boundary distortion
          const points = 32;
          for (let p = 0; p <= points; p++) {
            const angle = (p / points) * Math.PI * 2;
            const wobble = Math.sin(angle * 4 + time * 2 + i * 0.5) * 25 +
                          Math.cos(angle * 6 - time * 1.5) * 15;
            const r = Math.max(0, radius + wobble);
            const x = centerX + Math.cos(angle) * r;
            const y = centerY + Math.sin(angle) * r;

            if (p === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.fill();
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
          <Sparkles size={12} aria-hidden="true" />
          <span>Thin-Film Wave Interference</span>
        </div>
        <h3 className={styles.title}>Iridescent Film Flow</h3>
        <p className={styles.description}>
          Optical phase-shift interference generating iridescent pearlescent fluid rings. Move your cursor to deflect fluid convection currents.
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

        <div className={styles.controlGroup} role="radiogroup" aria-label="Interference palette">
          <button
            type="button"
            className={`${styles.btn} ${palette === "opal-prism" ? styles.active : ""}`}
            onClick={() => setPalette("opal-prism")}
            role="radio"
            aria-checked={palette === "opal-prism"}
          >
            <Disc size={13} aria-hidden="true" />
            <span>Opal Prism</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${palette === "oil-slick" ? styles.active : ""}`}
            onClick={() => setPalette("oil-slick")}
            role="radio"
            aria-checked={palette === "oil-slick"}
          >
            <Eye size={13} aria-hidden="true" />
            <span>Oil Slick</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${palette === "aurora-pearl" ? styles.active : ""}`}
            onClick={() => setPalette("aurora-pearl")}
            role="radio"
            aria-checked={palette === "aurora-pearl"}
          >
            <Sparkles size={13} aria-hidden="true" />
            <span>Aurora Pearl</span>
          </button>
        </div>

        <div className={styles.controlGroup} role="radiogroup" aria-label="Luminance purity">
          <button
            type="button"
            className={`${styles.btn} ${sheenPurity === "luminous" ? styles.active : ""}`}
            onClick={() => setSheenPurity("luminous")}
            role="radio"
            aria-checked={sheenPurity === "luminous"}
          >
            <span>Luminous</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${sheenPurity === "deep" ? styles.active : ""}`}
            onClick={() => setSheenPurity("deep")}
            role="radio"
            aria-checked={sheenPurity === "deep"}
          >
            <span>Deep Sheen</span>
          </button>
        </div>
      </div>
    </div>
  );
}

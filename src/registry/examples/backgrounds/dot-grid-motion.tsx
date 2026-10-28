"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Grid } from 'lucide-react';
import styles from "./dot-grid-motion.module.css";

const PALETTES = [
  { id: "slats", name: "Steel Slats", dotCol: [0.65, 0.72, 0.82], bg: "#06050a" },
  { id: "cyan", name: "Cyan Matrix", dotCol: [0.06, 0.75, 0.95], bg: "#040b14" },
  { id: "violet", name: "Neon Violet", dotCol: [0.75, 0.25, 0.95], bg: "#100318" },
];

export default function DotGridMotion() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [paletteIdx, setPaletteIdx] = useState(0);
  const [spacing, setSpacing] = useState(24);
  const [distortionRadius, setDistortionRadius] = useState(140);

  const animRef = useRef<number | null>(null);
  const isPlayingRef = useRef(isPlaying);
  const currentPal = PALETTES[paletteIdx];
  const palRef = useRef(currentPal);
  const spacingRef = useRef(spacing);
  const distRadiusRef = useRef(distortionRadius);
  const mouseRef = useRef({ x: -1000, y: -1000, isHovered: false });

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    palRef.current = currentPal;
    spacingRef.current = spacing;
    distRadiusRef.current = distortionRadius;
  }, [isPlaying, currentPal, spacing, distortionRadius]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const startTime = performance.now();
    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    if (containerRef.current) observer.observe(containerRef.current);

    const render = (time: number) => {
      if (isVisible && isPlayingRef.current) {
        ctx.clearRect(0, 0, width, height);

        const sp = spacingRef.current;
        const radiusLimit = distRadiusRef.current;
        const t = (time - startTime) * 0.002;
        const col = palRef.current.dotCol;
        const rgb = `${Math.floor(col[0] * 255)}, ${Math.floor(col[1] * 255)}, ${Math.floor(col[2] * 255)}`;

        const cols = Math.ceil(width / sp) + 1;
        const rows = Math.ceil(height / sp) + 1;

        const { x: mx, y: my, isHovered } = mouseRef.current;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            let x = c * sp;
            let y = r * sp;

            // Ambient gentle wave moving across the matrix
            const wave = Math.sin(c * 0.18 + t * 0.8) * Math.cos(r * 0.12 + t * 0.6);
            let alpha = 0.22 + Math.max(0, wave) * 0.42;

            let sw = 7.0;
            let sh = 17.0;

            if (isHovered) {
              const dx = x - mx;
              const dy = y - my;
              const dist = Math.hypot(dx, dy);

              if (dist < radiusLimit && dist > 0.1) {
                const factor = 1.0 - dist / radiusLimit;
                alpha = Math.min(1.0, alpha + factor * 0.65);
                sw += factor * 1.5;
                sh += factor * 2.5;
                x += (dx / dist) * factor * 12.0;
                y += (dy / dist) * factor * 12.0;
              }
            }

            const rSlat = sw * 0.45;
            ctx.beginPath();
            if (typeof ctx.roundRect === "function") {
              ctx.roundRect(x - sw / 2, y - sh / 2, sw, sh, rSlat);
            } else {
              ctx.rect(x - sw / 2, y - sh / 2, sw, sh);
            }
            ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
            ctx.fill();
          }
        }
      }

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
    mouseRef.current.isHovered = true;
  };

  const handlePointerLeave = () => {
    mouseRef.current.isHovered = false;
  };

  return (
    <div
      ref={containerRef}
      className={styles.container}
      style={{ backgroundColor: currentPal.bg }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

      <div className={styles.hud} data-preview-chrome>
        <div className={styles.infoBadge} data-preview-chrome>
          <Grid size={14} className={styles.icon} />
          <span className={styles.title}>DOT GRID MOTION // ELASTIC MATRIX</span>
        </div>

        <div className={styles.controls} data-preview-chrome>
          <button
            type="button"
            className={styles.controlBtn}
            onClick={() => setIsPlaying((p) => !p)}
            aria-label={isPlaying ? "Pause grid" : "Play grid"}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>

          <button
            type="button"
            className={styles.controlBtn}
            onClick={() => setPaletteIdx((idx) => (idx + 1) % PALETTES.length)}
            aria-label="Cycle grid palette"
          >
            <span
              className={styles.dotIndicator}
              style={{
                backgroundColor: `rgb(${Math.floor(currentPal.dotCol[0] * 255)}, ${Math.floor(
                  currentPal.dotCol[1] * 255
                )}, ${Math.floor(currentPal.dotCol[2] * 255)})`,
              }}
            />
          </button>

          <div className={styles.sliderGroup}>
            <span className={styles.label}>PITCH</span>
            <input
              type="range"
              min="16"
              max="36"
              step="2"
              value={spacing}
              onChange={(e) => setSpacing(parseInt(e.target.value, 10))}
              className={styles.slider}
              aria-label="Grid pitch spacing"
            />
          </div>

          <div className={styles.sliderGroup}>
            <span className={styles.label}>FORCE</span>
            <input
              type="range"
              min="80"
              max="220"
              step="10"
              value={distortionRadius}
              onChange={(e) => setDistortionRadius(parseInt(e.target.value, 10))}
              className={styles.slider}
              aria-label="Distortion force radius"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

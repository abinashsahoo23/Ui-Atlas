"use client";

import { useEffect, useRef, useState } from "react";
import { CloudSnow, Play, Pause, Grid, Wind } from "lucide-react";
import styles from "./pixel-grid-snow.module.css";

type SnowFlurry = "flurry" | "blizzard";

interface PixelFlake {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  alpha: number;
  color: string;
}

export default function PixelGridSnow() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [flurry, setFlurry] = useState<SnowFlurry>("flurry");
  const [pixelSize, setPixelSize] = useState<"crisp-4px" | "chunky-8px">("crisp-4px");

  const isPlayingRef = useRef(isPlaying);
  const flurryRef = useRef(flurry);
  const pixelSizeRef = useRef(pixelSize);
  const pointerRef = useRef({ x: 0.5, y: 0.5, windX: 0 });

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    flurryRef.current = flurry;
    pixelSizeRef.current = pixelSize;
  }, [isPlaying, flurry, pixelSize]);

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

    const flakes: PixelFlake[] = [];

    const initFlakes = () => {
      flakes.length = 0;
      const count = flurryRef.current === "blizzard" ? 280 : 130;
      const baseGrid = pixelSizeRef.current === "chunky-8px" ? 8 : 4;

      for (let i = 0; i < count; i++) {
        flakes.push({
          x: Math.floor((Math.random() * width) / baseGrid) * baseGrid,
          y: Math.floor((Math.random() * height) / baseGrid) * baseGrid,
          size: baseGrid,
          speedY: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 0.8,
          alpha: Math.random() * 0.7 + 0.3,
          color: Math.random() > 0.3 ? "#ffffff" : "#bae6fd",
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
      initFlakes();
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
        ctx.fillStyle = "#050811";
        ctx.fillRect(0, 0, width, height);

        const baseGrid = pixelSizeRef.current === "chunky-8px" ? 8 : 4;
        const targetWind = (pointerRef.current.x - 0.5) * 3;
        pointerRef.current.windX += (targetWind - pointerRef.current.windX) * 0.05;

        // Subtle background grid lattice
        ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
        ctx.lineWidth = 1;
        for (let gx = 0; gx < width; gx += baseGrid * 6) {
          ctx.beginPath();
          ctx.moveTo(gx, 0);
          ctx.lineTo(gx, height);
          ctx.stroke();
        }
        for (let gy = 0; gy < height; gy += baseGrid * 6) {
          ctx.beginPath();
          ctx.moveTo(0, gy);
          ctx.lineTo(width, gy);
          ctx.stroke();
        }

        // Render quantized pixel snow particles
        for (let i = 0; i < flakes.length; i++) {
          const f = flakes[i];
          f.y += f.speedY;
          f.x += f.speedX + pointerRef.current.windX;

          if (f.y >= height) {
            f.y = -baseGrid;
            f.x = Math.floor((Math.random() * width) / baseGrid) * baseGrid;
          }
          if (f.x < -baseGrid) f.x = width;
          if (f.x > width) f.x = -baseGrid;

          // Snap to virtual grid coordinate
          const snappedX = Math.floor(f.x / baseGrid) * baseGrid;
          const snappedY = Math.floor(f.y / baseGrid) * baseGrid;

          ctx.fillStyle = f.color;
          ctx.globalAlpha = f.alpha;
          ctx.fillRect(snappedX, snappedY, baseGrid, baseGrid);
        }
        ctx.globalAlpha = 1;
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
    pointerRef.current.x = (e.clientX - rect.left) / rect.width;
    pointerRef.current.y = (e.clientY - rect.top) / rect.height;
  };

  const handlePointerLeave = () => {
    pointerRef.current.x = 0.5;
    pointerRef.current.y = 0.5;
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
          <CloudSnow size={12} aria-hidden="true" />
          <span>Quantized 8-Bit Weather</span>
        </div>
        <h3 className={styles.title}>Pixel Grid Snow</h3>
        <p className={styles.description}>
          Discrete raster lattice precipitation with interactive pointer wind deflection. Pure integer grid coordinate snapping.
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

        <div className={styles.controlGroup} role="radiogroup" aria-label="Precipitation rate">
          <button
            type="button"
            className={`${styles.btn} ${flurry === "flurry" ? styles.active : ""}`}
            onClick={() => setFlurry("flurry")}
            role="radio"
            aria-checked={flurry === "flurry"}
          >
            <span>Flurry Drift</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${flurry === "blizzard" ? styles.active : ""}`}
            onClick={() => setFlurry("blizzard")}
            role="radio"
            aria-checked={flurry === "blizzard"}
          >
            <Wind size={13} aria-hidden="true" />
            <span>Heavy Blizzard</span>
          </button>
        </div>

        <div className={styles.controlGroup} role="radiogroup" aria-label="Pixel grid resolution">
          <button
            type="button"
            className={`${styles.btn} ${pixelSize === "crisp-4px" ? styles.active : ""}`}
            onClick={() => setPixelSize("crisp-4px")}
            role="radio"
            aria-checked={pixelSize === "crisp-4px"}
          >
            <Grid size={13} aria-hidden="true" />
            <span>4px Subgrid</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${pixelSize === "chunky-8px" ? styles.active : ""}`}
            onClick={() => setPixelSize("chunky-8px")}
            role="radio"
            aria-checked={pixelSize === "chunky-8px"}
          >
            <span>8px Chunky</span>
          </button>
        </div>
      </div>
    </div>
  );
}

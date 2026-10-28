"use client";

import { useEffect, useRef, useState } from "react";
import { Terminal, RefreshCw, Palette } from "lucide-react";
import styles from "./ascii-matrix-transform.module.css";

const PHRASES = ["KINETIC", "SPECIMEN", "CYBERNETIC", "FROZEN MUSIC"];
const CHARSETS = {
  standard: " .:-=+*#%@",
  blocks: " ░▒▓█",
  binary: " 01",
};

export default function AsciiMatrixTransform() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charsetKey, setCharsetKey] = useState<keyof typeof CHARSETS>("standard");
  const [density, setDensity] = useState<"fine" | "chunky">("fine");

  const phraseRef = useRef(PHRASES[phraseIdx]);
  const charsetRef = useRef(CHARSETS[charsetKey]);
  const densityRef = useRef(density);
  const pointerRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    phraseRef.current = PHRASES[phraseIdx];
    charsetRef.current = CHARSETS[charsetKey];
    densityRef.current = density;
  }, [phraseIdx, charsetKey, density]);

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

    // Offscreen canvas for rendering source text
    const offCanvas = document.createElement("canvas");
    const offCtx = offCanvas.getContext("2d", { willReadFrequently: true });

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      offCanvas.width = width;
      offCanvas.height = height;
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => updateSize());
    resizeObserver.observe(container);

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(container);

    const render = () => {
      if (isVisible && offCtx && width > 0 && height > 0) {
        time += 0.02;

        const currentPhrase = phraseRef.current;
        const currentCharset = charsetRef.current;
        const cellSize = densityRef.current === "fine" ? 8 : 14;

        // Render source text on offscreen canvas
        offCtx.fillStyle = "#000000";
        offCtx.fillRect(0, 0, width, height);

        const fontSize = Math.min(width * 0.16, 120);
        offCtx.font = `900 ${fontSize}px "Inter", sans-serif`;
        offCtx.textAlign = "center";
        offCtx.textBaseline = "middle";
        offCtx.fillStyle = "#ffffff";

        const textY = height * 0.5 + Math.sin(time * 1.5) * 15;
        offCtx.fillText(currentPhrase, width * 0.5, textY);

        // Sample offscreen raster
        const imgData = offCtx.getImageData(0, 0, width, height);
        const data = imgData.data;

        // Render ASCII glyph matrix on main canvas
        ctx.fillStyle = "#05060b";
        ctx.fillRect(0, 0, width, height);

        ctx.font = `${cellSize}px "JetBrains Mono", monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const pX = pointerRef.current.x * width;
        const pY = pointerRef.current.y * height;

        for (let y = cellSize * 0.5; y < height; y += cellSize) {
          for (let x = cellSize * 0.5; x < width; x += cellSize) {
            const pixelX = Math.floor(x);
            const pixelY = Math.floor(y);
            const idx = (pixelY * width + pixelX) * 4;

            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const luminance = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

            // Interactive wave ripple deflection
            const dist = Math.hypot(x - pX, y - pY);
            const ripple = Math.max(0, 1 - dist / 150) * Math.sin(dist * 0.1 - time * 5);
            const effectiveLum = Math.min(1, Math.max(0, luminance + ripple * 0.4));

            if (effectiveLum > 0.08) {
              const charIdx = Math.floor(effectiveLum * (currentCharset.length - 1));
              const char = currentCharset[charIdx];

              ctx.fillStyle = effectiveLum > 0.6
                ? "#4ade80"
                : `rgba(74, 222, 128, ${effectiveLum * 0.8})`;

              ctx.fillText(char, x, y);
            }
          }
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
    };
  };

  const handleCyclePhrase = () => {
    setPhraseIdx((prev) => (prev + 1) % PHRASES.length);
  };

  return (
    <div
      ref={containerRef}
      className={styles.container}
      onPointerMove={handlePointerMove}
    >
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

      <div className={styles.overlay} data-preview-chrome>
        <div className={styles.badge}>
          <Terminal size={12} aria-hidden="true" />
          <span>Luminance Quantization Matrix</span>
        </div>
        <h3 className={styles.title}>ASCII Matrix Transform</h3>
        <p className={styles.description}>
          High-performance canvas glyph rasterizer converting vector typography into dynamic ASCII brightness patterns with ripple displacement.
        </p>
      </div>

      <div className={styles.controls} data-preview-chrome>
        <div className={styles.controlGroup} role="toolbar" aria-label="Phrase controls">
          <button
            type="button"
            className={styles.btn}
            onClick={handleCyclePhrase}
          >
            <RefreshCw size={13} aria-hidden="true" />
            <span>Phrase ({phraseIdx + 1}/{PHRASES.length})</span>
          </button>
        </div>

        <div className={styles.controlGroup} role="radiogroup" aria-label="Character set">
          <button
            type="button"
            className={`${styles.btn} ${charsetKey === "standard" ? styles.active : ""}`}
            onClick={() => setCharsetKey("standard")}
            role="radio"
            aria-checked={charsetKey === "standard"}
          >
            <span>ASCII Classic</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${charsetKey === "blocks" ? styles.active : ""}`}
            onClick={() => setCharsetKey("blocks")}
            role="radio"
            aria-checked={charsetKey === "blocks"}
          >
            <Palette size={13} aria-hidden="true" />
            <span>Unicode Blocks</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${charsetKey === "binary" ? styles.active : ""}`}
            onClick={() => setCharsetKey("binary")}
            role="radio"
            aria-checked={charsetKey === "binary"}
          >
            <span>Binary 0/1</span>
          </button>
        </div>

        <div className={styles.controlGroup} role="radiogroup" aria-label="Matrix cell density">
          <button
            type="button"
            className={`${styles.btn} ${density === "fine" ? styles.active : ""}`}
            onClick={() => setDensity("fine")}
            role="radio"
            aria-checked={density === "fine"}
          >
            <span>Fine Matrix (8px)</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${density === "chunky" ? styles.active : ""}`}
            onClick={() => setDensity("chunky")}
            role="radio"
            aria-checked={density === "chunky"}
          >
            <span>Chunky Grid (14px)</span>
          </button>
        </div>
      </div>
    </div>
  );
}

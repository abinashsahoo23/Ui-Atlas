"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Terminal, Shuffle } from 'lucide-react';
import styles from "./letter-glitch.module.css";

const CHAR_SETS = {
  matrix: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$#@&%*<>[]{}|/\\+-=",
  katakana: "ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ0123456789",
  ascii: ".:-=+*#%@",
};

const THEMES = [
  { id: "emerald", name: "Cyber Green", col: "#10b981", activeCol: "#6ee7b7", bg: "#02120b" },
  { id: "amber", name: "Amber Terminal", col: "#f59e0b", activeCol: "#fde68a", bg: "#130902" },
  { id: "cyan", name: "Cyan Ghost", col: "#06b6d4", activeCol: "#a5f3fc", bg: "#021217" },
];

export default function LetterGlitch() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [charSetKey, setCharSetKey] = useState<keyof typeof CHAR_SETS>("matrix");
  const [themeIdx, setThemeIdx] = useState(0);
  const [glitchSpeed, setGlitchSpeed] = useState(45);

  const animRef = useRef<number | null>(null);
  const isPlayingRef = useRef(isPlaying);
  const currentTheme = THEMES[themeIdx];
  const themeRef = useRef(currentTheme);
  const charsRef = useRef(CHAR_SETS[charSetKey]);
  const speedRef = useRef(glitchSpeed);
  const mouseRef = useRef({ col: -1, row: -1, isHovered: false });

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    themeRef.current = currentTheme;
    charsRef.current = CHAR_SETS[charSetKey];
    speedRef.current = glitchSpeed;
  }, [isPlaying, currentTheme, charSetKey, glitchSpeed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fontSize = 16;
    let cols = 0;
    let rows = 0;

    type Cell = {
      char: string;
      alpha: number;
      isGlitching: boolean;
      timer: number;
    };

    let grid: Cell[][] = [];

    const initGrid = () => {
      grid = [];
      const chars = charsRef.current;
      for (let r = 0; r < rows; r++) {
        const row: Cell[] = [];
        for (let c = 0; c < cols; c++) {
          row.push({
            char: chars[Math.floor(Math.random() * chars.length)],
            alpha: Math.random() * 0.5 + 0.15,
            isGlitching: Math.random() < 0.08,
            timer: Math.random() * 60,
          });
        }
        grid.push(row);
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.scale(dpr, dpr);

      cols = Math.ceil(rect.width / fontSize);
      rows = Math.ceil(rect.height / fontSize);
      initGrid();
    };
    resize();
    window.addEventListener("resize", resize);

    let lastUpdate = performance.now();
    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    if (containerRef.current) observer.observe(containerRef.current);

    const render = (time: number) => {
      if (isVisible && isPlayingRef.current) {
        const delta = time - lastUpdate;
        if (delta >= speedRef.current) {
          lastUpdate = time;

          const rect = canvas.getBoundingClientRect();
          ctx.clearRect(0, 0, rect.width, rect.height);
          ctx.font = `${fontSize - 2}px "JetBrains Mono", monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          const chars = charsRef.current;
          const { col: mCol, row: mRow, isHovered } = mouseRef.current;

          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              const cell = grid[r]?.[c];
              if (!cell) continue;

              // Proximity to mouse
              let dist = 999;
              if (isHovered) {
                dist = Math.hypot(mCol - c, mRow - r);
              }

              // Random character scrambling
              if (cell.isGlitching || dist < 4 || Math.random() < 0.04) {
                cell.char = chars[Math.floor(Math.random() * chars.length)];
              }

              const isDirect = dist < 2.5;
              const isNear = dist < 5.0;

              const x = c * fontSize + fontSize * 0.5;
              const y = r * fontSize + fontSize * 0.5;

              if (isDirect) {
                ctx.fillStyle = themeRef.current.activeCol;
                ctx.shadowColor = themeRef.current.activeCol;
                ctx.shadowBlur = 8;
              } else if (isNear) {
                ctx.fillStyle = themeRef.current.activeCol;
                ctx.shadowBlur = 0;
              } else {
                ctx.fillStyle = themeRef.current.col;
                ctx.shadowBlur = 0;
              }

              ctx.globalAlpha = isDirect ? 1.0 : isNear ? 0.85 : cell.alpha;
              ctx.fillText(cell.char, x, y);
            }
          }
          ctx.globalAlpha = 1.0;
          ctx.shadowBlur = 0;
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
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseRef.current.col = Math.floor(x / 16);
    mouseRef.current.row = Math.floor(y / 16);
    mouseRef.current.isHovered = true;
  };

  const handlePointerLeave = () => {
    mouseRef.current.isHovered = false;
  };

  return (
    <div
      ref={containerRef}
      className={styles.container}
      style={{ backgroundColor: currentTheme.bg }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

      <div className={styles.hud} data-preview-chrome>
        <div className={styles.infoBadge} data-preview-chrome>
          <Terminal size={14} className={styles.icon} />
          <span className={styles.title}>LETTER GLITCH // CYBERNETIC BUFFER</span>
        </div>

        <div className={styles.controls} data-preview-chrome>
          <button
            type="button"
            className={styles.controlBtn}
            onClick={() => setIsPlaying((p) => !p)}
            aria-label={isPlaying ? "Pause matrix" : "Play matrix"}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>

          <button
            type="button"
            className={styles.controlBtn}
            onClick={() => {
              const keys = Object.keys(CHAR_SETS) as (keyof typeof CHAR_SETS)[];
              const next = keys[(keys.indexOf(charSetKey) + 1) % keys.length];
              setCharSetKey(next);
            }}
            aria-label="Cycle character set"
          >
            <Shuffle size={14} />
          </button>

          <button
            type="button"
            className={styles.controlBtn}
            onClick={() => setThemeIdx((idx) => (idx + 1) % THEMES.length)}
            aria-label="Cycle terminal phosphors"
          >
            <span
              className={styles.dotIndicator}
              style={{ backgroundColor: currentTheme.col }}
            />
          </button>

          <div className={styles.sliderGroup}>
            <span className={styles.label}>TICK</span>
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={glitchSpeed}
              onChange={(e) => setGlitchSpeed(parseInt(e.target.value, 10))}
              className={styles.slider}
              aria-label="Glitch refresh rate"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

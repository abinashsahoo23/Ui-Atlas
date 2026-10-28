"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, Zap, Flame } from "lucide-react";
import styles from "./radial-spark-burst.module.css";

type SparkPalette = "golden-ember" | "electric-cyan" | "spectral-flare";

interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export default function RadialSparkBurst() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [palette, setPalette] = useState<SparkPalette>("golden-ember");
  const [sparkShape, setSparkShape] = useState<"streak" | "star">("streak");
  const [burstCount, setBurstCount] = useState(0);

  const paletteRef = useRef(palette);
  const shapeRef = useRef(sparkShape);
  const particlesRef = useRef<SparkParticle[]>([]);

  useEffect(() => {
    paletteRef.current = palette;
    shapeRef.current = sparkShape;
  }, [palette, sparkShape]);

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
      if (isVisible && width > 0 && height > 0) {
        ctx.clearRect(0, 0, width, height);

        const particles = particlesRef.current;
        const currentShape = shapeRef.current;

        ctx.save();
        ctx.globalCompositeOperation = "screen";

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.12; // Gravity
          p.vx *= 0.96; // Air drag
          p.vy *= 0.96;
          p.life--;

          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }

          const alpha = p.life / p.maxLife;
          ctx.fillStyle = p.color;
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = alpha;

          if (currentShape === "streak") {
            ctx.beginPath();
            ctx.lineWidth = p.size;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - p.vx * 3.5, p.y - p.vy * 3.5);
            ctx.stroke();
          } else {
            // Star flare shape
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
            ctx.fill();
          }
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

  const spawnSparks = (x: number, y: number) => {
    const count = 38;
    const currentPalette = paletteRef.current;

    let colors = ["#fbbf24", "#f59e0b", "#fef08a", "#ffffff"];
    if (currentPalette === "electric-cyan") {
      colors = ["#38bdf8", "#06b6d4", "#e0f2fe", "#ffffff"];
    } else if (currentPalette === "spectral-flare") {
      colors = ["#ec4899", "#a855f7", "#38bdf8", "#fbbf24"];
    }

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      const maxLife = Math.floor(Math.random() * 30 + 25);

      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        life: maxLife,
        maxLife,
        size: Math.random() * 2.5 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    setBurstCount((prev) => prev + 1);
  };

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    spawnSparks(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const btnRect = e.currentTarget.getBoundingClientRect();
      const centerX = btnRect.left - rect.left + btnRect.width * 0.5;
      const centerY = btnRect.top - rect.top + btnRect.height * 0.5;
      spawnSparks(centerX, centerY);
    }
  };

  return (
    <div
      ref={containerRef}
      className={styles.container}
      onClick={handleContainerClick}
    >
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

      <div className={styles.centerStage}>
        <button
          type="button"
          className={styles.interactiveButton}
          onClick={handleButtonClick}
        >
          <Sparkles size={18} aria-hidden="true" />
          <span>Ignite Reaction Impulse ({burstCount})</span>
        </button>
      </div>

      <div className={styles.overlay} data-preview-chrome>
        <div className={styles.badge}>
          <Flame size={12} aria-hidden="true" />
          <span>Ballistic Particle Physics</span>
        </div>
        <h3 className={styles.title}>Radial Spark Burst</h3>
        <p className={styles.description}>
          Container-scoped physical particle ignition with velocity drag and gravitational deflection. Click button or tap anywhere on the stage.
        </p>
      </div>

      <div className={styles.controls} data-preview-chrome onClick={(e) => e.stopPropagation()}>
        <div className={styles.controlGroup} role="radiogroup" aria-label="Spark palette">
          <button
            type="button"
            className={`${styles.btn} ${palette === "golden-ember" ? styles.active : ""}`}
            onClick={() => setPalette("golden-ember")}
            role="radio"
            aria-checked={palette === "golden-ember"}
          >
            <Flame size={13} aria-hidden="true" />
            <span>Golden Ember</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${palette === "electric-cyan" ? styles.active : ""}`}
            onClick={() => setPalette("electric-cyan")}
            role="radio"
            aria-checked={palette === "electric-cyan"}
          >
            <Zap size={13} aria-hidden="true" />
            <span>Electric Cyan</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${palette === "spectral-flare" ? styles.active : ""}`}
            onClick={() => setPalette("spectral-flare")}
            role="radio"
            aria-checked={palette === "spectral-flare"}
          >
            <Sparkles size={13} aria-hidden="true" />
            <span>Spectral Flare</span>
          </button>
        </div>

        <div className={styles.controlGroup} role="radiogroup" aria-label="Particle shape">
          <button
            type="button"
            className={`${styles.btn} ${sparkShape === "streak" ? styles.active : ""}`}
            onClick={() => setSparkShape("streak")}
            role="radio"
            aria-checked={sparkShape === "streak"}
          >
            <span>Ballistic Streaks</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${sparkShape === "star" ? styles.active : ""}`}
            onClick={() => setSparkShape("star")}
            role="radio"
            aria-checked={sparkShape === "star"}
          >
            <span>Focal Spark Stars</span>
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, Play, Pause, Palette } from "lucide-react";
import styles from "./elastic-particle-trail.module.css";

interface TrailNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  hue: number;
}

export default function ElasticParticleTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [trailTheme, setTrailTheme] = useState<"cyan-wave" | "prismatic" | "fire">("cyan-wave");

  const isPlayingRef = useRef(isPlaying);
  const themeRef = useRef(trailTheme);
  const nodesRef = useRef<TrailNode[]>([]);
  const pointerRef = useRef({ x: 0.5, y: 0.5, prevX: 0.5, prevY: 0.5, active: false });

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    themeRef.current = trailTheme;
  }, [isPlaying, trailTheme]);

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
      if (isVisible && isPlayingRef.current && width > 0 && height > 0) {
        ctx.fillStyle = "rgba(5, 7, 17, 0.25)";
        ctx.fillRect(0, 0, width, height);

        const nodes = nodesRef.current;
        const currentTheme = themeRef.current;

        // Spawn particles if pointer is active
        if (pointerRef.current.active) {
          const dx = pointerRef.current.x - pointerRef.current.prevX;
          const dy = pointerRef.current.y - pointerRef.current.prevY;
          const speed = Math.hypot(dx, dy);

          if (speed > 0.001) {
            let baseHue = 195;
            if (currentTheme === "prismatic") {
              baseHue = (Date.now() * 0.1) % 360;
            } else if (currentTheme === "fire") {
              baseHue = 25;
            }

            nodes.push({
              x: pointerRef.current.x * width,
              y: pointerRef.current.y * height,
              vx: (Math.random() - 0.5) * 2 - dx * 8,
              vy: (Math.random() - 0.5) * 2 - dy * 8,
              radius: Math.min(18, Math.max(4, speed * 250)),
              alpha: 1.0,
              hue: baseHue,
            });
          }
          pointerRef.current.prevX = pointerRef.current.x;
          pointerRef.current.prevY = pointerRef.current.y;
        }

        ctx.save();
        ctx.globalCompositeOperation = "screen";

        // Update and draw spring trail nodes
        for (let i = nodes.length - 1; i >= 0; i--) {
          const n = nodes[i];
          n.x += n.vx;
          n.y += n.vy;
          n.vx *= 0.94;
          n.vy *= 0.94;
          n.alpha *= 0.92;
          n.radius *= 0.96;

          if (n.alpha < 0.04) {
            nodes.splice(i, 1);
            continue;
          }

          ctx.beginPath();
          const grad = ctx.createRadialGradient(n.x, n.y, 1, n.x, n.y, n.radius);
          grad.addColorStop(0, `hsla(${n.hue}, 95%, 75%, ${n.alpha})`);
          grad.addColorStop(0.6, `hsla(${(n.hue + 25) % 360}, 90%, 55%, ${n.alpha * 0.4})`);
          grad.addColorStop(1, `hsla(${n.hue}, 90%, 40%, 0)`);

          ctx.fillStyle = grad;
          ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
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
    pointerRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
      prevX: pointerRef.current.active ? pointerRef.current.x : (e.clientX - rect.left) / rect.width,
      prevY: pointerRef.current.active ? pointerRef.current.y : (e.clientY - rect.top) / rect.height,
      active: true,
    };
  };

  const handlePointerLeave = () => {
    pointerRef.current.active = false;
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
          <span>Elastic Spring Particle Emitter</span>
        </div>
        <h3 className={styles.title}>Elastic Particle Trail</h3>
        <p className={styles.description}>
          Velocity-sensitive particle trailing matrix with momentum dampening and chromatic radial fading. Move cursor inside the stage.
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

        <div className={styles.controlGroup} role="radiogroup" aria-label="Trail colorway">
          <button
            type="button"
            className={`${styles.btn} ${trailTheme === "cyan-wave" ? styles.active : ""}`}
            onClick={() => setTrailTheme("cyan-wave")}
            role="radio"
            aria-checked={trailTheme === "cyan-wave"}
          >
            <span>Cyan Flux</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${trailTheme === "prismatic" ? styles.active : ""}`}
            onClick={() => setTrailTheme("prismatic")}
            role="radio"
            aria-checked={trailTheme === "prismatic"}
          >
            <Palette size={13} aria-hidden="true" />
            <span>Prismatic Sweep</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${trailTheme === "fire" ? styles.active : ""}`}
            onClick={() => setTrailTheme("fire")}
            role="radio"
            aria-checked={trailTheme === "fire"}
          >
            <span>Solar Fire</span>
          </button>
        </div>
      </div>
    </div>
  );
}

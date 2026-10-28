"use client";

import { useEffect, useRef, useState } from "react";
import { Droplet, Play, Pause, Waves, Compass } from "lucide-react";
import styles from "./caustics-ripple-grid.module.css";

type OceanicDepth = "shallow-lagoon" | "deep-trench" | "bioluminescent";

interface RippleWave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  intensity: number;
}

export default function CausticsRippleGrid() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [depth, setDepth] = useState<OceanicDepth>("shallow-lagoon");
  const [clarity, setClarity] = useState<"crystal" | "diffused">("crystal");

  const isPlayingRef = useRef(isPlaying);
  const depthRef = useRef(depth);
  const clarityRef = useRef(clarity);
  const pointerRef = useRef({ x: 0.5, y: 0.5 });
  const ripplesRef = useRef<RippleWave[]>([]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    depthRef.current = depth;
    clarityRef.current = clarity;
  }, [isPlaying, depth, clarity]);

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
        time += 0.015;

        // Base ocean background
        const currentDepth = depthRef.current;
        if (currentDepth === "shallow-lagoon") {
          ctx.fillStyle = "#03141a";
        } else if (currentDepth === "deep-trench") {
          ctx.fillStyle = "#020712";
        } else {
          ctx.fillStyle = "#0b051a";
        }
        ctx.fillRect(0, 0, width, height);

        // Update ripple wave fronts
        const ripples = ripplesRef.current;
        for (let r = ripples.length - 1; r >= 0; r--) {
          const w = ripples[r];
          w.radius += 3.2;
          w.intensity *= 0.96;
          if (w.intensity < 0.02 || w.radius > w.maxRadius) {
            ripples.splice(r, 1);
          }
        }

        const gridStep = 24;
        const cols = Math.ceil(width / gridStep) + 1;
        const rows = Math.ceil(height / gridStep) + 1;

        ctx.save();
        ctx.globalCompositeOperation = "screen";

        let strokeColor = "rgba(45, 212, 191, 0.25)";
        let causticHighlight = "rgba(204, 251, 241, 0.6)";
        if (currentDepth === "deep-trench") {
          strokeColor = "rgba(56, 189, 248, 0.22)";
          causticHighlight = "rgba(224, 242, 254, 0.55)";
        } else if (currentDepth === "bioluminescent") {
          strokeColor = "rgba(168, 85, 247, 0.25)";
          causticHighlight = "rgba(245, 208, 254, 0.6)";
        }

        ctx.lineWidth = clarityRef.current === "crystal" ? 1.4 : 2.5;

        // Calculate caustics wave distortion lattice
        for (let y = 0; y < rows; y++) {
          ctx.beginPath();
          ctx.strokeStyle = strokeColor;

          for (let x = 0; x < cols; x++) {
            const px = x * gridStep;
            const py = y * gridStep;

            // Interference wave equation
            const wave1 = Math.sin(px * 0.025 + time * 1.8 + py * 0.015) * 12;
            const wave2 = Math.cos(py * 0.03 - time * 1.4 + px * 0.02) * 10;
            const wave3 = Math.sin((px + py) * 0.02 + time * 2.2) * 8;

            let rippleDisplace = 0;
            for (let r = 0; r < ripples.length; r++) {
              const rip = ripples[r];
              const dist = Math.hypot(px - rip.x, py - rip.y);
              const waveFront = Math.abs(dist - rip.radius);
              if (waveFront < 35) {
                rippleDisplace += Math.sin((waveFront / 35) * Math.PI) * rip.intensity * 25;
              }
            }

            const dx = px + wave1 + rippleDisplace * 0.7;
            const dy = py + wave2 + wave3 + rippleDisplace;

            if (x === 0) {
              ctx.moveTo(dx, dy);
            } else {
              ctx.lineTo(dx, dy);
            }
          }
          ctx.stroke();
        }

        // Concentric caustic nodal intersections
        for (let y = 0; y < rows; y += 2) {
          for (let x = 0; x < cols; x += 2) {
            const px = x * gridStep;
            const py = y * gridStep;
            const crest = Math.sin(px * 0.03 + time) * Math.cos(py * 0.03 - time);

            if (crest > 0.65) {
              ctx.beginPath();
              ctx.fillStyle = causticHighlight;
              ctx.arc(px, py, (crest - 0.65) * 6 + 1.5, 0, Math.PI * 2);
              ctx.fill();
            }
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

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ripplesRef.current.push({
      x,
      y,
      radius: 5,
      maxRadius: Math.max(rect.width, rect.height) * 0.6,
      intensity: 1.0,
    });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
    if (Math.random() < 0.2) {
      ripplesRef.current.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        radius: 4,
        maxRadius: 180,
        intensity: 0.5,
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className={styles.container}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
    >
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

      <div className={styles.overlay} data-preview-chrome>
        <div className={styles.badge}>
          <Droplet size={12} aria-hidden="true" />
          <span>Submerged Caustics Lattice</span>
        </div>
        <h3 className={styles.title}>Caustics Ripple Grid</h3>
        <p className={styles.description}>
          Refractive sunlight caustics simulation with trigonometric wave interference. Click or drag to propagate radial water ripple waves.
        </p>
      </div>

      <div className={styles.controls} data-preview-chrome onClick={(e) => e.stopPropagation()}>
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

        <div className={styles.controlGroup} role="radiogroup" aria-label="Oceanic depth">
          <button
            type="button"
            className={`${styles.btn} ${depth === "shallow-lagoon" ? styles.active : ""}`}
            onClick={() => setDepth("shallow-lagoon")}
            role="radio"
            aria-checked={depth === "shallow-lagoon"}
          >
            <Waves size={13} aria-hidden="true" />
            <span>Lagoon</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${depth === "deep-trench" ? styles.active : ""}`}
            onClick={() => setDepth("deep-trench")}
            role="radio"
            aria-checked={depth === "deep-trench"}
          >
            <Compass size={13} aria-hidden="true" />
            <span>Deep Trench</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${depth === "bioluminescent" ? styles.active : ""}`}
            onClick={() => setDepth("bioluminescent")}
            role="radio"
            aria-checked={depth === "bioluminescent"}
          >
            <span>Bioluminescent</span>
          </button>
        </div>

        <div className={styles.controlGroup} role="radiogroup" aria-label="Water clarity">
          <button
            type="button"
            className={`${styles.btn} ${clarity === "crystal" ? styles.active : ""}`}
            onClick={() => setClarity("crystal")}
            role="radio"
            aria-checked={clarity === "crystal"}
          >
            <span>Crystal Thin</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${clarity === "diffused" ? styles.active : ""}`}
            onClick={() => setClarity("diffused")}
            role="radio"
            aria-checked={clarity === "diffused"}
          >
            <span>Diffused Luminous</span>
          </button>
        </div>
      </div>
    </div>
  );
}

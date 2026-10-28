"use client";

import { useEffect, useRef, useState } from "react";
import { Grid, Play, Pause, Orbit, Sparkles } from "lucide-react";
import styles from "./grid-distortion-warp.module.css";

type WarpLattice = "perspective-plane" | "isometric-mesh";

export default function GridDistortionWarp() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [lattice, setLattice] = useState<WarpLattice>("perspective-plane");
  const [gravityDepth, setGravityDepth] = useState<"standard" | "deep">("standard");

  const isPlayingRef = useRef(isPlaying);
  const latticeRef = useRef(lattice);
  const gravityRef = useRef(gravityDepth);
  const pointerRef = useRef({ x: 0.5, y: 0.5, active: false });

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    latticeRef.current = lattice;
    gravityRef.current = gravityDepth;
  }, [isPlaying, lattice, gravityDepth]);

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

    const COLS = 36;
    const ROWS = 24;

    const render = () => {
      if (isVisible && isPlayingRef.current && width > 0 && height > 0) {
        time += 0.012;

        ctx.fillStyle = "#060814";
        ctx.fillRect(0, 0, width, height);

        const currentLattice = latticeRef.current;
        const currentGravity = gravityRef.current;
        const gravityWeight = currentGravity === "deep" ? 180 : 90;

        const pX = pointerRef.current.x * width;
        const pY = pointerRef.current.y * height;

        ctx.save();

        const gridNodes: { x: number; y: number }[][] = [];

        // Compute 3D perspective warped nodes
        for (let r = 0; r <= ROWS; r++) {
          const rowNodes: { x: number; y: number }[] = [];
          const v = r / ROWS;

          for (let c = 0; c <= COLS; c++) {
            const u = c / COLS;

            let bx = u * width;
            let by = v * height;

            if (currentLattice === "perspective-plane") {
              // Synthetic 3D perspective tilt
              const pz = 1 - v * 0.55;
              bx = width * 0.5 + (u - 0.5) * width * pz;
              by = height * 0.2 + v * height * 0.8;
            }

            // Localized gravitational depression
            const dist = Math.hypot(bx - pX, by - pY);
            const influence = Math.max(0, 1 - dist / 240);
            const warpDisp = Math.pow(influence, 2) * gravityWeight;

            // Ambient breathing wave
            const ambient = Math.sin(u * 8 + time * 2) * Math.cos(v * 8 + time) * 6;

            const finalX = bx;
            const finalY = by + warpDisp + ambient;

            rowNodes.push({ x: finalX, y: finalY });
          }
          gridNodes.push(rowNodes);
        }

        // Draw horizontal grid lines
        for (let r = 0; r <= ROWS; r++) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(129, 140, 248, ${0.12 + (r / ROWS) * 0.25})`;
          ctx.lineWidth = 1.2;

          for (let c = 0; c <= COLS; c++) {
            const node = gridNodes[r][c];
            if (c === 0) ctx.moveTo(node.x, node.y);
            else ctx.lineTo(node.x, node.y);
          }
          ctx.stroke();
        }

        // Draw vertical grid lines
        for (let c = 0; c <= COLS; c++) {
          ctx.beginPath();
          ctx.strokeStyle = "rgba(99, 102, 241, 0.18)";
          ctx.lineWidth = 1.2;

          for (let r = 0; r <= ROWS; r++) {
            const node = gridNodes[r][c];
            if (r === 0) ctx.moveTo(node.x, node.y);
            else ctx.lineTo(node.x, node.y);
          }
          ctx.stroke();
        }

        // Glowing singularity marker under pointer
        if (pointerRef.current.active) {
          ctx.beginPath();
          const grad = ctx.createRadialGradient(pX, pY, 2, pX, pY, 45);
          grad.addColorStop(0, "rgba(255, 255, 255, 0.9)");
          grad.addColorStop(0.3, "rgba(129, 140, 248, 0.5)");
          grad.addColorStop(1, "rgba(6, 8, 20, 0)");
          ctx.fillStyle = grad;
          ctx.arc(pX, pY, 45, 0, Math.PI * 2);
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
          <Grid size={12} aria-hidden="true" />
          <span>Gravitational Metric Tensor</span>
        </div>
        <h3 className={styles.title}>Grid Distortion Warp</h3>
        <p className={styles.description}>
          3D perspective topological wireframe deformed by localized gravitational curvature under cursor coordinates.
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

        <div className={styles.controlGroup} role="radiogroup" aria-label="Projection lattice">
          <button
            type="button"
            className={`${styles.btn} ${lattice === "perspective-plane" ? styles.active : ""}`}
            onClick={() => setLattice("perspective-plane")}
            role="radio"
            aria-checked={lattice === "perspective-plane"}
          >
            <Orbit size={13} aria-hidden="true" />
            <span>Perspective Frustum</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${lattice === "isometric-mesh" ? styles.active : ""}`}
            onClick={() => setLattice("isometric-mesh")}
            role="radio"
            aria-checked={lattice === "isometric-mesh"}
          >
            <Grid size={13} aria-hidden="true" />
            <span>Isometric Mesh</span>
          </button>
        </div>

        <div className={styles.controlGroup} role="radiogroup" aria-label="Gravitational depression">
          <button
            type="button"
            className={`${styles.btn} ${gravityDepth === "standard" ? styles.active : ""}`}
            onClick={() => setGravityDepth("standard")}
            role="radio"
            aria-checked={gravityDepth === "standard"}
          >
            <span>Standard Mass</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${gravityDepth === "deep" ? styles.active : ""}`}
            onClick={() => setGravityDepth("deep")}
            role="radio"
            aria-checked={gravityDepth === "deep"}
          >
            <Sparkles size={13} aria-hidden="true" />
            <span>Deep Singularity</span>
          </button>
        </div>
      </div>
    </div>
  );
}

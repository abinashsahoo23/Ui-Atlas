"use client";

import { useEffect, useRef, useState } from "react";
import { Zap, Play, Pause, Flame, Radio } from "lucide-react";
import styles from "./lightning-energy-mesh.module.css";

type EnergyTone = "azure" | "violet" | "crimson";

interface Point {
  x: number;
  y: number;
}

interface BoltBranch {
  start: Point;
  end: Point;
  alpha: number;
  width: number;
}

export default function LightningEnergyMesh() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [tone, setTone] = useState<EnergyTone>("azure");
  const [frequency, setFrequency] = useState<"steady" | "surge">("steady");

  const isPlayingRef = useRef(isPlaying);
  const toneRef = useRef(tone);
  const frequencyRef = useRef(frequency);
  const pointerRef = useRef({ x: 0.5, y: 0.5, active: false });

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    toneRef.current = tone;
    frequencyRef.current = frequency;
  }, [isPlaying, tone, frequency]);

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
    const bolts: BoltBranch[][] = [];
    let lastBoltTime = 0;

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

    const generateLightning = (start: Point, end: Point, maxDisplace: number, branchProb: number): BoltBranch[] => {
      const segments: BoltBranch[] = [];

      const subdivide = (p1: Point, p2: Point, displace: number, depth: number) => {
        if (depth <= 0) {
          segments.push({ start: p1, end: p2, alpha: 1.0, width: Math.max(1, depth * 0.5 + 1.5) });
          return;
        }

        const midX = (p1.x + p2.x) * 0.5 + (Math.random() - 0.5) * displace;
        const midY = (p1.y + p2.y) * 0.5 + (Math.random() - 0.5) * displace;
        const mid: Point = { x: midX, y: midY };

        subdivide(p1, mid, displace * 0.55, depth - 1);
        subdivide(mid, p2, displace * 0.55, depth - 1);

        if (Math.random() < branchProb && depth > 2) {
          const branchAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x) + (Math.random() - 0.5) * 0.8;
          const branchLen = Math.hypot(p2.x - p1.x, p2.y - p1.y) * 0.45;
          const branchEnd: Point = {
            x: mid.x + Math.cos(branchAngle) * branchLen,
            y: mid.y + Math.sin(branchAngle) * branchLen,
          };
          subdivide(mid, branchEnd, displace * 0.4, depth - 2);
        }
      };

      subdivide(start, end, maxDisplace, 5);
      return segments;
    };

    const render = (time: number) => {
      if (isVisible && isPlayingRef.current && width > 0 && height > 0) {
        // Soft phosphor persistence decay
        ctx.fillStyle = "rgba(3, 7, 18, 0.28)";
        ctx.fillRect(0, 0, width, height);

        const currentFreq = frequencyRef.current;
        const interval = currentFreq === "surge" ? 90 : 220;

        if (time - lastBoltTime > interval) {
          lastBoltTime = time;

          const startX = Math.random() * width;
          const startY = 0;
          let targetX = Math.random() * width;
          let targetY = height;

          if (pointerRef.current.active) {
            targetX = pointerRef.current.x * width;
            targetY = pointerRef.current.y * height;
          }

          const newBolt = generateLightning(
            { x: startX, y: startY },
            { x: targetX, y: targetY },
            width * 0.22,
            0.4
          );
          bolts.push(newBolt);

          if (bolts.length > 4) {
            bolts.shift();
          }
        }

        ctx.save();
        ctx.globalCompositeOperation = "screen";

        const currentTone = toneRef.current;
        let coreColor = "#e0f2fe";
        let glowColor = "rgba(14, 165, 233, 0.4)";
        if (currentTone === "violet") {
          coreColor = "#f5d0fe";
          glowColor = "rgba(192, 38, 211, 0.4)";
        } else if (currentTone === "crimson") {
          coreColor = "#fecdd3";
          glowColor = "rgba(225, 29, 72, 0.4)";
        }

        // Draw active bolts with decay
        for (let b = 0; b < bolts.length; b++) {
          const bolt = bolts[b];
          for (let i = 0; i < bolt.length; i++) {
            const seg = bolt[i];
            seg.alpha *= 0.88;

            if (seg.alpha > 0.05) {
              // Outer glow
              ctx.beginPath();
              ctx.strokeStyle = glowColor;
              ctx.lineWidth = seg.width * 3.5;
              ctx.moveTo(seg.start.x, seg.start.y);
              ctx.lineTo(seg.end.x, seg.end.y);
              ctx.stroke();

              // High-intensity white-hot core
              ctx.beginPath();
              ctx.strokeStyle = coreColor;
              ctx.lineWidth = seg.width;
              ctx.moveTo(seg.start.x, seg.start.y);
              ctx.lineTo(seg.end.x, seg.end.y);
              ctx.stroke();
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

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
      active: true,
    };
  };

  const handlePointerLeave = () => {
    pointerRef.current = { x: 0.5, y: 0.5, active: false };
  };

  const triggerDischarge = () => {
    pointerRef.current = { x: Math.random(), y: Math.random(), active: true };
  };

  return (
    <div
      ref={containerRef}
      className={styles.container}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={triggerDischarge}
    >
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

      <div className={styles.overlay} data-preview-chrome>
        <div className={styles.badge}>
          <Zap size={12} aria-hidden="true" />
          <span>Dielectric Breakdown</span>
        </div>
        <h3 className={styles.title}>Lightning Energy Mesh</h3>
        <p className={styles.description}>
          Stochastic midpoint displacement electric arcs with ion glow persistence. Move your pointer or click to direct ionizing discharges.
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

        <div className={styles.controlGroup} role="radiogroup" aria-label="Plasma tone">
          <button
            type="button"
            className={`${styles.btn} ${tone === "azure" ? styles.active : ""}`}
            onClick={() => setTone("azure")}
            role="radio"
            aria-checked={tone === "azure"}
          >
            <Radio size={13} aria-hidden="true" />
            <span>Azure Arc</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${tone === "violet" ? styles.active : ""}`}
            onClick={() => setTone("violet")}
            role="radio"
            aria-checked={tone === "violet"}
          >
            <Zap size={13} aria-hidden="true" />
            <span>Violet Ion</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${tone === "crimson" ? styles.active : ""}`}
            onClick={() => setTone("crimson")}
            role="radio"
            aria-checked={tone === "crimson"}
          >
            <Flame size={13} aria-hidden="true" />
            <span>Crimson Storm</span>
          </button>
        </div>

        <div className={styles.controlGroup} role="radiogroup" aria-label="Arc frequency">
          <button
            type="button"
            className={`${styles.btn} ${frequency === "steady" ? styles.active : ""}`}
            onClick={() => setFrequency("steady")}
            role="radio"
            aria-checked={frequency === "steady"}
          >
            <span>Steady</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${frequency === "surge" ? styles.active : ""}`}
            onClick={() => setFrequency("surge")}
            role="radio"
            aria-checked={frequency === "surge"}
          >
            <span>Surge Storm</span>
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Sparkles, Orbit } from 'lucide-react';
import styles from "./quantum-particles.module.css";

const MODES = [
  { id: "nebula", name: "Nebula Drift", color: [0.3, 0.6, 1.0] as [number, number, number], bg: "#060913" },
  { id: "solar", name: "Solar Flare", color: [1.0, 0.45, 0.15] as [number, number, number], bg: "#140702" },
  { id: "cyber", name: "Cyber Matrix", color: [0.1, 0.95, 0.55] as [number, number, number], bg: "#02120b" },
];

export default function QuantumParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [modeIdx, setModeIdx] = useState(0);
  const [particleDensity, setParticleDensity] = useState(600);
  const [connectDistance, setConnectDistance] = useState(85);

  const animRef = useRef<number | null>(null);
  const isPlayingRef = useRef(isPlaying);
  const currentMode = MODES[modeIdx];
  const modeRef = useRef(currentMode);
  const mouseRef = useRef({ x: -1000, y: -1000, isHovered: false });

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    modeRef.current = currentMode;
  }, [isPlaying, currentMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseRadius: number;
      alpha: number;
    };

    let particles: Particle[] = [];

    const initParticles = () => {
      particles = [];
      const count = Math.min(particleDensity, 800);
      for (let i = 0; i < count; i++) {
        const rad = Math.random() * 2.2 + 0.8;
        particles.push({
          x: Math.random() * (width || 800),
          y: Math.random() * (height || 500),
          vx: (Math.random() - 0.5) * 0.9,
          vy: (Math.random() - 0.5) * 0.9,
          radius: rad,
          baseRadius: rad,
          alpha: Math.random() * 0.7 + 0.3,
        });
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.scale(dpr, dpr);
      if (particles.length === 0) initParticles();
    };
    resize();
    window.addEventListener("resize", resize);

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    if (containerRef.current) observer.observe(containerRef.current);

    const render = () => {
      if (isVisible && isPlayingRef.current) {
        ctx.clearRect(0, 0, width, height);

        const col = modeRef.current.color;
        const rgbStr = `${Math.floor(col[0] * 255)}, ${Math.floor(col[1] * 255)}, ${Math.floor(col[2] * 255)}`;

        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          // Cursor repulsion
          if (mouseRef.current.isHovered) {
            const dx = p.x - mouseRef.current.x;
            const dy = p.y - mouseRef.current.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 120 && dist > 0.1) {
              const force = (120 - dist) / 120;
              p.vx += (dx / dist) * force * 0.45;
              p.vy += (dy / dist) * force * 0.45;
            }
          }

          p.x += p.vx;
          p.y += p.vy;

          // Gentle drag
          p.vx *= 0.985;
          p.vy *= 0.985;

          // Wrap edges
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          // Draw particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgbStr}, ${p.alpha})`;
          ctx.fill();

          // Connect nearby particles
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.hypot(dx, dy);

            if (dist < connectDistance) {
              const lineAlpha = (1 - dist / connectDistance) * 0.35;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(${rgbStr}, ${lineAlpha})`;
              ctx.lineWidth = 0.75;
              ctx.stroke();
            }
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
  }, [particleDensity, connectDistance]);

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
      style={{ backgroundColor: currentMode.bg }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

      <div className={styles.hud} data-preview-chrome>
        <div className={styles.infoBadge} data-preview-chrome>
          <Sparkles size={14} className={styles.icon} />
          <span className={styles.title}>QUANTUM PARTICLES // ENTANGLEMENT FIELD</span>
        </div>

        <div className={styles.controls} data-preview-chrome>
          <button
            type="button"
            className={styles.controlBtn}
            onClick={() => setIsPlaying((p) => !p)}
            aria-label={isPlaying ? "Pause particles" : "Play particles"}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>

          <button
            type="button"
            className={styles.controlBtn}
            onClick={() => setModeIdx((idx) => (idx + 1) % MODES.length)}
            aria-label="Cycle particle energy mode"
          >
            <Orbit size={14} />
          </button>

          <div className={styles.sliderGroup}>
            <span className={styles.label}>DENSITY</span>
            <input
              type="range"
              min="200"
              max="750"
              step="50"
              value={particleDensity}
              onChange={(e) => setParticleDensity(parseInt(e.target.value, 10))}
              className={styles.slider}
              aria-label="Particle density"
            />
          </div>

          <div className={styles.sliderGroup}>
            <span className={styles.label}>RADIUS</span>
            <input
              type="range"
              min="40"
              max="130"
              step="5"
              value={connectDistance}
              onChange={(e) => setConnectDistance(parseInt(e.target.value, 10))}
              className={styles.slider}
              aria-label="Connection distance"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

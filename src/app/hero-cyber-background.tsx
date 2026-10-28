"use client";

import { useEffect, useRef } from "react";
import styles from "./home.module.css";

interface GridNode {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  sparkPhase: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
}

export function HeroCyberBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let isVisible = true;
    let width = 0;
    let height = 0;
    let nodes: GridNode[] = [];
    let particles: Particle[] = [];

    // Pointer state with smooth lerping
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      radius: 180,
      active: false,
    };

    // Scanline & wave sweeps
    let scanlineY = 0;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const spacing = 46;

    const buildGrid = (w: number, h: number) => {
      const cols = Math.ceil(w / spacing) + 2;
      const rows = Math.ceil(h / spacing) + 2;
      const pts: GridNode[] = [];

      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          const px = c * spacing;
          const py = r * spacing;
          pts.push({
            x: px,
            y: py,
            originX: px,
            originY: py,
            vx: 0,
            vy: 0,
            sparkPhase: Math.random() * Math.PI * 2,
          });
        }
      }

      // Generate ambient floating particles
      const particleList: Particle[] = [];
      const particleCount = Math.min(Math.floor((w * h) / 14000), 45);
      const colors = ["#FF334F", "#7865FF", "#FFFFFF", "#94A3B8"];

      for (let i = 0; i < particleCount; i++) {
        particleList.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          size: Math.random() * 2.2 + 0.8,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.5 + 0.2,
        });
      }

      particles = particleList;
      return pts;
    };

    const resize = () => {
      const parentRect = canvas.parentElement?.getBoundingClientRect();
      const w = parentRect ? parentRect.width : window.innerWidth;
      const h = parentRect ? parentRect.height : 600;
      width = canvas.width = Math.max(w, 320);
      height = canvas.height = Math.max(h, 420);
      nodes = buildGrid(width, height);
    };

    resize();

    // Container-scoped pointer listener
    const parent = canvas.parentElement;
    const handlePointerMove = (e: PointerEvent) => {
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.active = true;
    };

    const handlePointerLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
      mouse.active = false;
    };

    if (parent) {
      parent.addEventListener("pointermove", handlePointerMove);
      parent.addEventListener("pointerleave", handlePointerLeave);
    }

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    if (parent) {
      resizeObserver.observe(parent);
    }

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = Boolean(entry?.isIntersecting);
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(canvas);

    const render = () => {
      if (!isVisible) {
        animId = requestAnimationFrame(render);
        return;
      }

      // Mouse position lerping
      mouse.x += (mouse.targetX - mouse.x) * 0.14;
      mouse.y += (mouse.targetY - mouse.y) * 0.14;

      ctx.clearRect(0, 0, width, height);

      // 1. Ambient Volumetric Backlight (Electric Indigo & Neon Red Core)
      const ambientGlow = ctx.createRadialGradient(
        width * 0.5,
        height * 0.4,
        40,
        width * 0.5,
        height * 0.48,
        Math.max(width, height) * 0.65
      );
      ambientGlow.addColorStop(0, "rgba(120, 101, 255, 0.22)");
      ambientGlow.addColorStop(0.35, "rgba(255, 51, 79, 0.10)");
      ambientGlow.addColorStop(0.7, "rgba(14, 16, 28, 0.4)");
      ambientGlow.addColorStop(1, "rgba(8, 8, 13, 0)");
      ctx.fillStyle = ambientGlow;
      ctx.fillRect(0, 0, width, height);

      // 2. Interactive Cursor Spotlight Aura
      if (mouse.x > -500 && mouse.y > -500) {
        const cursorSpot = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          mouse.radius * 1.6
        );
        cursorSpot.addColorStop(0, "rgba(255, 51, 79, 0.32)");
        cursorSpot.addColorStop(0.35, "rgba(120, 101, 255, 0.22)");
        cursorSpot.addColorStop(0.8, "rgba(120, 101, 255, 0.06)");
        cursorSpot.addColorStop(1, "rgba(120, 101, 255, 0)");
        ctx.fillStyle = cursorSpot;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius * 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Scanline Beam
      if (!prefersReducedMotion) {
        scanlineY = (scanlineY + 1.4) % (height + 120);
        const beam = ctx.createLinearGradient(0, scanlineY - 50, 0, scanlineY + 50);
        beam.addColorStop(0, "rgba(120, 101, 255, 0)");
        beam.addColorStop(0.5, "rgba(120, 101, 255, 0.12)");
        beam.addColorStop(1, "rgba(120, 101, 255, 0)");
        ctx.fillStyle = beam;
        ctx.fillRect(0, scanlineY - 50, width, 100);
      }

      // 4. Update Grid Nodes & Physics
      const cols = Math.ceil(width / spacing) + 2;
      const rows = Math.ceil(height / spacing) + 2;

      for (let i = 0; i < nodes.length; i++) {
        const pt = nodes[i];

        if (!prefersReducedMotion && mouse.x > -500) {
          const dx = mouse.x - pt.originX;
          const dy = mouse.y - pt.originY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius && dist > 0) {
            const force = (1 - dist / mouse.radius) * 26;
            const angle = Math.atan2(dy, dx);
            const targetX = pt.originX - Math.cos(angle) * force;
            const targetY = pt.originY - Math.sin(angle) * force;
            pt.x += (targetX - pt.x) * 0.18;
            pt.y += (targetY - pt.y) * 0.18;
          } else {
            pt.x += (pt.originX - pt.x) * 0.12;
            pt.y += (pt.originY - pt.y) * 0.12;
          }
        } else {
          pt.x = pt.originX;
          pt.y = pt.originY;
        }
      }

      // 5. Draw Dynamic Grid Lines
      ctx.lineWidth = 1;

      // Horizontal Lines
      for (let r = 0; r <= rows; r++) {
        ctx.beginPath();
        let started = false;
        for (let c = 0; c <= cols; c++) {
          const idx = r * (cols + 1) + c;
          const pt = nodes[idx];
          if (!pt) continue;

          if (!started) {
            ctx.moveTo(pt.x, pt.y);
            started = true;
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        }

        const midY = r * spacing;
        const scanDist = Math.abs(midY - scanlineY);
        const scanBoost = Math.max(0, 1 - scanDist / 120) * 0.14;

        ctx.strokeStyle = `rgba(120, 101, 255, ${0.07 + scanBoost})`;
        ctx.stroke();
      }

      // Vertical Lines
      for (let c = 0; c <= cols; c++) {
        ctx.beginPath();
        let started = false;
        for (let r = 0; r <= rows; r++) {
          const idx = r * (cols + 1) + c;
          const pt = nodes[idx];
          if (!pt) continue;

          if (!started) {
            ctx.moveTo(pt.x, pt.y);
            started = true;
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        }
        ctx.strokeStyle = "rgba(120, 101, 255, 0.07)";
        ctx.stroke();
      }

      // 6. Intersection Crosshairs & Particle Spark Points
      const crossSize = 3;
      for (let i = 0; i < nodes.length; i++) {
        const pt = nodes[i];
        if (pt.x < -10 || pt.x > width + 10 || pt.y < -10 || pt.y > height + 10) continue;

        const dx = mouse.x - pt.x;
        const dy = mouse.y - pt.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let alpha = 0.22;
        let strokeColor = "rgba(120, 101, 255, 0.3)";

        if (dist < mouse.radius) {
          const intensity = 1 - dist / mouse.radius;
          alpha = 0.35 + intensity * 0.65;
          if (dist < mouse.radius * 0.4) {
            strokeColor = `rgba(255, 51, 79, ${alpha})`;
          } else {
            strokeColor = `rgba(165, 148, 255, ${alpha})`;
          }
        }

        ctx.strokeStyle = strokeColor;
        ctx.beginPath();
        ctx.moveTo(pt.x - crossSize, pt.y);
        ctx.lineTo(pt.x + crossSize, pt.y);
        ctx.moveTo(pt.x, pt.y - crossSize);
        ctx.lineTo(pt.x, pt.y + crossSize);
        ctx.stroke();
      }

      // 7. Ambient Micro-Particles
      if (!prefersReducedMotion) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          // Connect nearby particles with subtle threads
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const pdx = p.x - p2.x;
            const pdy = p.y - p2.y;
            const pDist = Math.sqrt(pdx * pdx + pdy * pdy);

            if (pDist < 80) {
              const lineAlpha = (1 - pDist / 80) * 0.15;
              ctx.strokeStyle = `rgba(120, 101, 255, ${lineAlpha})`;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }

          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      // 8. Soft Vignette Mask to keep center typography crystal clear
      const vignette = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        Math.min(width, height) * 0.16,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.62
      );
      vignette.addColorStop(0, "rgba(8, 8, 13, 0.72)");
      vignette.addColorStop(0.65, "rgba(8, 8, 13, 0.28)");
      vignette.addColorStop(1, "rgba(8, 8, 13, 0.0)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      if (parent) {
        parent.removeEventListener("pointermove", handlePointerMove);
        parent.removeEventListener("pointerleave", handlePointerLeave);
        resizeObserver.disconnect();
      }
      intersectionObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.heroBackgroundCanvas} aria-hidden="true" />;
}

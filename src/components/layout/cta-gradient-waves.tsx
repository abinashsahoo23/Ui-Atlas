"use client";

import { useEffect, useRef } from "react";
import styles from "./cta-gradient-waves.module.css";

export function CtaGradientWaves() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let isVisible = true;
    let time = 0;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      const rect = parent?.getBoundingClientRect();
      const w = rect ? rect.width : window.innerWidth;
      const h = rect ? rect.height : 400;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.width = Math.floor(w * dpr);
      height = canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
    };

    resize();

    const parent = canvas.parentElement;
    const resizeObserver = new ResizeObserver(() => resize());
    if (parent) resizeObserver.observe(parent);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = Boolean(entry?.isIntersecting);
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(canvas);

    // Color definitions matching UI Atlas theme:
    // Deep Indigo, Neon Red glow, Royal Violet, Midnight Charcoal
    const waves = [
      {
        yBase: 0.72,
        amplitude: 45,
        wavelength: 0.0035,
        speed: 0.008,
        colorTop: "rgba(120, 101, 255, 0.45)",
        colorMid: "rgba(79, 70, 229, 0.65)",
        colorBot: "rgba(14, 11, 19, 0.95)",
        highlight: "rgba(165, 148, 255, 0.7)",
      },
      {
        yBase: 0.65,
        amplitude: 55,
        wavelength: 0.0028,
        speed: -0.006,
        colorTop: "rgba(147, 51, 234, 0.55)",
        colorMid: "rgba(91, 33, 182, 0.75)",
        colorBot: "rgba(10, 8, 14, 0.98)",
        highlight: "rgba(192, 132, 252, 0.8)",
      },
      {
        yBase: 0.58,
        amplitude: 65,
        wavelength: 0.0022,
        speed: 0.005,
        colorTop: "rgba(255, 51, 79, 0.22)",
        colorMid: "rgba(120, 101, 255, 0.60)",
        colorBot: "rgba(14, 11, 19, 0.92)",
        highlight: "rgba(255, 120, 150, 0.65)",
      },
      {
        yBase: 0.50,
        amplitude: 75,
        wavelength: 0.0018,
        speed: -0.004,
        colorTop: "rgba(99, 102, 241, 0.4)",
        colorMid: "rgba(49, 46, 129, 0.7)",
        colorBot: "rgba(8, 8, 13, 1.0)",
        highlight: "rgba(129, 140, 248, 0.75)",
      },
    ];

    const render = () => {
      if (!isVisible) {
        animId = requestAnimationFrame(render);
        return;
      }

      const cssW = width / (window.devicePixelRatio || 1);
      const cssH = height / (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, cssW, cssH);

      // Deep base background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, cssH);
      bgGrad.addColorStop(0, "#0e0b13");
      bgGrad.addColorStop(0.5, "#120e1c");
      bgGrad.addColorStop(1, "#09070d");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, cssW, cssH);

      // Ambient radial backlight behind waves
      const aura = ctx.createRadialGradient(
        cssW * 0.5,
        cssH * 0.65,
        20,
        cssW * 0.5,
        cssH * 0.65,
        Math.max(cssW, cssH) * 0.55
      );
      aura.addColorStop(0, "rgba(120, 101, 255, 0.35)");
      aura.addColorStop(0.4, "rgba(255, 51, 79, 0.12)");
      aura.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = aura;
      ctx.fillRect(0, 0, cssW, cssH);

      if (!prefersReducedMotion) {
        time += 1;
      }

      // Draw layered velvet dunes / 3D waves
      for (let i = waves.length - 1; i >= 0; i--) {
        const w = waves[i];
        const baseH = cssH * w.yBase;
        const currentSpeed = w.speed * time;

        ctx.beginPath();
        ctx.moveTo(0, cssH);

        for (let x = 0; x <= cssW; x += 6) {
          const y =
            baseH +
            Math.sin(x * w.wavelength + currentSpeed) * w.amplitude +
            Math.cos(x * w.wavelength * 0.5 + currentSpeed * 0.8) * (w.amplitude * 0.45);

          if (x === 0) {
            ctx.lineTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.lineTo(cssW, cssH);
        ctx.closePath();

        // Wave fill gradient
        const waveGrad = ctx.createLinearGradient(0, baseH - w.amplitude, 0, cssH);
        waveGrad.addColorStop(0, w.colorTop);
        waveGrad.addColorStop(0.35, w.colorMid);
        waveGrad.addColorStop(1, w.colorBot);
        ctx.fillStyle = waveGrad;
        ctx.fill();

        // Luminous ridge highlight along top edge
        ctx.beginPath();
        for (let x = 0; x <= cssW; x += 6) {
          const y =
            baseH +
            Math.sin(x * w.wavelength + currentSpeed) * w.amplitude +
            Math.cos(x * w.wavelength * 0.5 + currentSpeed * 0.8) * (w.amplitude * 0.45);

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.strokeStyle = w.highlight;
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }

      // Dark top vignette so headline text always has 100% maximum contrast
      const topVignette = ctx.createLinearGradient(0, 0, 0, cssH * 0.65);
      topVignette.addColorStop(0, "rgba(14, 11, 19, 0.85)");
      topVignette.addColorStop(0.5, "rgba(14, 11, 19, 0.4)");
      topVignette.addColorStop(1, "rgba(14, 11, 19, 0)");
      ctx.fillStyle = topVignette;
      ctx.fillRect(0, 0, cssW, cssH);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  return (
    <div className={styles.wavesContainer} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.wavesCanvas} />
    </div>
  );
}

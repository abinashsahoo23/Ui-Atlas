"use client";

import { useState, useRef, useEffect } from "react";
import { Share2, Sliders } from 'lucide-react';
import styles from "./dotted-network-field.module.css";

interface NodePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default function DottedNetworkField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [density, setDensity] = useState<"sparse" | "dense">("sparse");
  const nodeCount = density === "sparse" ? 28 : 50;
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    const height = (canvas.height = 240);

    // Initialize nodes
    const nodes: NodePoint[] = Array.from({ length: nodeCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Update positions
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "#3b82f6";
        ctx.fill();
      });

      // Connect nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < 85) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${1 - dist / 85})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Connect to mouse
        const mouseDist = Math.hypot(nodes[i].x - mouseRef.current.x, nodes[i].y - mouseRef.current.y);
        if (mouseDist < 110) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
          ctx.strokeStyle = `rgba(37, 99, 235, ${(1 - mouseDist / 110) * 1.5})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [nodeCount]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.tag} data-preview-chrome>
          <Share2 size={13} className={styles.icon} aria-hidden="true" />
          <span>CONSTELLATION // DOTTED NETWORK</span>
        </div>
        <div className={styles.controls} data-preview-chrome>
          <Sliders size={12} aria-hidden="true" />
          <button
            type="button"
            onClick={() => setDensity("sparse")}
            className={styles.densityBtn}
            data-active={density === "sparse"}
          >
            Sparse (28)
          </button>
          <button
            type="button"
            onClick={() => setDensity("dense")}
            className={styles.densityBtn}
            data-active={density === "dense"}
          >
            Dense (50)
          </button>
        </div>
      </header>

      <div
        className={styles.canvasContainer}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        }}
        onMouseLeave={() => {
          mouseRef.current = { x: -1000, y: -1000 };
        }}
      >
        <canvas ref={canvasRef} className={styles.canvas} />
        <div className={styles.canvasOverlay}>
          <h3>Constellation Matrix</h3>
          <p>Physics-driven node proximity graph with real-time cursor gravitational lines.</p>
        </div>
      </div>

      <footer className={styles.footer}>
        <span>GRAPH: O(N²) PROXIMITY KERNEL</span>
        <span>SPRING DISTRIBUTED</span>
      </footer>
    </div>
  );
}

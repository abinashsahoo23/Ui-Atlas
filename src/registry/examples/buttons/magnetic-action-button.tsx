"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import styles from "./magnetic-action-button.module.css";

export default function MagneticActionButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const btn = buttonRef.current;
    const container = containerRef.current;
    if (!btn || !container) return;

    let cachedCenter = { x: 0, y: 0 };
    const updateCenter = () => {
      const rect = btn.getBoundingClientRect();
      cachedCenter = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!cachedCenter.x) updateCenter();
      const distanceX = e.clientX - cachedCenter.x;
      const distanceY = e.clientY - cachedCenter.y;
      const distance = Math.hypot(distanceX, distanceY);

      const radius = 100;
      if (distance < radius) {
        const factor = (radius - distance) / radius;
        setPosition({
          x: distanceX * 0.35 * factor,
          y: distanceY * 0.35 * factor,
        });
        setIsHovered(true);
      } else {
        setPosition({ x: 0, y: 0 });
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
      setIsHovered(false);
    };

    container.addEventListener("mouseenter", updateCenter, { passive: true });
    container.addEventListener("mousemove", handleMouseMove, { passive: true });
    container.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      container.removeEventListener("mouseenter", updateCenter);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      handleMouseLeave();
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.boundsIndicator} aria-hidden="true">
        <span className={styles.crossHairTop} />
        <span className={styles.crossHairBottom} />
        <span className={styles.radiusLabel}>MAGNETIC FIELD / R100</span>
      </div>

      <button
        ref={buttonRef}
        type="button"
        className={styles.button}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) ${pressed ? "scale(0.96)" : ""}`,
        }}
        onMouseDown={() => {
          setPressed(true);
          holdTimerRef.current = setTimeout(() => {
            setConfirmed(true);
          }, 600);
        }}
        onMouseUp={() => {
          setPressed(false);
          if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
          setTimeout(() => setConfirmed(false), 1200);
        }}
        onMouseLeave={() => {
          setPressed(false);
          if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
        }}
        aria-label="Hold to confirm action"
      >
        <span className={styles.sheen} aria-hidden="true" />
        <span className={styles.label}>
          {confirmed ? "Confirmed ✓" : pressed ? "Holding..." : "Hold to confirm"}
        </span>
        <span
          className={styles.arrowBadge}
          style={{
            transform: `translate(${position.x * 0.4}px, ${position.y * 0.4}px)`,
          }}
          aria-hidden="true"
        >
          <ArrowUpRight size={15} />
        </span>
      </button>

      <p className={styles.caption} data-preview-chrome>
        {confirmed ? "Action verified" : isHovered ? "Press and hold to confirm action" : "Hover within 100px to engage magnetic pull"}
      </p>
    </div>
  );
}

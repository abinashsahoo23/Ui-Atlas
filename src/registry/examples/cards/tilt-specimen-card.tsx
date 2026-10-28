"use client";

import { useState, useRef, type MouseEvent } from "react";
import { Sparkles, ShieldCheck, ArrowUpRight } from 'lucide-react';
import styles from "./tilt-specimen-card.module.css";

type SpecimenMode = "hologram" | "obsidian" | "chroma";

export default function TiltSpecimenCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState<number>(0);
  const [rotateY, setRotateY] = useState<number>(0);
  const [glare, setGlare] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [mode, setMode] = useState<SpecimenMode>("hologram");

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 12;
    const rotY = ((x - centerX) / centerX) * 12;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.65,
    });
  }

  function handleMouseEnter() {
    setIsHovered(true);
  }

  function handleMouseLeave() {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  }

  return (
    <div className={styles.sceneContainer}>
      <div className={styles.controlsBar} data-preview-chrome>
        <span className={styles.controlLabel}>CARD FINISH:</span>
        <div className={styles.segmentedFinishes}>
          <button
            type="button"
            className={`${styles.finishBtn} ${mode === "hologram" ? styles.activeFinish : ""}`}
            onClick={() => setMode("hologram")}
          >
            Holo-Prism
          </button>
          <button
            type="button"
            className={`${styles.finishBtn} ${mode === "obsidian" ? styles.activeFinish : ""}`}
            onClick={() => setMode("obsidian")}
          >
            Deep Obsidian
          </button>
          <button
            type="button"
            className={`${styles.finishBtn} ${mode === "chroma" ? styles.activeFinish : ""}`}
            onClick={() => setMode("chroma")}
          >
            Aurora Chroma
          </button>
        </div>
      </div>

      <div
        ref={cardRef}
        className={`${styles.tiltCard} ${styles[mode]} ${isHovered ? styles.tilting : ""}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`,
        }}
      >
        {/* Specular glare reflection overlay */}
        <div
          className={styles.glareLayer}
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 65%)`,
            opacity: glare.opacity,
          }}
          aria-hidden="true"
        />

        <div className={styles.cardHeader}>
          <div className={styles.badgeGroup}>
            <span className={styles.editionPill}>SPECIMEN #049</span>
            <span className={styles.statusIndicator}>
              <span className={styles.pulseDot} /> VERIFIED
            </span>
          </div>
          <Sparkles size={18} className={styles.headerIcon} aria-hidden="true" />
        </div>

        <div className={styles.cardBody}>
          <div className={styles.glyphBox}>
            <div className={styles.hologramCore} />
          </div>
          <h3 className={styles.cardTitle}>Singularity Core</h3>
          <p className={styles.cardDescription}>
            Photonic lattice matrix synthesized at 4.2 Kelvin. Dynamic angle calculations reflect
            ambient focal coordinate data.
          </p>
        </div>

        <div className={styles.cardFooter}>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>FREQUENCY</span>
            <span className={styles.metricValue}>142.8 GHz</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>STABILITY</span>
            <span className={styles.metricValue}>99.98%</span>
          </div>
          <button type="button" className={styles.inspectBtn} aria-label="Inspect specimen details">
            <ShieldCheck size={14} aria-hidden="true" />
            <span>Inspect</span>
            <ArrowUpRight size={13} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

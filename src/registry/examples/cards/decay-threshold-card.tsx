"use client";

import { useEffect, useRef, useState } from "react";
import { ShieldAlert } from "lucide-react";
import styles from "./decay-threshold-card.module.css";

export default function DecayThresholdCard() {
  const [decayPercent, setDecayPercent] = useState(25);
  const [isHovered, setIsHovered] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const card = cardRef.current;
    if (!canvas || !card) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const rect = card.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const targetAlpha = isHovered ? 0.75 : 0.15;
      card.style.setProperty("--decay-alpha", `${targetAlpha}`);

      // Draw quantized retro static noise grain
      const imgData = ctx.createImageData(canvas.width, canvas.height);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        if (Math.random() < (isHovered ? 0.35 : 0.08)) {
          const val = Math.random() > 0.5 ? 255 : 40;
          data[i] = val;
          data[i + 1] = Math.random() > 0.3 ? val : 20; // Red-skewed glitch
          data[i + 2] = val;
          data[i + 3] = Math.floor(Math.random() * 120 + 30);
        }
      }

      ctx.putImageData(imgData, 0, 0);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isHovered]);

  return (
    <div className={styles.container}>
      <div className={styles.centerStage}>
        <div
          ref={cardRef}
          className={styles.cardShell}
          onPointerEnter={() => {
            setIsHovered(true);
            setDecayPercent(88);
          }}
          onPointerLeave={() => {
            setIsHovered(false);
            setDecayPercent(25);
          }}
          role="region"
          aria-label="Decay threshold forensic artifact inspection card"
        >
          {/* Static grain canvas */}
          <canvas ref={canvasRef} className={styles.staticCanvas} aria-hidden="true" />

          <div className={styles.cardHeader}>
            <span className={styles.cardCode}>ARTIFACT // 0x7F4A</span>
            <span className={styles.decayLevel}>DECAY: {decayPercent}%</span>
          </div>

          <div>
            <h4 className={styles.cardTitle}>Forensic Core Enclave</h4>
            <p className={styles.cardDesc}>
              {isHovered
                ? "MEMORY SEGMENT CORRUPTED: 0x992B... PARITY DRIFT DETECTED IN QUANTIZED BUFFER."
                : "Air-gapped telemetry manifest. Hover card to trigger digital static radiation decay."}
            </p>
          </div>

          <div className={styles.cardFooter}>
            <span>SHA-256: 8f2a...c014</span>
            <ShieldAlert size={14} color="#f43f5e" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className={styles.overlay} data-preview-chrome>
        <div className={styles.badge}>
          <ShieldAlert size={12} aria-hidden="true" />
          <span>Static Degradation Threshold</span>
        </div>
        <h3 className={styles.title}>Decay Threshold Card</h3>
        <p className={styles.description}>
          Cybernetic artifact card with stochastic digital noise and forensic degradation threshold triggered on hover proximity.
        </p>
      </div>

      <div className={styles.controls} data-preview-chrome>
        <div className={styles.controlGroup}>
          <span className={styles.btn}>✦ Hover over card to induce cryptographic entropy decay</span>
        </div>
      </div>
    </div>
  );
}

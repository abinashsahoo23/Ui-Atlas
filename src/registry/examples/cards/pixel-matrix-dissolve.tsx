"use client";

import { useRef, useState } from "react";
import { Grid, RefreshCw } from "lucide-react";
import styles from "./pixel-matrix-dissolve.module.css";

export default function PixelMatrixDissolve() {
  const [activeLayer, setActiveLayer] = useState<"A" | "B">("A");
  const [pixelSize, setPixelSize] = useState<8 | 16>(16);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const isAnimatingRef = useRef(false);

  const toggleLayer = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const canvas = canvasRef.current;
    const card = cardRef.current;
    if (!canvas || !card) {
      setActiveLayer((prev) => (prev === "A" ? "B" : "A"));
      isAnimatingRef.current = false;
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = card.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const blockSize = pixelSize;
    const cols = Math.ceil(rect.width / blockSize);
    const rows = Math.ceil(rect.height / blockSize);
    const totalBlocks = cols * rows;

    // Create randomized block order
    const indices = Array.from({ length: totalBlocks }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    const nextState = activeLayer === "A" ? "B" : "A";
    const overlayColor = nextState === "B" ? "#064e3b" : "#1e1b4b";

    let step = 0;
    const batchSize = Math.max(1, Math.floor(totalBlocks / 20));

    const animStep = () => {
      ctx.fillStyle = overlayColor;
      for (let b = 0; b < batchSize && step < totalBlocks; b++, step++) {
        const idx = indices[step];
        const c = idx % cols;
        const r = Math.floor(idx / cols);
        ctx.fillRect(c * blockSize, r * blockSize, blockSize, blockSize);
      }

      if (step < totalBlocks) {
        requestAnimationFrame(animStep);
      } else {
        // Switch underlying layer and fade dissolve canvas
        setActiveLayer(nextState);
        setTimeout(() => {
          ctx.clearRect(0, 0, rect.width, rect.height);
          isAnimatingRef.current = false;
        }, 150);
      }
    };

    animStep();
  };

  return (
    <div className={styles.container}>
      <div className={styles.centerStage}>
        <div
          ref={cardRef}
          className={styles.cardShell}
          onClick={toggleLayer}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              toggleLayer();
            }
          }}
          aria-label={`Pixel dissolve card. Currently showing layer ${activeLayer}. Click to dissolve.`}
        >
          {/* Layer A (Deep Indigo Specimen) */}
          <div
            className={styles.layerA}
            style={{ opacity: activeLayer === "A" ? 1 : 0 }}
          >
            <div>
              <span className={styles.cardTag}>SPECIMEN PROTOCOL // 01</span>
              <h4 className={styles.cardTitle}>Deep Field Neural</h4>
              <p className={styles.cardDesc}>
                Architectural telemetry index tracking hardware matrix throughput and active memory allocations.
              </p>
            </div>
            <div className={styles.cardMeta}>
              <span>STATUS: NOMINAL</span>
              <span>120 FPS // ACTIVE</span>
            </div>
          </div>

          {/* Layer B (Emerald Security Matrix) */}
          <div
            className={styles.layerB}
            style={{ opacity: activeLayer === "B" ? 1 : 0 }}
          >
            <div>
              <span className={styles.cardTag}>ENCRYPTED VAULT // 02</span>
              <h4 className={styles.cardTitle}>Emerald Core Grid</h4>
              <p className={styles.cardDesc}>
                Air-gapped biometric verification token with physical quantum key distribution certificates.
              </p>
            </div>
            <div className={styles.cardMeta}>
              <span>CIPHER: AES-GCM</span>
              <span>AUTHENTICATED</span>
            </div>
          </div>

          {/* Dissolve matrix canvas */}
          <canvas ref={canvasRef} className={styles.dissolveCanvas} aria-hidden="true" />
        </div>
      </div>

      <div className={styles.overlay} data-preview-chrome>
        <div className={styles.badge}>
          <Grid size={12} aria-hidden="true" />
          <span>Quantized Tile Transition</span>
        </div>
        <h3 className={styles.title}>Pixel Matrix Dissolve</h3>
        <p className={styles.description}>
          Retro 8-bit quantized square transition matrix dissolving between two card states with randomized spatial ordering.
        </p>
      </div>

      <div className={styles.controls} data-preview-chrome>
        <div className={styles.controlGroup} role="toolbar" aria-label="Card controls">
          <button
            type="button"
            className={styles.btn}
            onClick={toggleLayer}
          >
            <RefreshCw size={13} aria-hidden="true" />
            <span>Dissolve Card (State {activeLayer})</span>
          </button>
        </div>

        <div className={styles.controlGroup} role="radiogroup" aria-label="Block grain size">
          <button
            type="button"
            className={`${styles.btn} ${pixelSize === 16 ? styles.active : ""}`}
            onClick={() => setPixelSize(16)}
            role="radio"
            aria-checked={pixelSize === 16}
          >
            <Grid size={13} aria-hidden="true" />
            <span>16px Retro Chunky</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${pixelSize === 8 ? styles.active : ""}`}
            onClick={() => setPixelSize(8)}
            role="radio"
            aria-checked={pixelSize === 8}
          >
            <span>8px Fine Matrix</span>
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { Sparkles, Eye, ShieldCheck } from "lucide-react";
import styles from "./holographic-glare-card.module.css";

export default function HolographicGlareCard() {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [tilt, setTilt] = useState({ rotX: 0, rotY: 0 });
  const [glareMode, setGlareMode] = useState<"prismatic" | "aurora">("prismatic");

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const px = (x / rect.width) * 100;
    const py = (y / rect.height) * 100;

    const normX = (x / rect.width) - 0.5;
    const normY = (y / rect.height) - 0.5;

    setGlarePos({ x: px, y: py });
    setTilt({
      rotX: -normY * 26,
      rotY: normX * 26,
    });
  };

  const handlePointerLeave = () => {
    setTilt({ rotX: 0, rotY: 0 });
    setGlarePos({ x: 50, y: 50 });
  };

  return (
    <div className={styles.container}>
      <div className={styles.centerStage}>
        <div
          ref={cardRef}
          className={styles.cardShell}
          style={{
            transform: `rotateX(${tilt.rotX}deg) rotateY(${tilt.rotY}deg)`,
            // Pass CSS variables for the specular glare shader coordinates
            ["--glare-x" as string]: `${glarePos.x}%`,
            ["--glare-y" as string]: `${glarePos.y}%`,
          }}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          role="region"
          aria-label="Holographic specimen smart card"
        >
          {/* Holographic prismatic foil layer */}
          <div
            className={styles.holographicFilm}
            style={{
              backgroundPosition: `${glarePos.x}% ${glarePos.y}%`,
            }}
            aria-hidden="true"
          />

          {/* Interactive specular glare highlight */}
          <div className={styles.glareHotspot} aria-hidden="true" />

          {/* Neumorphic tactile card content */}
          <div className={styles.cardContent}>
            <div className={styles.cardHeader}>
              <div className={styles.chipIcon} />
              <span className={styles.cardBrand}>ATLAS SECURE // TITANIUM</span>
            </div>

            <div className={styles.cardNumber}>
              •••• 4092 8816 7724
            </div>

            <div className={styles.cardFooter}>
              <div>
                <div className={styles.holderName}>SPECIMEN PROTOCOL</div>
                <div className={styles.holderExpiry}>VALID THRU 10/31</div>
              </div>
              <ShieldCheck size={20} color="#38bdf8" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.overlay} data-preview-chrome>
        <div className={styles.badge}>
          <Sparkles size={12} aria-hidden="true" />
          <span>Specular Diffraction Surface</span>
        </div>
        <h3 className={styles.title}>Holographic Glare Card</h3>
        <p className={styles.description}>
          Interactive 3D card tilt with dynamic specular reflection hotspot and prismatic chromatic diffraction foil.
        </p>
      </div>

      <div className={styles.controls} data-preview-chrome>
        <div className={styles.controlGroup} role="radiogroup" aria-label="Diffraction foil mode">
          <button
            type="button"
            className={`${styles.btn} ${glareMode === "prismatic" ? styles.active : ""}`}
            onClick={() => setGlareMode("prismatic")}
            role="radio"
            aria-checked={glareMode === "prismatic"}
          >
            <Sparkles size={13} aria-hidden="true" />
            <span>Prismatic Foil</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${glareMode === "aurora" ? styles.active : ""}`}
            onClick={() => setGlareMode("aurora")}
            role="radio"
            aria-checked={glareMode === "aurora"}
          >
            <Eye size={13} aria-hidden="true" />
            <span>Aurora Sheen</span>
          </button>
        </div>
      </div>
    </div>
  );
}

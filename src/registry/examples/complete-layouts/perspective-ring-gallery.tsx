"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, ChevronLeft, ChevronRight, Layers, ArrowRight } from "lucide-react";
import styles from "./perspective-ring-gallery.module.css";

interface RingCard {
  id: string;
  tag: string;
  title: string;
  desc: string;
  stat: string;
}

const GALLERY_CARDS: RingCard[] = [
  { id: "1", tag: "OPTICS", title: "Prism Burst", desc: "Refraction dispersion vectors.", stat: "48 BEAMS" },
  { id: "2", tag: "KINETIC", title: "Cyber Glitch", desc: "RGB channel slice matrix.", stat: "0 LATENCY" },
  { id: "3", tag: "PHYSICS", title: "Lightning Mesh", desc: "Dielectric arcing discharge.", stat: "4 STRIKES" },
  { id: "4", tag: "TACTILE", title: "Glass Dock", desc: "Liquid glass magnification.", stat: "7 SPECIMENS" },
  { id: "5", tag: "WEATHER", title: "Pixel Snow", desc: "Quantized 8-bit precipitation.", stat: "60 FPS" },
  { id: "6", tag: "WARP", title: "Light Tunnel", desc: "3D perspective star streaks.", stat: "WARP 5" },
];

export default function PerspectiveRingGallery() {
  const [rotation, setRotation] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const isPlayingRef = useRef(isPlaying);
  const lastPointerXRef = useRef<number | null>(null);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (isPlayingRef.current) {
        setRotation((prev) => (prev + dt * 18) % 360);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    lastPointerXRef.current = e.clientX;
    setIsPlaying(false);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (lastPointerXRef.current !== null) {
      const delta = e.clientX - lastPointerXRef.current;
      setRotation((prev) => prev + delta * 0.4);
      lastPointerXRef.current = e.clientX;
    }
  };

  const handlePointerUp = () => {
    lastPointerXRef.current = null;
  };

  const radius = 280;
  const count = GALLERY_CARDS.length;

  return (
    <div className={styles.container}>
      <div
        className={styles.centerStage}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        role="region"
        aria-label="3D Cylindrical Ring Media Reel"
      >
        <div
          className={styles.cylinderRing}
          style={{
            transform: `rotateY(${rotation}deg)`,
          }}
        >
          {GALLERY_CARDS.map((card, idx) => {
            const cardAngle = (idx / count) * 360;
            return (
              <div
                key={card.id}
                className={styles.cylinderItem}
                style={{
                  transform: `rotateY(${cardAngle}deg) translateZ(${radius}px)`,
                }}
                role="article"
                aria-label={`Gallery card: ${card.title}`}
              >
                <div>
                  <span className={styles.itemBadge}>// {card.tag}</span>
                  <h4 className={styles.itemHeading}>{card.title}</h4>
                  <p className={styles.itemExcerpt}>{card.desc}</p>
                </div>
                <div className={styles.itemFooter}>
                  <span>{card.stat}</span>
                  <ArrowRight size={13} aria-hidden="true" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.overlay} data-preview-chrome>
        <div className={styles.badge}>
          <Layers size={12} aria-hidden="true" />
          <span>3D Cylindrical Orbit Reel</span>
        </div>
        <h3 className={styles.title}>Perspective Ring Gallery</h3>
        <p className={styles.description}>
          3D cylindrical media carousel rotating on a continuous radial orbital track. Drag horizontally to spin the gallery.
        </p>
      </div>

      <div className={styles.controls} data-preview-chrome onClick={(e) => e.stopPropagation()}>
        <div className={styles.controlGroup} role="toolbar" aria-label="Carousel controls">
          <button
            type="button"
            className={`${styles.btn} ${isPlaying ? styles.active : ""}`}
            onClick={() => setIsPlaying(!isPlaying)}
            aria-pressed={isPlaying}
          >
            {isPlaying ? <Pause size={13} aria-hidden="true" /> : <Play size={13} aria-hidden="true" />}
            <span>{isPlaying ? "Pause Rotation" : "Auto Spin"}</span>
          </button>
          <button
            type="button"
            className={styles.btn}
            onClick={() => setRotation((prev) => prev - 60)}
            aria-label="Previous card"
          >
            <ChevronLeft size={13} aria-hidden="true" />
            <span>Prev</span>
          </button>
          <button
            type="button"
            className={styles.btn}
            onClick={() => setRotation((prev) => prev + 60)}
            aria-label="Next card"
          >
            <span>Next</span>
            <ChevronRight size={13} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

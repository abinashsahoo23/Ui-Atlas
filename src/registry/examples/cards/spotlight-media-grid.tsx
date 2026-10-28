"use client";

import { useRef } from "react";
import { Sparkles, Terminal, Cpu, Database, ArrowRight } from "lucide-react";
import styles from "./spotlight-media-grid.module.css";

interface GridItem {
  id: string;
  title: string;
  desc: string;
  icon: typeof Terminal;
  metric: string;
}

const ITEMS: GridItem[] = [
  {
    id: "compute",
    title: "Neural Engine",
    desc: "Dedicated tensor compilation with zero overhead execution.",
    icon: Cpu,
    metric: "0.4ms LATENCY",
  },
  {
    id: "memory",
    title: "Persistent Vault",
    desc: "Hardware cryptographic state sync with distributed quorum.",
    icon: Database,
    metric: "99.999% SLA",
  },
  {
    id: "runtime",
    title: "Terminal Fabric",
    desc: "Real-time bidirectional event streaming and inspection.",
    icon: Terminal,
    metric: "120 FPS STREAM",
  },
];

function SpotlightItem({ item }: { item: GridItem }) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const Icon = item.icon;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      className={styles.spotlightCard}
      onPointerMove={handlePointerMove}
      role="region"
      aria-label={`Showcase item: ${item.title}`}
    >
      <div className={styles.spotlightLayer} aria-hidden="true" />
      <div className={styles.cardBody}>
        <div>
          <div className={styles.cardIconBox}>
            <Icon size={18} aria-hidden="true" />
          </div>
          <h4 className={styles.itemTitle}>{item.title}</h4>
          <p className={styles.itemDesc}>{item.desc}</p>
        </div>
        <div className={styles.itemFooter}>
          <span>{item.metric}</span>
          <ArrowRight size={13} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

export default function SpotlightMediaGrid() {
  return (
    <div className={styles.container}>
      <div className={styles.centerStage}>
        <div className={styles.cardGrid}>
          {ITEMS.map((item) => (
            <SpotlightItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      <div className={styles.overlay} data-preview-chrome>
        <div className={styles.badge}>
          <Sparkles size={12} aria-hidden="true" />
          <span>Multi-Cell Cursor Illumination</span>
        </div>
        <h3 className={styles.title}>Spotlight Media Grid</h3>
        <p className={styles.description}>
          Independent radial coordinate light tracker revealing illuminated chromatic borders and ambient highlights across grid cells.
        </p>
      </div>

      <div className={styles.controls} data-preview-chrome>
        <div className={styles.controlGroup}>
          <span className={styles.btn}>✦ Move cursor across grid cells</span>
        </div>
      </div>
    </div>
  );
}

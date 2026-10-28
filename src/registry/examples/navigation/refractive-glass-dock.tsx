"use client";

import { useRef, useState } from "react";
import { Terminal, Compass, Layers, Shield, Sparkles, Database, Cpu } from "lucide-react";
import styles from "./refractive-glass-dock.module.css";

interface DockIcon {
  id: string;
  name: string;
  icon: typeof Terminal;
}

const DOCK_ITEMS: DockIcon[] = [
  { id: "terminal", name: "Atlas Shell", icon: Terminal },
  { id: "navigation", name: "Wayfinder", icon: Compass },
  { id: "specimens", name: "Registry", icon: Layers },
  { id: "security", name: "Vault Guard", icon: Shield },
  { id: "optics", name: "Optics Lab", icon: Sparkles },
  { id: "database", name: "Telemetry Store", icon: Database },
  { id: "compute", name: "Quantum Core", icon: Cpu },
];

export default function RefractiveGlassDock() {
  const [activeItemId, setActiveItemId] = useState<string>("terminal");
  const [mousePos, setMousePos] = useState<number | null>(null);
  const dockRef = useRef<HTMLDivElement | null>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const dock = dockRef.current;
    if (!dock) return;
    const rect = dock.getBoundingClientRect();
    setMousePos(e.clientX - rect.left);
  };

  const handlePointerLeave = () => {
    setMousePos(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.centerStage}>
        <div
          ref={dockRef}
          className={styles.dockTray}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          role="toolbar"
          aria-label="Refractive glass application launcher dock"
        >
          {DOCK_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            let scale = 1;

            if (mousePos !== null && dockRef.current) {
              const itemCenter = idx * (48 + 12) + 24 + 20; // Estimated center in tray
              const dist = Math.abs(mousePos - itemCenter);
              if (dist < 120) {
                scale = 1 + (1 - dist / 120) * 0.45;
              }
            }

            return (
              <button
                key={item.id}
                type="button"
                className={styles.dockItem}
                style={{
                  transform: `scale(${scale}) translateY(-${(scale - 1) * 20}px)`,
                }}
                onClick={() => setActiveItemId(item.id)}
                aria-label={`Launch ${item.name}`}
              >
                <div className={styles.tooltip}>{item.name}</div>
                <Icon size={22} aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.overlay} data-preview-chrome>
        <div className={styles.badge}>
          <Sparkles size={12} aria-hidden="true" />
          <span>Frosted Liquid Glass Tray</span>
        </div>
        <h3 className={styles.title}>Refractive Glass Dock</h3>
        <p className={styles.description}>
          Translucent glass launcher dock with physical distance-based magnification scaling and animated tooltips.
        </p>
      </div>

      <div className={styles.controls} data-preview-chrome>
        <div className={styles.controlGroup}>
          <span className={styles.btn}>✦ Active Specimen: {DOCK_ITEMS.find((d) => d.id === activeItemId)?.name}</span>
        </div>
      </div>
    </div>
  );
}

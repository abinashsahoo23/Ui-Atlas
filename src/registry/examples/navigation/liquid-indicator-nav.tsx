"use client";

import { useEffect, useRef, useState } from "react";
import { Compass, Layers, Shield, Activity } from "lucide-react";
import styles from "./liquid-indicator-nav.module.css";

interface NavSegment {
  id: string;
  label: string;
  icon: typeof Compass;
}

const NAV_ITEMS: NavSegment[] = [
  { id: "overview", label: "Overview", icon: Compass },
  { id: "specimens", label: "Specimens", icon: Layers },
  { id: "telemetry", label: "Telemetry", icon: Activity },
  { id: "security", label: "Security", icon: Shield },
];

export default function LiquidIndicatorNav() {
  const [activeId, setActiveId] = useState<string>("overview");
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 4, width: 90 });
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const idx = NAV_ITEMS.findIndex((item) => item.id === activeId);
    const btn = buttonsRef.current[idx];
    const bar = barRef.current;
    if (btn && bar) {
      const barRect = bar.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      setIndicatorStyle({
        left: btnRect.left - barRect.left,
        width: btnRect.width,
      });
    }
  }, [activeId]);

  return (
    <div className={styles.container}>
      <div className={styles.centerStage}>
        <div ref={barRef} className={styles.navPillBar} role="tablist" aria-label="Fluid pill navigation">
          {/* Animated sliding fluid pill indicator */}
          <div
            className={styles.indicatorPill}
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
            }}
            aria-hidden="true"
          />

          {NAV_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            const isActive = item.id === activeId;
            return (
              <button
                key={item.id}
                ref={(el) => {
                  buttonsRef.current[idx] = el;
                }}
                type="button"
                role="tab"
                className={`${styles.navItem} ${isActive ? styles.active : ""}`}
                onClick={() => setActiveId(item.id)}
                aria-selected={isActive}
              >
                <Icon size={14} aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.overlay} data-preview-chrome>
        <div className={styles.badge}>
          <Compass size={12} aria-hidden="true" />
          <span>Viscous Pill Metric Tracker</span>
        </div>
        <h3 className={styles.title}>Liquid Indicator Nav</h3>
        <p className={styles.description}>
          Fluid sliding pill indicator with spring snap physics and accessible tab keyboard navigation.
        </p>
      </div>

      <div className={styles.controls} data-preview-chrome>
        <div className={styles.controlGroup}>
          <span className={styles.btn}>✦ Active Section: {NAV_ITEMS.find((n) => n.id === activeId)?.label}</span>
        </div>
      </div>
    </div>
  );
}

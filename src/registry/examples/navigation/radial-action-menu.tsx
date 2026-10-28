"use client";

import { useState, useEffect } from "react";
import { Plus, Eye, Share2, Bookmark, Download, Settings, RefreshCw, X } from 'lucide-react';
import styles from "./radial-action-menu.module.css";

const ACTIONS = [
  { id: "inspect", label: "Inspect Specimen", icon: Eye },
  { id: "share", label: "Share Artifact", icon: Share2 },
  { id: "bookmark", label: "Pin to Desk", icon: Bookmark },
  { id: "export", label: "Export Source", icon: Download },
  { id: "sync", label: "Live Reload", icon: RefreshCw },
  { id: "config", label: "Tune Parameters", icon: Settings },
];

export default function RadialActionMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleActionClick = (label: string) => {
    setActiveAction(label);
    setIsOpen(false);
    setTimeout(() => setActiveAction(null), 2500);
  };

  const radius = 95; // Radius in pixels
  const total = ACTIONS.length;

  return (
    <div className={styles.container}>
      <div className={styles.stage} onClick={() => isOpen && setIsOpen(false)}>
        {isOpen && (
          <div className={styles.radialRing} aria-hidden="true">
            <svg width="240" height="240" viewBox="0 0 240 240" className={styles.ringSvg}>
              <circle cx="120" cy="120" r="95" className={styles.guideCircle} />
            </svg>
          </div>
        )}

        <div className={styles.menuAnchor}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen((prev) => !prev);
            }}
            className={styles.centerButton}
            data-open={isOpen}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close action menu" : "Open radial actions menu"}
          >
            {isOpen ? <X size={20} /> : <Plus size={22} />}
          </button>

          {ACTIONS.map((item, index) => {
            const Icon = item.icon;
            // Distribute evenly around 360 degrees
            const angle = (index * (360 / total) - 90) * (Math.PI / 180);
            const x = Math.round(radius * Math.cos(angle));
            const y = Math.round(radius * Math.sin(angle));

            return (
              <button
                key={item.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleActionClick(item.label);
                }}
                className={styles.orbitButton}
                style={{
                  transform: isOpen ? `translate(${x}px, ${y}px) scale(1)` : "translate(0, 0) scale(0)",
                  opacity: isOpen ? 1 : 0,
                  transitionDelay: isOpen ? `${index * 30}ms` : "0ms",
                }}
                aria-label={item.label}
                tabIndex={isOpen ? 0 : -1}
              >
                <Icon size={16} aria-hidden="true" />
                <span className={styles.tooltip}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <footer className={styles.statusFooter}>
        {activeAction ? (
          <span className={styles.activeFeedback}>Executed: {activeAction}</span>
        ) : (
          <span className={styles.hint} data-preview-chrome>Click the central hub to deploy radial actions</span>
        )}
      </footer>
    </div>
  );
}

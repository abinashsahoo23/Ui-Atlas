'use client';

import React, { useState, useRef } from 'react';
import { ShieldAlert, Terminal, ArrowUpRight, Cpu } from 'lucide-react';
import styles from './spotlight-border-panel.module.css';

export function SpotlightBorderPanel() {
  const panelRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 200, y: 150 });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isDealt, setIsDealt] = useState<boolean>(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className={styles.wrapper}>
      <div
        ref={panelRef}
        className={`${styles.spotlightCard} ${isHovered ? styles.active : ''}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          '--spotlight-x': `${coords.x}px`,
          '--spotlight-y': `${coords.y}px`,
        } as React.CSSProperties}
      >
        {/* Spotlight dynamic border layer */}
        <div className={styles.spotlightBorder} aria-hidden="true" />

        {/* Card inner surface */}
        <div className={styles.cardContent}>
          <div className={styles.topRow}>
            <div className={styles.categoryBadge}>
              <Cpu size={13} />
              <span>Core Engine</span>
            </div>
            <span className={styles.statusDot}>Operational</span>
          </div>

          <div className={styles.iconContainer}>
            <Terminal className={styles.mainIcon} size={24} />
          </div>

          <h3 className={styles.title}>Quantum Isolation Boundary</h3>
          <p className={styles.description}>
            Cryptographically sealed execution sandbox with zero-trust IPC routing and automated process containment.
          </p>

          <div className={styles.metaGrid}>
            <div className={styles.metaCell}>
              <span className={styles.metaLabel}>Latency</span>
              <strong className={styles.metaVal}>0.42 ms</strong>
            </div>
            <div className={styles.metaCell}>
              <span className={styles.metaLabel}>Cipher Suite</span>
              <strong className={styles.metaVal}>AES-256-GCM</strong>
            </div>
          </div>

          <div className={styles.actionRow}>
            <button
              onClick={() => setIsDealt(!isDealt)}
              className={styles.deployBtn}
            >
              <span>{isDealt ? 'Isolation Verified' : 'Deploy Boundary'}</span>
              <ArrowUpRight size={15} />
            </button>
            {isDealt && (
              <span className={styles.feedbackToast}>
                <ShieldAlert size={13} /> Boundary active
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

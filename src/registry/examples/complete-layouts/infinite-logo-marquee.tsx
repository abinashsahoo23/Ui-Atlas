'use client';

import React, { useState } from 'react';
import { Repeat, Play, Pause, ArrowLeft, ArrowRight, Sparkles, Cpu, Layers, Database, Shield, Radio, Terminal, Box } from 'lucide-react';
import styles from './infinite-logo-marquee.module.css';

interface TechBadge {
  name: string;
  category: string;
  icon: React.ElementType;
}

const TECH_BADGES: TechBadge[] = [
  { name: 'Rust Engine', category: 'Kernel', icon: Cpu },
  { name: 'WebAssembly', category: 'Runtime', icon: Box },
  { name: 'Next.js Turbopack', category: 'Frontend', icon: Layers },
  { name: 'Distributed Parquet', category: 'Storage', icon: Database },
  { name: 'Zero-Trust IPC', category: 'Security', icon: Shield },
  { name: 'QUIC / HTTP3', category: 'Network', icon: Radio },
  { name: 'Embedded Zsh', category: 'CLI', icon: Terminal },
];

export function InfiniteLogoMarquee() {
  const [speed, setSpeed] = useState<'normal' | 'fast' | 'slow'>('normal');
  const [direction, setDirection] = useState<'left' | 'right'>('left');
  const [pauseOnHover, setPauseOnHover] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [accentMode, setAccentMode] = useState<boolean>(false);

  // Duplicate elements for seamless infinite marquee loop
  const duplicatedBadges = [...TECH_BADGES, ...TECH_BADGES];

  return (
    <div className={styles.container}>
      {/* Header controls */}
      <div className={styles.header}>
        <div className={styles.badge} data-preview-chrome>
          <Repeat size={13} />
          <span>Infinite Technology Marquee</span>
        </div>

        <div className={styles.controlsRow} data-preview-chrome>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`${styles.ctrlBtn} ${isPaused ? styles.activeCtrl : ''}`}
            aria-label={isPaused ? 'Resume marquee' : 'Pause marquee'}
          >
            {isPaused ? <Play size={12} /> : <Pause size={12} />}
          </button>

          <button
            onClick={() => setDirection(direction === 'left' ? 'right' : 'left')}
            className={styles.ctrlBtn}
            aria-label="Toggle direction"
          >
            {direction === 'left' ? <ArrowLeft size={12} /> : <ArrowRight size={12} />}
          </button>

          <div className={styles.speedGroup}>
            {(['slow', 'normal', 'fast'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`${styles.speedBtn} ${speed === s ? styles.activeSpeed : ''}`}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            onClick={() => setAccentMode(!accentMode)}
            className={`${styles.accentToggle} ${accentMode ? styles.accentActive : ''}`}
          >
            <Sparkles size={12} />
            <span>Accent</span>
          </button>
        </div>
      </div>

      {/* Marquee Viewport with gradient fade masks */}
      <div
        className={`${styles.marqueeViewport} ${pauseOnHover ? styles.pauseOnHover : ''} ${
          isPaused ? styles.paused : ''
        }`}
      >
        <div className={styles.maskLeft} aria-hidden="true" />
        <div className={styles.maskRight} aria-hidden="true" />

        <div
          className={`${styles.marqueeTrack} ${styles[speed]} ${
            direction === 'right' ? styles.reverse : ''
          }`}
        >
          {duplicatedBadges.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={`${item.name}-${idx}`}
                className={`${styles.techCard} ${accentMode ? styles.accentCard : ''}`}
              >
                <div className={styles.iconCircle}>
                  <Icon size={16} />
                </div>
                <div className={styles.textGroup}>
                  <span className={styles.techName}>{item.name}</span>
                  <span className={styles.techCat}>{item.category}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footnote configuration status */}
      <div className={styles.footerNote}>
        <span>Direction: {direction} | Speed: {speed} | Pause-on-hover: {pauseOnHover ? 'enabled' : 'disabled'}</span>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={pauseOnHover}
            onChange={(e) => setPauseOnHover(e.target.checked)}
          />
          <span>Pause on hover</span>
        </label>
      </div>
    </div>
  );
}

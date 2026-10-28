'use client';

import React, { useState } from 'react';
import { Layers, Compass, Eye, Sparkles } from 'lucide-react';
import styles from './topographic-contour-field.module.css';

type ThemePreset = 'monochrome' | 'emerald' | 'amber';

export function TopographicContourField() {
  const [theme, setTheme] = useState<ThemePreset>('emerald');
  const [elevationLevel, setElevationLevel] = useState<number>(4);
  const [isFlowing, setIsFlowing] = useState<boolean>(true);

  // Generate deterministic layered contour SVG curves
  const contourPaths = [
    'M 20,280 C 140,240 220,320 380,260 C 540,200 640,300 780,240',
    'M 40,250 C 160,200 240,290 400,230 C 560,170 660,270 800,210',
    'M 60,220 C 180,160 260,260 420,200 C 580,140 680,240 820,180',
    'M 80,190 C 200,130 280,230 440,170 C 600,110 700,210 840,150',
    'M 100,160 C 220,100 300,200 460,140 C 620,80 720,180 860,120',
    'M 120,130 C 240,70 320,170 480,110 C 640,50 740,150 880,90',
    'M 150,100 C 270,40 350,140 510,80 C 670,20 770,120 900,60',
  ];

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      {/* Background Topographic Canvas */}
      <div className={`${styles.canvasWrapper} ${isFlowing ? styles.flowing : ''}`}>
        <svg
          viewBox="0 0 920 360"
          className={styles.contourSvg}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="contourGradEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#065f46" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#022c22" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="contourGradAmber" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#b45309" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#451a03" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="contourGradMono" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#475569" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {contourPaths.slice(0, elevationLevel + 3).map((d, index) => (
            <path
              key={index}
              d={d}
              className={styles.contourPath}
              style={{
                animationDelay: `${index * 0.4}s`,
                opacity: 0.25 + index * 0.12,
                strokeWidth: index % 2 === 0 ? 1.5 : 1,
              }}
            />
          ))}

          {/* Elevation markers */}
          <g className={styles.elevationMarkers}>
            <circle cx="420" cy="200" r="3" fill="currentColor" />
            <text x="430" y="204" className={styles.markerText}>+1,420M</text>
            <circle cx="640" cy="140" r="3" fill="currentColor" />
            <text x="650" y="144" className={styles.markerText}>+1,880M</text>
          </g>
        </svg>
      </div>

      {/* Floating Foreground Overlay */}
      <div className={styles.overlayContent} data-preview-chrome>
        <div className={styles.headerBadge}>
          <Compass className={styles.badgeIcon} size={14} />
          <span>Cartographic Specimen — Ridge 08</span>
        </div>

        <h3 className={styles.title}>Topographic Vector Field</h3>
        <p className={styles.subtitle}>
          Harmonic mathematical contours simulating terrain elevation gradients with smooth continuous flow.
        </p>

        {/* Interactive Controls Bar */}
        <div className={styles.controlsBar} data-preview-chrome>
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>
              <Layers size={13} /> Elevation Bands ({elevationLevel})
            </span>
            <input
              type="range"
              min="1"
              max="4"
              value={elevationLevel}
              onChange={(e) => setElevationLevel(Number(e.target.value))}
              className={styles.rangeInput}
              aria-label="Elevation band count"
            />
          </div>

          <div className={styles.themeButtons}>
            {(['emerald', 'amber', 'monochrome'] as ThemePreset[]).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`${styles.themeBtn} ${theme === t ? styles.activeTheme : ''}`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsFlowing(!isFlowing)}
            className={`${styles.flowToggle} ${isFlowing ? styles.flowingActive : ''}`}
            aria-pressed={isFlowing}
          >
            {isFlowing ? <Sparkles size={13} /> : <Eye size={13} />}
            <span>{isFlowing ? 'Wave Active' : 'Static Mode'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useRef } from 'react';
import { Disc, Sun, Sliders, RefreshCw } from 'lucide-react';
import styles from './liquid-chrome-orb.module.css';

type ChromePreset = 'mercury' | 'iridescent' | 'cyberpunk';

export function LiquidChromeOrb() {
  const [preset, setPreset] = useState<ChromePreset>('mercury');
  const [intensity, setIntensity] = useState<number>(75);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const orbRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!orbRef.current) return;
    const rect = orbRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const normX = (e.clientX - centerX) / (rect.width / 2);
    const normY = (e.clientY - centerY) / (rect.height / 2);

    setTilt({
      x: Math.max(-1, Math.min(1, normX)),
      y: Math.max(-1, Math.min(1, normY)),
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const resetOrientation = () => {
    setTilt({ x: 0, y: 0 });
    setIntensity(75);
  };

  return (
    <div
      className={`${styles.container} ${styles[preset]}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.ambientBackdrop} aria-hidden="true" />

      {/* 3D Liquid Orb */}
      <div
        ref={orbRef}
        className={styles.orbStage}
        style={{
          transform: `rotateX(${-tilt.y * 22}deg) rotateY(${tilt.x * 22}deg)`,
        }}
      >
        <div
          className={styles.chromeSphere}
          style={{
            filter: `contrast(${100 + intensity * 0.4}%) brightness(${90 + intensity * 0.2}%)`,
          }}
        >
          {/* Specular reflections & liquid light shifts */}
          <div
            className={styles.specularHotspot}
            style={{
              transform: `translate(${tilt.x * 35}px, ${tilt.y * 35}px)`,
            }}
          />
          <div
            className={styles.fluidRefraction}
            style={{
              transform: `rotate(${tilt.x * 45}deg) scale(${1 + intensity / 300})`,
            }}
          />
          <div className={styles.rimLight} />
        </div>

        {/* Dynamic drop shadow under the floating orb */}
        <div
          className={styles.orbShadow}
          style={{
            transform: `translate(${tilt.x * 12}px, 20px) scale(${1 - Math.abs(tilt.y) * 0.1})`,
          }}
        />
      </div>

      {/* Floating Control Glass Panel */}
      <div className={styles.controlPanel} data-preview-chrome>
        <div className={styles.panelHeader}>
          <div className={styles.badge}>
            <Disc size={13} />
            <span>Fluid Specimen 03</span>
          </div>
          <button
            onClick={resetOrientation}
            className={styles.resetBtn} data-preview-chrome
            title="Reset Orb Position"
            aria-label="Reset position and intensity"
          >
            <RefreshCw size={12} />
          </button>
        </div>

        <div className={styles.presetSelectors} data-preview-chrome>
          {(['mercury', 'iridescent', 'cyberpunk'] as ChromePreset[]).map((p) => (
            <button
              key={p}
              onClick={() => setPreset(p)}
              className={`${styles.presetBtn} ${preset === p ? styles.activePreset : ''}`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className={styles.sliderControl}>
          <div className={styles.sliderLabel}>
            <Sliders size={12} />
            <span>Reflective Luster</span>
            <span className={styles.sliderVal}>{intensity}%</span>
          </div>
          <input
            type="range"
            min="25"
            max="125"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className={styles.rangeInput}
            aria-label="Orb reflective luster"
          />
        </div>

        <div className={styles.orientationStatus}>
          <Sun size={12} />
          <span>Light Angle: X: {Math.round(tilt.x * 100)}% | Y: {Math.round(tilt.y * 100)}%</span>
        </div>
      </div>
    </div>
  );
}

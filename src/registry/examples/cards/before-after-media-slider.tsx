'use client';

import React, { useState, useRef, useCallback } from 'react';
import { SlidersHorizontal, RotateCcw, Code, Sparkles } from 'lucide-react';
import styles from './before-after-media-slider.module.css';

export function BeforeAfterMediaSlider() {
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clampedPercentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(Math.round(clampedPercentage));
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches[0]) {
      updatePosition(e.touches[0].clientX);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      setSliderPos((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      setSliderPos((prev) => Math.min(100, prev + 5));
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Top Header Controls */}
      <div className={styles.header}>
        <div className={styles.badge} data-preview-chrome>
          <SlidersHorizontal size={13} />
          <span>Interactive Media Comparison</span>
        </div>
        <div className={styles.actions} data-preview-chrome>
          <button
            onClick={() => setSliderPos(25)}
            className={`${styles.presetBtn} ${sliderPos === 25 ? styles.activePreset : ''}`}
          >
            25%
          </button>
          <button
            onClick={() => setSliderPos(50)}
            className={`${styles.presetBtn} ${sliderPos === 50 ? styles.activePreset : ''}`}
          >
            50%
          </button>
          <button
            onClick={() => setSliderPos(75)}
            className={`${styles.presetBtn} ${sliderPos === 75 ? styles.activePreset : ''}`}
          >
            75%
          </button>
          <button
            onClick={() => setSliderPos(50)}
            className={styles.resetBtn} data-preview-chrome
            title="Reset slider to 50%"
            aria-label="Reset slider"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* Comparison Viewport */}
      <div
        ref={containerRef}
        className={styles.viewport}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        role="slider"
        aria-valuenow={sliderPos}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Before and after split slider"
      >
        {/* "After" Production Render View (Base Layer) */}
        <div className={styles.renderedLayer}>
          <div className={styles.layerContent}>
            <div className={styles.productionHero}>
              <div className={styles.productionGlow} />
              <div className={styles.badgeProduction}>
                <Sparkles size={12} />
                <span>Production Shader UI</span>
              </div>
              <h3 className={styles.renderedTitle}>Quantum Core Visualizer</h3>
              <p className={styles.renderedText}>
                Rich physical simulation rendering with real-time volumetric irradiance and sub-surface scattering.
              </p>
              <div className={styles.renderedStats}>
                <div className={styles.statBox}>
                  <span>FPS</span>
                  <strong>120</strong>
                </div>
                <div className={styles.statBox}>
                  <span>Passes</span>
                  <strong>8x MSAA</strong>
                </div>
              </div>
            </div>
          </div>
          <span className={styles.tagAfter}>AFTER: PRODUCTION</span>
        </div>

        {/* "Before" Wireframe View (Clipped Top Layer) */}
        <div
          className={styles.wireframeLayer}
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <div className={styles.layerContent}>
            <div className={styles.wireframeHero}>
              <div className={styles.wireframeGrid} />
              <div className={styles.badgeWireframe}>
                <Code size={12} />
                <span>Wireframe Topology</span>
              </div>
              <h3 className={styles.wireframeTitle}>Quantum Core Visualizer</h3>
              <p className={styles.wireframeText}>
                Untextured raw wireframe vertex matrix with bounding mesh polygons and debug edge indicators.
              </p>
              <div className={styles.wireframeStats}>
                <div className={styles.wireframeBox}>
                  <span>VERTS</span>
                  <strong>14,240</strong>
                </div>
                <div className={styles.wireframeBox}>
                  <span>TRIS</span>
                  <strong>28,480</strong>
                </div>
              </div>
            </div>
          </div>
          <span className={styles.tagBefore}>BEFORE: WIREFRAME</span>
        </div>

        {/* Draggable Divider Handle */}
        <div
          className={styles.handle}
          style={{ left: `${sliderPos}%` }}
        >
          <div className={styles.handleLine} />
          <div className={styles.handleKnob}>
            <SlidersHorizontal size={14} />
          </div>
        </div>
      </div>
    </div>
  );
}

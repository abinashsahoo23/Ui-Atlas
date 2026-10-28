'use client';

import React, { useState } from 'react';
import { Expand, Sparkles, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import styles from './scroll-expansion-media-hero.module.css';

export function ScrollExpansionMediaHero() {
  const [expansionProgress, setExpansionProgress] = useState<number>(35); // 0 (contained) to 100 (full width cinema)

  const mediaWidth = 60 + (expansionProgress / 100) * 40; // 60% to 100%
  const mediaHeight = 220 + (expansionProgress / 100) * 120; // 220px to 340px
  const borderRadius = 16 - (expansionProgress / 100) * 10; // 16px down to 6px

  return (
    <div className={styles.container}>
      {/* Editorial Headline Section */}
      <div className={styles.heroText}>
        <div className={styles.eyebrow}>
          <Sparkles size={12} />
          <span>Cinematics & Audio Laboratory</span>
        </div>
        <h2 className={styles.mainTitle}>Spatial Acoustic Synthesis</h2>
        <p className={styles.description}>
          Next-generation binaural room impulse modeling engineered for hyper-real virtual environments.
        </p>

        {/* Manual Interactive Expansion Scrubber */}
        <div className={styles.scrubberRow} data-preview-chrome>
          <span className={styles.scrubLabel}>
            <Expand size={13} /> Scroll Expansion Scrub ({expansionProgress}%)
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={expansionProgress}
            onChange={(e) => setExpansionProgress(Number(e.target.value))}
            className={styles.rangeInput}
            aria-label="Expansion progress scrubber"
          />
        </div>
      </div>

      {/* Expanding Media Panel */}
      <div className={styles.mediaStage}>
        <div
          className={styles.expandingPanel}
          style={{
            width: `${mediaWidth}%`,
            height: `${mediaHeight}px`,
            borderRadius: `${borderRadius}px`,
          }}
        >
          {/* Internal visual composition */}
          <div className={styles.mediaArtwork}>
            <div className={styles.meshGlow} />
            <div className={styles.waveSvgContainer}>
              <svg viewBox="0 0 600 200" className={styles.soundWave} aria-hidden="true">
                <path
                  d="M 10,100 Q 150,20 300,100 T 590,100"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  opacity="0.8"
                />
                <path
                  d="M 10,100 Q 150,180 300,100 T 590,100"
                  fill="none"
                  stroke="#818cf8"
                  strokeWidth="1.5"
                  opacity="0.6"
                />
              </svg>
            </div>

            <button className={styles.playButton} aria-label="Play acoustic preview">
              <Play size={20} fill="currentColor" />
            </button>
          </div>

          {/* Metadata Revealed at higher expansion */}
          <div
            className={styles.revealedMetadata}
            style={{
              opacity: Math.max(0, (expansionProgress - 30) / 70),
              transform: `translateY(${(100 - expansionProgress) * 0.2}px)`,
            }}
          >
            <div className={styles.metaBadge}>
              <CheckCircle2 size={12} />
              <span>32-Channel Ambisonics</span>
            </div>
            <div className={styles.metaBadge}>
              <CheckCircle2 size={12} />
              <span>HRTF Convolution Kernel 4.2</span>
            </div>
            <div className={styles.metaBadge}>
              <CheckCircle2 size={12} />
              <span>0.18ms Group Delay</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Call to Action Footnote */}
      <div className={styles.ctaRow}>
        <button className={styles.primaryCta}>
          <span>Access Soundstage Beta</span>
          <ArrowRight size={14} />
        </button>
        <span className={styles.footnote}>Cross-platform WebAssembly audio worklet bundle included.</span>
      </div>
    </div>
  );
}

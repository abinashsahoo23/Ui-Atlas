'use client';

import React, { useState } from 'react';
import { Layers, ChevronDown, ChevronUp, Zap, Globe, Sparkles, Database } from 'lucide-react';
import styles from './stacked-scroll-gallery.module.css';

interface GalleryCard {
  id: string;
  step: string;
  title: string;
  subtitle: string;
  metric: string;
  metricLabel: string;
  icon: React.ElementType;
  gradient: string;
  accent: string;
}

const GALLERY_CARDS: GalleryCard[] = [
  {
    id: 'layer-1',
    step: 'LAYER 01',
    title: 'Kinetic Ingestion Pipeline',
    subtitle: 'Ultra-low latency streaming architecture processing 1.4M events/sec across hybrid nodes.',
    metric: '1.4M/s',
    metricLabel: 'Event Throughput',
    icon: Zap,
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
    accent: '#818cf8',
  },
  {
    id: 'layer-2',
    step: 'LAYER 02',
    title: 'Distributed Vector Mesh',
    subtitle: 'Sub-millisecond semantic index mapping across 32 geodistributed edge clusters.',
    metric: '0.8 ms',
    metricLabel: 'Nearest Neighbor Recall',
    icon: Globe,
    gradient: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
    accent: '#34d399',
  },
  {
    id: 'layer-3',
    step: 'LAYER 03',
    title: 'Autonomous Synthesis Agent',
    subtitle: 'Continuous contextual distillation synthesising multi-modal telemetry streams in real time.',
    metric: '99.98%',
    metricLabel: 'Deterministic Confidence',
    icon: Sparkles,
    gradient: 'linear-gradient(135deg, #451a03 0%, #78350f 100%)',
    accent: '#fbbf24',
  },
  {
    id: 'layer-4',
    step: 'LAYER 04',
    title: 'Cold Parquet Archival Vault',
    subtitle: 'Self-indexing columnar storage with immutable zstandard cryptographic compaction.',
    metric: '4.2 PB',
    metricLabel: 'Compacted Index Size',
    icon: Database,
    gradient: 'linear-gradient(135deg, #4c0519 0%, #881337 100%)',
    accent: '#fb7185',
  },
];

export function StackedScrollGallery() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const handleNext = () => {
    setActiveStep((prev) => Math.min(GALLERY_CARDS.length - 1, prev + 1));
  };

  const handlePrev = () => {
    setActiveStep((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className={styles.container}>
      {/* Header bar */}
      <div className={styles.header}>
        <div className={styles.badge} data-preview-chrome>
          <Layers size={13} />
          <span>Cinematic Stack Gallery</span>
        </div>
        <div className={styles.controls} data-preview-chrome>
          <button
            onClick={handlePrev}
            disabled={activeStep === 0}
            className={styles.navBtn}
            aria-label="Previous stacked card"
          >
            <ChevronUp size={16} />
          </button>
          <span className={styles.counter}>
            {activeStep + 1} / {GALLERY_CARDS.length}
          </span>
          <button
            onClick={handleNext}
            disabled={activeStep === GALLERY_CARDS.length - 1}
            className={styles.navBtn}
            aria-label="Next stacked card"
          >
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {/* Stacked Cards Deck */}
      <div className={styles.deckContainer}>
        {GALLERY_CARDS.map((card, index) => {
          const Icon = card.icon;
          const isPassed = index < activeStep;
          const isCurrent = index === activeStep;
          const isFuture = index > activeStep;

          let translateY = 0;
          let scale = 1;
          let opacity = 1;

          if (isPassed) {
            translateY = -((activeStep - index) * 16);
            scale = 1 - (activeStep - index) * 0.05;
            opacity = 0.5;
          } else if (isCurrent) {
            translateY = 0;
            scale = 1;
            opacity = 1;
          } else if (isFuture) {
            translateY = (index - activeStep) * 40;
            scale = 1 - (index - activeStep) * 0.04;
            opacity = 0.3;
          }

          return (
            <div
              key={card.id}
              className={`${styles.card} ${isCurrent ? styles.currentCard : ''}`}
              style={{
                zIndex: index,
                background: card.gradient,
                borderColor: isCurrent ? card.accent : 'rgba(255, 255, 255, 0.1)',
                transform: `translateY(${translateY}px) scale(${scale})`,
                opacity,
              }}
              onClick={() => setActiveStep(index)}
            >
              <div className={styles.cardHeader}>
                <span className={styles.stepBadge} style={{ color: card.accent }}>
                  {card.step}
                </span>
                <div
                  className={styles.iconCircle}
                  style={{ background: `rgba(255, 255, 255, 0.1)`, color: card.accent }}
                >
                  <Icon size={18} />
                </div>
              </div>

              <h4 className={styles.cardTitle}>{card.title}</h4>
              <p className={styles.cardSubtitle}>{card.subtitle}</p>

              <div className={styles.metricRow}>
                <div className={styles.metricBlock}>
                  <strong className={styles.metricNum} style={{ color: card.accent }}>
                    {card.metric}
                  </strong>
                  <span className={styles.metricText}>{card.metricLabel}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

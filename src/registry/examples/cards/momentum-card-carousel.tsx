'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Compass, ArrowRight } from 'lucide-react';
import styles from './momentum-card-carousel.module.css';

interface CarouselItem {
  id: string;
  tag: string;
  title: string;
  summary: string;
  readTime: string;
  themeColor: string;
  accentBg: string;
}

const CAROUSEL_ITEMS: CarouselItem[] = [
  {
    id: 'specimen-alpha',
    tag: 'NEURAL NETS',
    title: 'Sparse Mixture of Experts in Embedded Runtimes',
    summary: 'Evaluating conditional computation pathways and memory bandwidth under strict 4-watt constraints.',
    readTime: '4 min read',
    themeColor: '#38bdf8',
    accentBg: 'linear-gradient(135deg, #082f49 0%, #0c4a6e 100%)',
  },
  {
    id: 'specimen-beta',
    tag: 'DISTRIBUTED SYSTEMS',
    title: 'Consensus Latency Across Orbital Ground Terminals',
    summary: 'Byzantine fault tolerant agreement loops optimized for intermittent satellite constellation handoffs.',
    readTime: '6 min read',
    themeColor: '#a855f7',
    accentBg: 'linear-gradient(135deg, #3b0764 0%, #581c87 100%)',
  },
  {
    id: 'specimen-gamma',
    tag: 'HARDWARE ACCEL',
    title: 'FPGA Accelerators for Realtime Audio Synthesis',
    summary: 'Synthesizing polyphonic analog waveforms via bitstream pipelines with sub-microsecond jitter.',
    readTime: '5 min read',
    themeColor: '#10b981',
    accentBg: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)',
  },
  {
    id: 'specimen-delta',
    tag: 'INTERFACE DESIGN',
    title: 'Tactile Micro-Interactions in High-Stress Cockpits',
    summary: 'Spatial acoustic feedback and force-resistive dial ergonomics in aerospace telemetry displays.',
    readTime: '3 min read',
    themeColor: '#f59e0b',
    accentBg: 'linear-gradient(135deg, #451a03 0%, #78350f 100%)',
  },
];

export function MomentumCardCarousel() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const isHoveredRef = useRef<boolean>(false);

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? CAROUSEL_ITEMS.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === CAROUSEL_ITEMS.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      if (!isHoveredRef.current) {
        nextSlide();
      }
    }, 3500);
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <div
      className={styles.container}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
    >
      {/* Header controls */}
      <div className={styles.header}>
        <div className={styles.badge} data-preview-chrome>
          <Compass size={13} />
          <span>Curated Dispatches</span>
        </div>

        <div className={styles.navControls}>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`${styles.playBtn} ${isPlaying ? styles.playingActive : ''}`}
            aria-label={isPlaying ? 'Pause auto-cycling' : 'Start auto-cycling'}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
          </button>
          <div className={styles.divider} />
          <button
            onClick={prevSlide}
            className={styles.arrowBtn}
            aria-label="Previous card"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={nextSlide}
            className={styles.arrowBtn}
            aria-label="Next card"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Track & Cards */}
      <div className={styles.carouselTrack}>
        <div
          className={styles.sliderStrip}
          style={{
            transform: `translateX(calc(-${activeIndex * 100}% - ${activeIndex * 1.25}rem))`,
          }}
        >
          {CAROUSEL_ITEMS.map((item, idx) => {
            const isActive = idx === activeIndex;
            return (
              <div
                key={item.id}
                className={`${styles.card} ${isActive ? styles.activeCard : ''}`}
                style={{
                  background: item.accentBg,
                  borderColor: isActive ? item.themeColor : 'rgba(255, 255, 255, 0.08)',
                }}
              >
                <div className={styles.cardHeader}>
                  <span
                    className={styles.tagBadge}
                    style={{ color: item.themeColor, borderColor: item.themeColor }}
                  >
                    {item.tag}
                  </span>
                  <span className={styles.readTime}>{item.readTime}</span>
                </div>

                <h4 className={styles.title}>{item.title}</h4>
                <p className={styles.summary}>{item.summary}</p>

                <div className={styles.footerRow}>
                  <button
                    className={styles.readMoreBtn}
                    style={{ color: item.themeColor }}
                  >
                    <span>Inspect Dispatch</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination indicators */}
      <div className={styles.paginationRow}>
        {CAROUSEL_ITEMS.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => setActiveIndex(idx)}
            className={`${styles.dot} ${idx === activeIndex ? styles.activeDot : ''}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

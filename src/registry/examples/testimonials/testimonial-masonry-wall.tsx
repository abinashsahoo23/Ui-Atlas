'use client';

import React, { useState } from 'react';
import { MessageSquare, Star, Building2, UserCheck, ShieldCheck } from 'lucide-react';
import styles from './testimonial-masonry-wall.module.css';

type FilterCategory = 'all' | 'infra' | 'ml' | 'design';

interface TestimonialCard {
  id: string;
  name: string;
  role: string;
  company: string;
  category: 'infra' | 'ml' | 'design';
  quote: string;
  metric?: string;
  avatarSeed: string;
}

const TESTIMONIALS: TestimonialCard[] = [
  {
    id: 't-1',
    name: 'Dr. Aris Thorne',
    role: 'Principal Systems Architect',
    company: 'HyperScale Distributed Systems',
    category: 'infra',
    quote:
      'UI Atlas provided us with deterministic, sub-millisecond telemetry interfaces right out of the box. The separation between pure metadata and executable previews is masterfully architected.',
    metric: '4.2x Faster Ship Velocity',
    avatarSeed: 'AT',
  },
  {
    id: 't-2',
    name: 'Mirei Tanaka',
    role: 'Design Technologist',
    company: 'Kurogane Studios',
    category: 'design',
    quote:
      'The tactile micro-interactions and restrained neumorphic depths feel authentic and delightful. It balances raw engineering precision with haute visual polish.',
    avatarSeed: 'MT',
  },
  {
    id: 't-3',
    name: 'Kaelen Vance',
    role: 'Lead ML Infrastructure Engineer',
    company: 'Aether Neuro Dynamics',
    category: 'ml',
    quote:
      'We replaced our unwieldy monitoring frontend with the KPI sparklines and radial gauges in one afternoon. Our GPU cluster utilization visibility skyrocketed.',
    metric: '99.98% Telemetry Uptime',
    avatarSeed: 'KV',
  },
  {
    id: 't-4',
    name: 'Siddharth Rao',
    role: 'VP Engineering',
    company: 'Vanguard Security Core',
    category: 'infra',
    quote:
      'Zero bloated dependencies. Strict TypeScript. The code quality in every single registered component is production grade and audit-ready from day zero.',
    avatarSeed: 'SR',
  },
  {
    id: 't-5',
    name: 'Chloe Laurent',
    role: 'Product Lead',
    company: 'Monolith Spatial Interface',
    category: 'design',
    quote:
      'From the split-flap typographic displays to the fluid liquid orbs, our design team uses UI Atlas daily as the gold standard for tactile digital interfaces.',
    avatarSeed: 'CL',
  },
];

export function TestimonialMasonryWall() {
  const [filter, setFilter] = useState<FilterCategory>('all');

  const filteredItems = TESTIMONIALS.filter((t) => filter === 'all' || t.category === filter);

  return (
    <div className={styles.container}>
      {/* Top Header */}
      <div className={styles.header}>
        <div className={styles.badge} data-preview-chrome>
          <MessageSquare size={13} />
          <span>Ecosystem Social Proof</span>
        </div>

        <div className={styles.filterBar} data-preview-chrome>
          {(['all', 'infra', 'ml', 'design'] as FilterCategory[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`${styles.filterBtn} ${filter === f ? styles.activeFilter : ''}`}
            >
              {f === 'all' ? 'All Reviews' : f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry-like Grid */}
      <div className={styles.masonryGrid}>
        {filteredItems.map((item) => (
          <div key={item.id} className={styles.card}>
            <div className={styles.cardTop}>
              <div className={styles.ratingRow}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} className={styles.starIcon} fill="currentColor" />
                ))}
              </div>
              <div className={styles.verifiedTag}>
                <ShieldCheck size={11} /> Verified Operator
              </div>
            </div>

            <p className={styles.quote}>&ldquo;{item.quote}&rdquo;</p>

            {item.metric && (
              <div className={styles.metricBanner}>
                <span className={styles.metricLabel}>IMPACT</span>
                <strong className={styles.metricValue}>{item.metric}</strong>
              </div>
            )}

            <div className={styles.authorRow}>
              <div className={styles.avatar}>{item.avatarSeed}</div>
              <div className={styles.authorDetails}>
                <div className={styles.authorName}>
                  <span>{item.name}</span>
                  <UserCheck size={12} className={styles.checkIcon} />
                </div>
                <div className={styles.authorRole}>
                  <span>{item.role}</span>
                  <span className={styles.dot}>•</span>
                  <span className={styles.company}>
                    <Building2 size={11} /> {item.company}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

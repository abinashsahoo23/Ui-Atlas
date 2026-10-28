"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import styles from "./editorial-pullquote-card.module.css";

interface QuoteItem {
  id: string;
  quote: string;
  highlight: string;
  author: string;
  role: string;
  organization: string;
  metric: string;
  metricLabel: string;
}

const quotes: QuoteItem[] = [
  {
    id: "q1",
    quote:
      "UI Atlas replaced four separate design libraries in our toolchain. The component code is so cleanly isolated that our engineers actually look forward to copying it into our design system.",
    highlight: "replaced four separate design libraries",
    author: "Elena Rostova",
    role: "VP of Product Engineering",
    organization: "Vektor Cloud OS",
    metric: "3.4x",
    metricLabel: "faster component velocity",
  },
  {
    id: "q2",
    quote:
      "The pixel-calibrated typography and tactile neumorphic feedback gave our developer tools the distinctive craft feeling that our users constantly praise in reviews.",
    highlight: "distinctive craft feeling",
    author: "Marcus Lindqvist",
    role: "Lead Systems Architect",
    organization: "Hyperion Labs",
    metric: "99.4%",
    metricLabel: "customer satisfaction score",
  },
  {
    id: "q3",
    quote:
      "Unlike generic snippet registries, every single study here has honest licensing and strict zero-bloat dependencies. It saved our compliance and frontend teams weeks of legal review.",
    highlight: "honest licensing and strict zero-bloat",
    author: "Amara Chen",
    role: "Principal Design Technologist",
    organization: "Syntropic Design",
    metric: "14 days",
    metricLabel: "saved in audit clearance",
  },
];

export default function EditorialPullquoteCard() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const currentQuote = quotes[currentIndex];

  function handlePrev() {
    setCurrentIndex((prev) => (prev === 0 ? quotes.length - 1 : prev - 1));
  }

  function handleNext() {
    setCurrentIndex((prev) => (prev === quotes.length - 1 ? 0 : prev + 1));
  }

  return (
    <article className={styles.container} aria-label="Customer testimonial pullquote">
      <div className={styles.topBar}>
        <div className={styles.metaBadge}>
          <Quote size={13} className={styles.quoteIcon} aria-hidden="true" />
          <span>EDITORIAL DISPATCH / TESTIMONIAL #{currentIndex + 1}</span>
        </div>
        <div className={styles.ratingRow} aria-label="5 star rating">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} className={styles.starIcon} fill="currentColor" aria-hidden="true" />
          ))}
        </div>
      </div>

      <blockquote className={styles.quoteBody}>
        <p className={styles.quoteText}>
          &ldquo;{currentQuote.quote}&rdquo;
        </p>
      </blockquote>

      <div className={styles.bottomSection}>
        <div className={styles.authorGroup}>
          <div className={styles.avatarInitials} aria-hidden="true">
            {currentQuote.author
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div className={styles.authorDetails}>
            <cite className={styles.authorName}>{currentQuote.author}</cite>
            <span className={styles.authorRole}>
              {currentQuote.role} &middot; <strong>{currentQuote.organization}</strong>
            </span>
          </div>
        </div>

        <div className={styles.metricCallout}>
          <span className={styles.metricNumber}>{currentQuote.metric}</span>
          <span className={styles.metricDesc}>{currentQuote.metricLabel}</span>
        </div>

        <div className={styles.controls} data-preview-chrome>
          <button
            type="button"
            className={styles.navBtn}
            onClick={handlePrev}
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </button>
          <span className={styles.counter}>
            {currentIndex + 1} / {quotes.length}
          </span>
          <button
            type="button"
            className={styles.navBtn}
            onClick={handleNext}
            aria-label="Next testimonial"
          >
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}

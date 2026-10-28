"use client";

import { useState } from "react";
import { Layers, Eye, ArrowRight } from "lucide-react";
import styles from "./fanned-deck-stack.module.css";

interface DeckItem {
  index: string;
  title: string;
  tagline: string;
  metric: string;
  styleClass: string;
}

const CARDS: DeckItem[] = [
  {
    index: "01",
    title: "Quantum Kernel",
    tagline: "Sub-millisecond state synchronization across nodes.",
    metric: "0.2ms RTT",
    styleClass: styles.card0,
  },
  {
    index: "02",
    title: "Emerald Vault",
    tagline: "Hardware-enclave biometric encryption storage.",
    metric: "AES-256 GCM",
    styleClass: styles.card1,
  },
  {
    index: "03",
    title: "Ruby Neural",
    tagline: "On-device continuous parametric inference.",
    metric: "120 TFLOPS",
    styleClass: styles.card2,
  },
  {
    index: "04",
    title: "Obsidian Core",
    tagline: "Ultra-low power telemetry monitoring daemon.",
    metric: "0.05W IDLE",
    styleClass: styles.card3,
  },
];

export default function FannedDeckStack() {
  const [isFanned, setIsFanned] = useState(false);
  const [fanSpread, setFanSpread] = useState<"standard" | "wide">("standard");
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const angleStep = fanSpread === "wide" ? 14 : 9;
  const xStep = fanSpread === "wide" ? 45 : 28;

  return (
    <div className={styles.container}>
      <div className={styles.centerStage}>
        <div
          className={styles.deckContainer}
          onPointerEnter={() => setIsFanned(true)}
          onPointerLeave={() => {
            setIsFanned(false);
            setActiveCard(null);
          }}
          role="region"
          aria-label="Interactive fanned card deck"
        >
          {CARDS.map((card, idx) => {
            const centerOffset = idx - (CARDS.length - 1) / 2;
            const rot = isFanned ? centerOffset * angleStep : centerOffset * 2.5;
            const tx = isFanned ? centerOffset * xStep : centerOffset * 4;
            const ty = isFanned ? Math.abs(centerOffset) * 10 : idx * 4;

            const isCurrent = activeCard === idx;

            return (
              <div
                key={card.index}
                className={`${styles.deckCard} ${card.styleClass}`}
                style={{
                  transform: isCurrent
                    ? `translate(${tx}px, ${ty - 35}px) rotate(${rot * 0.4}deg) scale(1.05)`
                    : `translate(${tx}px, ${ty}px) rotate(${rot}deg)`,
                  zIndex: isCurrent ? 20 : idx + 1,
                }}
                onPointerEnter={() => setActiveCard(idx)}
                onClick={() => setActiveCard(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setActiveCard(idx);
                  }
                }}
                aria-label={`Card ${card.index}: ${card.title}`}
              >
                <div>
                  <span className={styles.cardIndex}>ITEM // {card.index}</span>
                  <h4 className={styles.cardTitle}>{card.title}</h4>
                  <p className={styles.cardTagline}>{card.tagline}</p>
                </div>

                <div className={styles.cardBottom}>
                  <span>{card.metric}</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.overlay} data-preview-chrome>
        <div className={styles.badge}>
          <Layers size={12} aria-hidden="true" />
          <span>Spring Arc Dispersion</span>
        </div>
        <h3 className={styles.title}>Fanned Deck Stack</h3>
        <p className={styles.description}>
          Physics-inspired arched card fan with individual card hover elevation, spring return dynamics, and tactile focus states.
        </p>
      </div>

      <div className={styles.controls} data-preview-chrome>
        <div className={styles.controlGroup} role="toolbar" aria-label="Deck controls">
          <button
            type="button"
            className={`${styles.btn} ${isFanned ? styles.active : ""}`}
            onClick={() => setIsFanned(!isFanned)}
            aria-pressed={isFanned}
          >
            <Layers size={13} aria-hidden="true" />
            <span>{isFanned ? "Collapse Stack" : "Fan Deck"}</span>
          </button>
        </div>

        <div className={styles.controlGroup} role="radiogroup" aria-label="Fan angle spread">
          <button
            type="button"
            className={`${styles.btn} ${fanSpread === "standard" ? styles.active : ""}`}
            onClick={() => setFanSpread("standard")}
            role="radio"
            aria-checked={fanSpread === "standard"}
          >
            <span>Standard Arc</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${fanSpread === "wide" ? styles.active : ""}`}
            onClick={() => setFanSpread("wide")}
            role="radio"
            aria-checked={fanSpread === "wide"}
          >
            <Eye size={13} aria-hidden="true" />
            <span>Wide Horizon</span>
          </button>
        </div>
      </div>
    </div>
  );
}

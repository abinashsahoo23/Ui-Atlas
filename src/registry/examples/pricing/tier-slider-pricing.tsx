"use client";

import { useState } from "react";
import { Check, Zap, Sparkles, ArrowRight } from "lucide-react";
import styles from "./tier-slider-pricing.module.css";

export default function TierSliderPricing() {
  const [isAnnual, setIsAnnual] = useState<boolean>(true);

  const proPrice = isAnnual ? 24 : 32;
  const teamPrice = isAnnual ? 68 : 85;

  return (
    <section className={styles.pricingSection} aria-label="Subscription pricing plans">
      <div className={styles.header}>
        <span className={styles.eyebrow}>TRANSPARENT VALUE</span>
        <h3 className={styles.heading}>Predictable scale for shipping teams</h3>
        <p className={styles.subhead}>
          Everything you need to craft high-fidelity design systems and production React frontends.
        </p>

        {/* Cadence Switch */}
        <div className={styles.cadenceWrapper}>
          <div className={styles.cadencePill}>
            <button
              type="button"
              className={`${styles.cadenceBtn} ${!isAnnual ? styles.activeCadence : ""}`}
              onClick={() => setIsAnnual(false)}
            >
              Billed Monthly
            </button>
            <button
              type="button"
              className={`${styles.cadenceBtn} ${isAnnual ? styles.activeCadence : ""}`}
              onClick={() => setIsAnnual(true)}
            >
              Billed Yearly
              <span className={styles.discountBadge}>SAVE 20%</span>
            </button>
          </div>
        </div>
      </div>

      <div className={styles.cardsGrid}>
        {/* Pro Plan */}
        <div className={styles.planCard}>
          <div className={styles.cardTop}>
            <div className={styles.planBadge}>
              <Zap size={14} className={styles.planIcon} aria-hidden="true" />
              <span>INDIVIDUAL PRO</span>
            </div>
            <h4 className={styles.planTitle}>Studio Architect</h4>
            <p className={styles.planDesc}>Ideal for solo builders, contractors, and design engineers.</p>
            <div className={styles.priceRow}>
              <span className={styles.currency}>$</span>
              <span className={styles.priceAmount}>{proPrice}</span>
              <span className={styles.pricePeriod}>/ user / mo</span>
            </div>
          </div>

          <ul className={styles.featureList}>
            <li>
              <Check size={16} className={styles.checkIcon} aria-hidden="true" />
              <span>Unlimited export to Next.js & Vite</span>
            </li>
            <li>
              <Check size={16} className={styles.checkIcon} aria-hidden="true" />
              <span>Full source TSX & CSS Modules</span>
            </li>
            <li>
              <Check size={16} className={styles.checkIcon} aria-hidden="true" />
              <span>Commercial licence & client clearance</span>
            </li>
            <li>
              <Check size={16} className={styles.checkIcon} aria-hidden="true" />
              <span>Community Discord priority</span>
            </li>
          </ul>

          <button type="button" className={styles.secondaryCta}>
            Start 14-day trial
          </button>
        </div>

        {/* Team Plan (Highlighted) */}
        <div className={`${styles.planCard} ${styles.highlightedCard}`}>
          <div className={styles.popularRibbon}>
            <Sparkles size={13} aria-hidden="true" />
            <span>MOST POPULAR</span>
          </div>

          <div className={styles.cardTop}>
            <div className={styles.planBadge}>
              <Sparkles size={14} className={styles.planIcon} aria-hidden="true" />
              <span>TEAM PRODUCTION</span>
            </div>
            <h4 className={styles.planTitle}>Engineering Fleet</h4>
            <p className={styles.planDesc}>For fast-moving product orgs scaling unified component systems.</p>
            <div className={styles.priceRow}>
              <span className={styles.currency}>$</span>
              <span className={styles.priceAmount}>{teamPrice}</span>
              <span className={styles.pricePeriod}>/ team / mo</span>
            </div>
          </div>

          <ul className={styles.featureList}>
            <li>
              <Check size={16} className={styles.checkIcon} aria-hidden="true" />
              <span>Everything in Pro for up to 10 seats</span>
            </li>
            <li>
              <Check size={16} className={styles.checkIcon} aria-hidden="true" />
              <span>Custom Figma to React design token sync</span>
            </li>
            <li>
              <Check size={16} className={styles.checkIcon} aria-hidden="true" />
              <span>Private artifact hosting & npm registry</span>
            </li>
            <li>
              <Check size={16} className={styles.checkIcon} aria-hidden="true" />
              <span>Dedicated Slack channel & 2h SLA</span>
            </li>
          </ul>

          <button type="button" className={styles.primaryCta}>
            Deploy to your team <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}

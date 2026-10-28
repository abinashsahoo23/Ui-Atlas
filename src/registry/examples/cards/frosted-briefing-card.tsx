"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, Sparkles } from 'lucide-react';
import styles from "./frosted-briefing-card.module.css";

export default function FrostedBriefingCard() {
  const [expanded, setExpanded] = useState(false);
  const [completed, setCompleted] = useState(false);

  return (
    <article className={styles.card}>
      <div className={styles.topline}>
        <span className={styles.icon} aria-hidden="true">
          <Sparkles size={16} />
        </span>
        <button
          type="button"
          onClick={() => setCompleted((prev) => !prev)}
          className={styles.statusBtn}
          aria-label="Toggle task status"
        >
          <span
            className={styles.statusDot}
            style={{ background: completed ? "#296444" : "#3b82f6" }}
            aria-hidden="true"
          />
          <span>{completed ? "Completed" : "In progress"}</span>
        </button>
      </div>
      <p className={styles.overline}>FIELD NOTES / 04</p>
      <h2>Northstar launch</h2>
      <p className={styles.description}>A focused space for the next release, from first sketch to final detail.</p>

      {expanded && (
        <div className={styles.expandedBrief} role="region" aria-label="Brief milestones">
          <div className={styles.milestone}>
            <CheckCircle2 size={13} className={styles.checkDone} aria-hidden="true" />
            <span>Design tokens & typography</span>
          </div>
          <div className={styles.milestone}>
            <CheckCircle2 size={13} className={styles.checkDone} aria-hidden="true" />
            <span>Interactive live previews</span>
          </div>
          <div className={styles.milestone}>
            <span className={styles.checkActive} aria-hidden="true" />
            <span>Performance & bundle optimization</span>
          </div>
        </div>
      )}

      <div className={styles.bottomline}>
        <span>Updated 2 hours ago</span>
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className={styles.expandBtn}
          aria-expanded={expanded}
        >
          <span>{expanded ? "Hide brief" : "Open brief"}</span>
          <ChevronDown
            size={14}
            aria-hidden="true"
            style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 140ms ease" }}
          />
        </button>
      </div>
    </article>
  );
}

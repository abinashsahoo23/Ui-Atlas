"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Bookmark } from "lucide-react";
import styles from "./scrolling-field-note.module.css";

const OBSERVATIONS = [
  {
    quote: "“The small, considered detail is often the thing people remember.”",
    credit: "A note on making things with care",
    id: "018",
  },
  {
    quote: "“Perfection is achieved not when there is nothing to add, but nothing left to remove.”",
    credit: "On architectural clarity & restraint",
    id: "019",
  },
  {
    quote: "“Fast interfaces don't just reduce latency; they reduce cognitive resistance.”",
    credit: "On tactile feedback & performance",
    id: "020",
  },
];

export default function ScrollingFieldNote() {
  const [index, setIndex] = useState(0);
  const current = OBSERVATIONS[index];

  const nextNote = () => {
    setIndex((prev) => (prev + 1) % OBSERVATIONS.length);
  };

  const prevNote = () => {
    setIndex((prev) => (prev - 1 + OBSERVATIONS.length) % OBSERVATIONS.length);
  };

  return (
    <article className={styles.note}>
      <div className={styles.meta}>
        <span>OBSERVATION / {current.id}</span>
        <span className={styles.rule} aria-hidden="true" />
        <span>FIELD STUDY</span>
        <span className={styles.indexTag}>
          {index + 1} OF {OBSERVATIONS.length}
        </span>
      </div>
      <blockquote>{current.quote}</blockquote>
      <p className={styles.credit}>{current.credit}</p>

      <div className={styles.controlsRow} data-preview-chrome>
        <div className={styles.noteNav}>
          <button
            type="button"
            onClick={prevNote}
            className={styles.noteNavBtn}
            aria-label="Previous observation"
          >
            <ArrowLeft size={13} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={nextNote}
            className={styles.noteNavBtn}
            aria-label="Next observation"
          >
            <ArrowRight size={13} aria-hidden="true" />
          </button>
        </div>
        <span className={styles.stampTag}>
          <Bookmark size={11} aria-hidden="true" /> ARCHIVED STUDY
        </span>
      </div>
      <span className={styles.corner} aria-hidden="true">+</span>
    </article>
  );
}

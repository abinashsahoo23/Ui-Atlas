"use client";

import { useState } from "react";
import styles from "./hard-edge-dispatch-panel.module.css";

const STATUS_STATES = [
  { label: "LIVE", color: "#2c7650", bg: "#d5f2df" },
  { label: "SYNCING", color: "#8a5800", bg: "#fef0cd" },
  { label: "QUEUED", color: "#1e40af", bg: "#dbeafe" },
];

export default function HardEdgeDispatchPanel() {
  const [openItems, setOpenItems] = useState(8);
  const [statusIdx, setStatusIdx] = useState(0);

  const currentStatus = STATUS_STATES[statusIdx];

  const cycleStatus = () => {
    setStatusIdx((prev) => (prev + 1) % STATUS_STATES.length);
  };

  const dispatchItem = () => {
    setOpenItems((prev) => (prev >= 20 ? 8 : prev + 1));
  };

  return (
    <article className={styles.panel}>
      <div className={styles.heading}>
        <span className={styles.index}>BOARD / 07</span>
        <button
          type="button"
          onClick={cycleStatus}
          className={styles.signalBtn}
          style={{ background: currentStatus.bg, borderColor: "#171a23" }}
          aria-label={`Status: ${currentStatus.label}. Click to toggle`}
        >
          <span style={{ background: currentStatus.color }} aria-hidden="true" />
          <span style={{ color: currentStatus.color }}>{currentStatus.label}</span>
        </button>
      </div>
      <h2>Dispatch<br />the details.</h2>
      <p className={styles.copy}>A field-ready overview for work that needs a little more edge.</p>
      
      <div className={styles.actionRow}>
        <button type="button" onClick={dispatchItem} className={styles.dispatchBtn}>
          + Dispatch item
        </button>
        <span className={styles.actionHint}>Click to push telemetry</span>
      </div>

      <div className={styles.metrics}>
        <div>
          <span>OPEN ITEMS</span>
          <strong>{String(openItems).padStart(2, "0")}</strong>
        </div>
        <div>
          <span>ON TRACK</span>
          <strong>{Math.min(99, 84 + (openItems % 15))}%</strong>
        </div>
        <div className={styles.stamp}>MOVE<br />WITH<br />INTENT</div>
      </div>
    </article>
  );
}

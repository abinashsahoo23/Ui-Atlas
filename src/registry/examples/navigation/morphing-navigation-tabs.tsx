"use client";

import { useState, useRef, useEffect } from "react";
import { Layers, ShieldCheck, Activity, Cpu, Sliders } from 'lucide-react';
import styles from "./morphing-navigation-tabs.module.css";

const TABS = [
  { id: "overview", label: "Overview", icon: Layers, metric: "99.98% Uptime", desc: "Global edge network telemetry and service status across 32 zones." },
  { id: "analytics", label: "Analytics", icon: Activity, metric: "1.42M Req/s", desc: "Real-time request distribution, ingress volume, and cache hit ratio." },
  { id: "security", label: "Security", icon: ShieldCheck, metric: "0 Active Alerts", desc: "WAF rate-limiting, mTLS handshakes, and cryptographic verification." },
  { id: "compute", label: "Compute", icon: Cpu, metric: "24ms Cold Start", desc: "V8 isolate runtime capacity and serverless thread concurrency." },
  { id: "settings", label: "Settings", icon: Sliders, metric: "Auto-Scale ON", desc: "Environment variables, deployment hooks, and secrets rotation." },
];

export default function MorphingNavigationTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const activeEl = tabsRef.current[activeTab];
    if (activeEl) {
      setIndicatorStyle({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
      });
    }
  }, [activeTab]);

  const current = TABS[activeTab];
  const Icon = current.icon;

  return (
    <div className={styles.container}>
      <header className={styles.header} data-preview-chrome>
        <span className={styles.eyebrow}>CONTROL SURFACE / SEGMENTED TABS</span>
        <h2 className={styles.title}>System Telemetry Navigation</h2>
      </header>

      <nav className={styles.tabsNav} role="tablist" aria-label="System sections">
        <div
          className={styles.indicator}
          style={{
            transform: `translateX(${indicatorStyle.left}px)`,
            width: `${indicatorStyle.width}px`,
          }}
          aria-hidden="true"
        />

        {TABS.map((tab, idx) => {
          const TabIcon = tab.icon;
          const isSelected = activeTab === idx;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabsRef.current[idx] = el;
              }}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              className={styles.tabButton}
              data-active={isSelected}
              onClick={() => setActiveTab(idx)}
            >
              <TabIcon size={14} aria-hidden="true" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <section
        id={`panel-${current.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${current.id}`}
        className={styles.panel}
      >
        <div className={styles.panelIcon}>
          <Icon size={20} />
        </div>
        <div className={styles.panelContent}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTag}>{current.id.toUpperCase()} MODULE</span>
            <span className={styles.panelMetric}>{current.metric}</span>
          </div>
          <h3 className={styles.panelHeading}>{current.label} Diagnostics</h3>
          <p className={styles.panelDesc}>{current.desc}</p>
        </div>
      </section>
    </div>
  );
}

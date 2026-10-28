"use client";

import { useState } from "react";
import { Activity, ShieldCheck, Terminal, Cpu, Check, RefreshCw } from "lucide-react";
import styles from "./bento-feature-showcase.module.css";

export default function BentoFeatureShowcase() {
  const [pinging, setPinging] = useState(false);
  const [latency, setLatency] = useState(1.4);
  const [copied, setCopied] = useState(false);

  function handlePing() {
    setPinging(true);
    setTimeout(() => {
      setLatency(Number((Math.random() * 0.8 + 0.9).toFixed(1)));
      setPinging(false);
    }, 600);
  }

  function handleCopySnippet() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("npm install @ui-atlas/core");
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className={styles.bentoSection} aria-label="Platform feature bento grid">
      <div className={styles.sectionHeader} data-preview-chrome>
        <span className={styles.eyebrow}>ARCHITECTURE SHOWCASE</span>
        <h3 className={styles.title}>Engineered for zero-latency execution</h3>
      </div>

      <div className={styles.bentoGrid}>
        {/* Cell 1: Large telemetry hero card */}
        <div className={`${styles.bentoCell} ${styles.cellLarge}`}>
          <div className={styles.cellHead}>
            <div className={styles.iconBadge}>
              <Activity size={16} className={styles.iconAccent} aria-hidden="true" />
            </div>
            <span className={styles.liveIndicator}>
              <span className={styles.liveDot} /> STREAMING
            </span>
          </div>

          <div className={styles.cellContent}>
            <h4 className={styles.cellTitle}>Realtime Telemetry Pipeline</h4>
            <p className={styles.cellDesc}>
              Sub-millisecond signal ingestion with zero serialization overhead.
              Aggregates distributed node traces with high-frequency rolling windows.
            </p>
          </div>

          {/* Micro chart simulation */}
          <div className={styles.chartContainer} aria-hidden="true">
            <div className={styles.chartBars}>
              {[42, 65, 88, 54, 76, 95, 82, 100, 78, 92, 85, 98, 70, 84, 96].map((h, i) => (
                <div key={i} className={styles.bar} style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className={styles.chartMeta}>
              <span>1.2M events/sec</span>
              <span>Buffer: 99.9% optimal</span>
            </div>
          </div>
        </div>

        {/* Cell 2: Latency tester */}
        <div className={`${styles.bentoCell} ${styles.cellSmall}`}>
          <div className={styles.cellHead}>
            <div className={styles.iconBadge}>
              <Cpu size={16} className={styles.iconAccent} aria-hidden="true" />
            </div>
            <button
              type="button"
              className={styles.pingBtn}
              onClick={handlePing}
              aria-label="Refresh ping test"
              disabled={pinging}
            >
              <RefreshCw size={12} className={pinging ? styles.spinning : ""} aria-hidden="true" />
              <span>Ping</span>
            </button>
          </div>

          <div className={styles.metricBlock}>
            <span className={styles.metricBig}>{latency}ms</span>
            <span className={styles.metricSub}>Global Edge RTT</span>
          </div>

          <p className={styles.cellDescSmall}>Routing requests across 310 PoPs worldwide.</p>
        </div>

        {/* Cell 3: Security enclave */}
        <div className={`${styles.bentoCell} ${styles.cellSmall}`}>
          <div className={styles.cellHead}>
            <div className={styles.iconBadge}>
              <ShieldCheck size={16} className={styles.iconAccent} aria-hidden="true" />
            </div>
            <span className={styles.verifiedTag}>FIPS 140-3</span>
          </div>

          <div className={styles.cellContent}>
            <h4 className={styles.cellTitle}>Isolated Enclave</h4>
            <p className={styles.cellDescSmall}>
              Cryptographic boundary verification. Keys never touch disk or plaintext logs.
            </p>
          </div>

          <div className={styles.securityCheck}>
            <Check size={14} className={styles.checkIcon} aria-hidden="true" />
            <span>Zero-trust memory encryption</span>
          </div>
        </div>

        {/* Cell 4: Wide CLI integration row */}
        <div className={`${styles.bentoCell} ${styles.cellWide}`}>
          <div className={styles.cliLeft}>
            <div className={styles.iconBadge}>
              <Terminal size={16} className={styles.iconAccent} aria-hidden="true" />
            </div>
            <div>
              <h4 className={styles.cellTitle}>Declarative CLI Runtime</h4>
              <p className={styles.cellDescSmall}>Install with your package manager of choice.</p>
            </div>
          </div>

          <div className={styles.snippetBox}>
            <code className={styles.codeText}>npm install @ui-atlas/core</code>
            <button
              type="button"
              className={styles.copyBtn}
              onClick={handleCopySnippet}
              aria-label="Copy install command"
            >
              {copied ? (
                <>
                  <Check size={13} aria-hidden="true" /> Copied
                </>
              ) : (
                <>Copy</>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

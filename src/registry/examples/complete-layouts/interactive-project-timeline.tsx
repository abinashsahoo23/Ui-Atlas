'use client';

import React, { useState } from 'react';
import { GitBranch, CheckCircle2, Clock, CircleDot, ArrowRight, Layers } from 'lucide-react';
import styles from './interactive-project-timeline.module.css';

interface Milestone {
  id: string;
  quarter: string;
  date: string;
  title: string;
  summary: string;
  status: 'completed' | 'active' | 'upcoming';
  deliverables: string[];
}

const MILESTONES: Milestone[] = [
  {
    id: 'm-1',
    quarter: 'PHASE 01',
    date: 'Q1 2026',
    title: 'Distributed Kernel Consensus',
    summary: 'Raft state machine implemented with zero-copy shared memory queues and peer discovery.',
    status: 'completed',
    deliverables: ['Peer-to-peer discovery protocol', 'Raft cluster quorum tests', 'Memory arena allocator'],
  },
  {
    id: 'm-2',
    quarter: 'PHASE 02',
    date: 'Q2 2026',
    title: 'Zero-Trust IPC Routing',
    summary: 'Hardware AES-256 GCM encrypted channels running between sandboxed worker nodes.',
    status: 'completed',
    deliverables: ['Edwards-curve key exchange', 'Hardware enclave attestation', 'Sub-millisecond IPC benchmarks'],
  },
  {
    id: 'm-3',
    quarter: 'PHASE 03',
    date: 'CURRENT SPRINT',
    title: 'WebAssembly Edge Runtime',
    summary: 'Deterministic Wasm engine compiling untrusted client logic with 4MB memory sandbox.',
    status: 'active',
    deliverables: ['Wasmtime runtime bindings', 'Dynamic import sandboxing', 'Cold-start under 0.8ms'],
  },
  {
    id: 'm-4',
    quarter: 'PHASE 04',
    date: 'Q4 2026',
    title: 'Autonomous Telemetry Synthesis',
    summary: 'On-device neural inference analyzing multi-region performance telemetry in real time.',
    status: 'upcoming',
    deliverables: ['Intelligent anomaly detection', 'Self-healing mesh rebalance', 'Public developer dashboard'],
  },
];

export function InteractiveProjectTimeline() {
  const [selectedId, setSelectedId] = useState<string>('m-3');
  const activeMilestone = MILESTONES.find((m) => m.id === selectedId) || MILESTONES[2];

  return (
    <div className={styles.container}>
      {/* Top Header */}
      <div className={styles.header} data-preview-chrome>
        <div className={styles.badge}>
          <GitBranch size={13} />
          <span>Architecture Roadmap Timeline</span>
        </div>
        <span className={styles.overallStatus}>3 of 4 Milestones Reached</span>
      </div>

      {/* Horizontal Milestone Tracker */}
      <div className={styles.timelineTrackContainer}>
        <div className={styles.trackLine} />

        <div className={styles.milestonesRow}>
          {MILESTONES.map((m) => {
            const isSelected = m.id === selectedId;
            const Icon =
              m.status === 'completed'
                ? CheckCircle2
                : m.status === 'active'
                ? CircleDot
                : Clock;

            return (
              <button
                key={m.id}
                onClick={() => setSelectedId(m.id)}
                className={`${styles.milestoneNode} ${styles[m.status]} ${
                  isSelected ? styles.selectedNode : ''
                }`}
                aria-pressed={isSelected}
              >
                <div className={styles.iconCircle}>
                  <Icon size={16} />
                </div>
                <span className={styles.nodeQuarter}>{m.quarter}</span>
                <span className={styles.nodeTitle}>{m.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Milestone Detail Card */}
      <div className={styles.detailCard}>
        <div className={styles.detailHeader}>
          <div className={styles.titleGroup}>
            <span className={`${styles.statusPill} ${styles[`pill_${activeMilestone.status}`]}`}>
              {activeMilestone.status.toUpperCase()}
            </span>
            <span className={styles.detailDate}>{activeMilestone.date}</span>
          </div>
          <span className={styles.phaseTag}>{activeMilestone.quarter}</span>
        </div>

        <h3 className={styles.detailTitle}>{activeMilestone.title}</h3>
        <p className={styles.detailSummary}>{activeMilestone.summary}</p>

        <div className={styles.deliverablesSection}>
          <span className={styles.deliverableHeader}>
            <Layers size={13} /> Verified Key Deliverables
          </span>
          <div className={styles.deliverableGrid}>
            {activeMilestone.deliverables.map((item, idx) => (
              <div key={idx} className={styles.deliverableItem}>
                <ArrowRight size={12} className={styles.arrowIcon} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

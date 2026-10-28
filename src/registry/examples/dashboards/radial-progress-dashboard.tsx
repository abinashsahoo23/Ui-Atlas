'use client';

import React, { useState } from 'react';
import { Cpu, HardDrive, Network, Flame, Sliders } from 'lucide-react';
import styles from './radial-progress-dashboard.module.css';

type ModePreset = 'idle' | 'nominal' | 'stress';

interface RingMetric {
  id: string;
  name: string;
  icon: React.ElementType;
  value: number; // 0 - 100
  color: string;
  radius: number;
}

const PRESET_METRICS: Record<ModePreset, Record<string, number>> = {
  idle: { cpu: 14, ram: 28, disk: 42, net: 18 },
  nominal: { cpu: 52, ram: 64, disk: 48, net: 68 },
  stress: { cpu: 94, ram: 88, disk: 79, net: 91 },
};

export function RadialProgressDashboard() {
  const [preset, setPreset] = useState<ModePreset>('nominal');
  const values = PRESET_METRICS[preset];

  const metrics: RingMetric[] = [
    { id: 'cpu', name: 'CPU Cluster', icon: Cpu, value: values.cpu, color: '#ef4444', radius: 80 },
    { id: 'ram', name: 'Memory Alloc', icon: Flame, value: values.ram, color: '#f59e0b', radius: 62 },
    { id: 'disk', name: 'NVMe Storage', icon: HardDrive, value: values.disk, color: '#10b981', radius: 44 },
    { id: 'net', name: 'Mesh Egress', icon: Network, value: values.net, color: '#38bdf8', radius: 26 },
  ];

  return (
    <div className={styles.container}>
      {/* Top Header */}
      <div className={styles.header}>
        <div className={styles.badge} data-preview-chrome>
          <Sliders size={13} />
          <span>System Telemetry Gauges</span>
        </div>

        <div className={styles.presetButtons} data-preview-chrome>
          {(['idle', 'nominal', 'stress'] as ModePreset[]).map((p) => (
            <button
              key={p}
              onClick={() => setPreset(p)}
              className={`${styles.presetBtn} ${preset === p ? styles.activePreset : ''}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Main concentric display */}
      <div className={styles.displayRow}>
        {/* SVG Concentric Rings */}
        <div className={styles.gaugeContainer}>
          <svg viewBox="0 0 200 200" className={styles.gaugeSvg}>
            {metrics.map((m) => {
              const circumference = 2 * Math.PI * m.radius;
              const strokeDashoffset = circumference - (m.value / 100) * circumference;

              return (
                <g key={m.id}>
                  {/* Track ring */}
                  <circle
                    cx="100"
                    cy="100"
                    r={m.radius}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.06)"
                    strokeWidth="6"
                  />
                  {/* Value progress ring */}
                  <circle
                    cx="100"
                    cy="100"
                    r={m.radius}
                    fill="none"
                    stroke={m.color}
                    strokeWidth="6"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className={styles.animatedRing}
                    transform="rotate(-90 100 100)"
                  />
                </g>
              );
            })}
          </svg>

          {/* Center summary badge */}
          <div className={styles.centerLabel}>
            <span className={styles.centerPercent}>
              {Math.round((values.cpu + values.ram + values.disk + values.net) / 4)}%
            </span>
            <span className={styles.centerText}>AVG LOAD</span>
          </div>
        </div>

        {/* Legend & Breakdown List */}
        <div className={styles.breakdownList}>
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.id} className={styles.metricItem}>
                <div className={styles.itemHeader}>
                  <div className={styles.nameGroup}>
                    <div
                      className={styles.colorIndicator}
                      style={{ backgroundColor: m.color }}
                    />
                    <Icon size={14} className={styles.itemIcon} />
                    <span className={styles.itemName}>{m.name}</span>
                  </div>
                  <strong className={styles.itemValue} style={{ color: m.color }}>
                    {m.value}%
                  </strong>
                </div>

                <div className={styles.miniBar}>
                  <div
                    className={styles.miniBarFill}
                    style={{
                      width: `${m.value}%`,
                      backgroundColor: m.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

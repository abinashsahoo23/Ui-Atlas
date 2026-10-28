'use client';

import React, { useState } from 'react';
import { Activity, ArrowUpRight, ArrowDownRight, Minus, Calendar } from 'lucide-react';
import styles from './kpi-sparkline-grid.module.css';

type TimeRange = '24h' | '7d' | '30d';

interface KpiData {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  color: string;
  points: string;
}

const KPI_DATA: Record<TimeRange, KpiData[]> = {
  '24h': [
    {
      id: 'kpi-mrr',
      label: 'Net Volume MRR',
      value: '$148,220',
      change: '+14.2%',
      trend: 'up',
      color: '#10b981',
      points: '0,25 20,22 40,24 60,18 80,14 100,8 120,4',
    },
    {
      id: 'kpi-requests',
      label: 'Edge Invocations',
      value: '42.8M',
      change: '+28.4%',
      trend: 'up',
      color: '#38bdf8',
      points: '0,26 20,20 40,16 60,18 80,10 100,6 120,2',
    },
    {
      id: 'kpi-latency',
      label: 'P99 Latency',
      value: '18.4 ms',
      change: '-4.1%',
      trend: 'up', // lower latency is good (green)
      color: '#10b981',
      points: '0,8 20,12 40,15 60,14 80,18 100,22 120,24',
    },
    {
      id: 'kpi-errors',
      label: 'Failed Packets',
      value: '0.042%',
      change: '+0.01%',
      trend: 'down',
      color: '#ef4444',
      points: '0,20 20,22 40,18 60,16 80,14 100,10 120,6',
    },
  ],
  '7d': [
    {
      id: 'kpi-mrr',
      label: 'Net Volume MRR',
      value: '$162,800',
      change: '+19.8%',
      trend: 'up',
      color: '#10b981',
      points: '0,28 20,24 40,20 60,16 80,12 100,8 120,3',
    },
    {
      id: 'kpi-requests',
      label: 'Edge Invocations',
      value: '298.5M',
      change: '+31.0%',
      trend: 'up',
      color: '#38bdf8',
      points: '0,25 20,22 40,18 60,12 80,10 100,5 120,1',
    },
    {
      id: 'kpi-latency',
      label: 'P99 Latency',
      value: '17.2 ms',
      change: '-8.5%',
      trend: 'up',
      color: '#10b981',
      points: '0,6 20,10 40,14 60,18 80,20 100,22 120,26',
    },
    {
      id: 'kpi-errors',
      label: 'Failed Packets',
      value: '0.038%',
      change: '-0.02%',
      trend: 'neutral',
      color: '#94a3b8',
      points: '0,14 20,15 40,14 60,16 80,15 100,14 120,15',
    },
  ],
  '30d': [
    {
      id: 'kpi-mrr',
      label: 'Net Volume MRR',
      value: '$642,100',
      change: '+42.1%',
      trend: 'up',
      color: '#10b981',
      points: '0,26 20,22 40,18 60,14 80,10 100,6 120,2',
    },
    {
      id: 'kpi-requests',
      label: 'Edge Invocations',
      value: '1.24B',
      change: '+54.2%',
      trend: 'up',
      color: '#38bdf8',
      points: '0,28 20,24 40,18 60,15 80,8 100,4 120,1',
    },
    {
      id: 'kpi-latency',
      label: 'P99 Latency',
      value: '16.9 ms',
      change: '-12.0%',
      trend: 'up',
      color: '#10b981',
      points: '0,5 20,8 40,12 60,15 80,18 100,22 120,25',
    },
    {
      id: 'kpi-errors',
      label: 'Failed Packets',
      value: '0.051%',
      change: '+0.03%',
      trend: 'down',
      color: '#ef4444',
      points: '0,18 20,16 40,20 60,14 80,12 100,8 120,4',
    },
  ],
};

export function KpiSparklineGrid() {
  const [range, setRange] = useState<TimeRange>('24h');
  const metrics = KPI_DATA[range];

  return (
    <div className={styles.container}>
      {/* Dashboard Topbar */}
      <div className={styles.topbar}>
        <div className={styles.badge} data-preview-chrome>
          <Activity size={13} />
          <span>Realtime Telemetry Metrics</span>
        </div>

        <div className={styles.rangeSelector} data-preview-chrome>
          <Calendar size={13} className={styles.calIcon} />
          {(['24h', '7d', '30d'] as TimeRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`${styles.rangeBtn} ${range === r ? styles.activeRange : ''}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* 4-KPI Grid */}
      <div className={styles.grid}>
        {metrics.map((kpi) => (
          <div key={kpi.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.label}>{kpi.label}</span>
              <span
                className={styles.changeBadge}
                style={{
                  color: kpi.color,
                  backgroundColor: `${kpi.color}15`,
                  borderColor: `${kpi.color}30`,
                }}
              >
                {kpi.trend === 'up' && <ArrowUpRight size={12} />}
                {kpi.trend === 'down' && <ArrowDownRight size={12} />}
                {kpi.trend === 'neutral' && <Minus size={12} />}
                <span>{kpi.change}</span>
              </span>
            </div>

            <div className={styles.valueRow}>
              <h3 className={styles.value}>{kpi.value}</h3>

              {/* Vector Sparkline */}
              <div className={styles.sparklineContainer}>
                <svg
                  viewBox="0 0 120 28"
                  className={styles.sparklineSvg}
                  aria-hidden="true"
                >
                  <polyline
                    fill="none"
                    stroke={kpi.color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={kpi.points}
                  />
                </svg>
              </div>
            </div>

            <div className={styles.cardFooter}>
              <span className={styles.footerNote}>vs previous period</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import { Calendar, GitCommit, CheckCircle2 } from 'lucide-react';
import styles from './activity-heatmap-calendar.module.css';

type ActivityCategory = 'commits' | 'deployments' | 'evals';

interface DayCell {
  date: string;
  count: number;
  level: number; // 0 to 4
}

export function ActivityHeatmapCalendar() {
  const [category, setCategory] = useState<ActivityCategory>('commits');
  const [hoveredCell, setHoveredCell] = useState<DayCell | null>(null);

  // Deterministically generate 16 weeks of 7 days (112 cells)
  const weeks = useMemo(() => {
    const seedOffset = category === 'commits' ? 3 : category === 'deployments' ? 7 : 11;
    const generatedWeeks: DayCell[][] = [];

    for (let w = 0; w < 16; w++) {
      const week: DayCell[] = [];
      for (let d = 0; d < 7; d++) {
        const dayIdx = w * 7 + d;
        // Pseudo-random deterministic hash
        const val = ((dayIdx * 17 + seedOffset * 31 + (dayIdx % 5) * 13) % 100);
        let count = 0;
        let level = 0;

        if (val > 80) {
          level = 4;
          count = 8 + (val % 7);
        } else if (val > 60) {
          level = 3;
          count = 5 + (val % 4);
        } else if (val > 35) {
          level = 2;
          count = 2 + (val % 3);
        } else if (val > 15) {
          level = 1;
          count = 1;
        }

        const dateStr = `2026-0${Math.floor(w / 4) + 1}-${String((d * 4 + (w % 4) * 7) % 28 + 1).padStart(2, '0')}`;

        week.push({
          date: dateStr,
          count,
          level,
        });
      }
      generatedWeeks.push(week);
    }
    return generatedWeeks;
  }, [category]);

  const totalCount = useMemo(() => {
    return weeks.flat().reduce((acc, curr) => acc + curr.count, 0);
  }, [weeks]);

  return (
    <div className={styles.container}>
      {/* Top Header */}
      <div className={styles.header}>
        <div className={styles.badge} data-preview-chrome>
          <Calendar size={13} />
          <span>Cadence Activity Heatmap</span>
        </div>

        <div className={styles.categorySelectors} data-preview-chrome>
          {(['commits', 'deployments', 'evals'] as ActivityCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`${styles.catBtn} ${category === cat ? styles.activeCat : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI row */}
      <div className={styles.summaryRow} data-preview-chrome>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Total Events (Past 16 Wks)</span>
          <strong className={styles.summaryValue}>{totalCount.toLocaleString()}</strong>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Streak Consistency</span>
          <strong className={styles.summaryValueHighlight}>
            <CheckCircle2 size={14} /> 94.2% Active
          </strong>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className={styles.gridScroll}>
        <div className={styles.heatmapGrid} data-preview-fit="width">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className={styles.weekCol}>
              {week.map((cell, dIdx) => (
                <button
                  key={dIdx}
                  className={`${styles.cell} ${styles[`level${cell.level}`]}`}
                  onMouseEnter={() => setHoveredCell(cell)}
                  onMouseLeave={() => setHoveredCell(null)}
                  onFocus={() => setHoveredCell(cell)}
                  onBlur={() => setHoveredCell(null)}
                  aria-label={`${cell.count} ${category} on ${cell.date}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Hover Tooltip / Detail Bar */}
      <div className={styles.footerRow} data-preview-chrome>
        <div className={styles.detailText}>
          {hoveredCell ? (
            <span className={styles.activeCellInfo}>
              <GitCommit size={13} />
              <strong>{hoveredCell.count}</strong> {category} on <code>{hoveredCell.date}</code>
            </span>
          ) : (
            <span className={styles.placeholderText}>Hover over any square for event details</span>
          )}
        </div>

        {/* Legend */}
        <div className={styles.legend}>
          <span className={styles.legendText}>Less</span>
          <div className={`${styles.cell} ${styles.level0}`} />
          <div className={`${styles.cell} ${styles.level1}`} />
          <div className={`${styles.cell} ${styles.level2}`} />
          <div className={`${styles.cell} ${styles.level3}`} />
          <div className={`${styles.cell} ${styles.level4}`} />
          <span className={styles.legendText}>More</span>
        </div>
      </div>
    </div>
  );
}

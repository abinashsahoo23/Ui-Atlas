'use client';

import React, { useState } from 'react';
import { Bell, CheckCircle2, AlertTriangle, AlertCircle, Info, X, Plus } from 'lucide-react';
import styles from './notification-toast-stack.module.css';

type ToastType = 'success' | 'info' | 'warning' | 'error';

interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description: string;
  time: string;
}

const INITIAL_TOASTS: ToastItem[] = [
  {
    id: 't-1',
    type: 'success',
    title: 'Deployment Succeeded',
    description: 'Kernel instance active on edge worker eu-west-1.',
    time: 'Just now',
  },
  {
    id: 't-2',
    type: 'warning',
    title: 'High Ingress Volume',
    description: 'Throughput exceeded 1.2M req/sec threshold.',
    time: '2m ago',
  },
];

export function NotificationToastStack() {
  const [toasts, setToasts] = useState<ToastItem[]>(INITIAL_TOASTS);

  const addToast = (type: ToastType) => {
    const templates: Record<ToastType, { title: string; description: string }> = {
      success: {
        title: 'Cache Compacted',
        description: 'Parquet table compacted into 142 KB chunk.',
      },
      info: {
        title: 'Consensus Rebalance',
        description: 'Raft protocol synchronized with 5 edge peers.',
      },
      warning: {
        title: 'Memory Utilization 82%',
        description: 'Buffer pool nearing garbage collection limit.',
      },
      error: {
        title: 'Socket Handshake Failed',
        description: 'Connection reset by remote peer 192.168.1.42.',
      },
    };

    const newToast: ToastItem = {
      id: `toast-${Date.now()}-${Math.random()}`,
      type,
      title: templates[type].title,
      description: templates[type].description,
      time: 'Just now',
    };

    setToasts((prev) => [newToast, ...prev.slice(0, 3)]); // Keep max 4 in stack
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const clearAll = () => {
    setToasts([]);
  };

  return (
    <div className={styles.container}>
      {/* Trigger Controls Header */}
      <div className={styles.header}>
        <div className={styles.badge} data-preview-chrome>
          <Bell size={13} />
          <span>Interactive Toast Stack</span>
        </div>

        <div className={styles.actions} data-preview-chrome>
          <button
            onClick={() => addToast('success')}
            className={`${styles.triggerBtn} ${styles.btnSuccess}`}
          >
            <Plus size={11} /> Success
          </button>
          <button
            onClick={() => addToast('info')}
            className={`${styles.triggerBtn} ${styles.btnInfo}`}
          >
            <Plus size={11} /> Info
          </button>
          <button
            onClick={() => addToast('warning')}
            className={`${styles.triggerBtn} ${styles.btnWarning}`}
          >
            <Plus size={11} /> Warning
          </button>
          <button
            onClick={() => addToast('error')}
            className={`${styles.triggerBtn} ${styles.btnError}`}
          >
            <Plus size={11} /> Error
          </button>
          {toasts.length > 0 && (
            <button onClick={clearAll} className={styles.clearBtn}>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Stacked Toasts Showcase Viewport */}
      <div className={styles.viewport}>
        {toasts.length === 0 ? (
          <div className={styles.emptyState}>
            <span>No notifications in stack. Click a button above to trigger.</span>
          </div>
        ) : (
          <div className={styles.stackWrapper}>
            {toasts.map((toast, index) => {
              const Icon =
                toast.type === 'success'
                  ? CheckCircle2
                  : toast.type === 'warning'
                  ? AlertTriangle
                  : toast.type === 'error'
                  ? AlertCircle
                  : Info;

              // Stack card offset calculation
              const translateY = index * 12;
              const scale = 1 - index * 0.04;
              const opacity = 1 - index * 0.15;

              return (
                <div
                  key={toast.id}
                  className={`${styles.toastCard} ${styles[toast.type]}`}
                  style={{
                    transform: `translateY(${translateY}px) scale(${scale})`,
                    zIndex: 10 - index,
                    opacity,
                  }}
                  role="status"
                  aria-live="polite"
                >
                  <div className={styles.iconCol}>
                    <Icon size={18} />
                  </div>

                  <div className={styles.contentCol}>
                    <div className={styles.cardTop}>
                      <span className={styles.toastTitle}>{toast.title}</span>
                      <span className={styles.toastTime}>{toast.time}</span>
                    </div>
                    <p className={styles.toastDesc}>{toast.description}</p>
                  </div>

                  <button
                    onClick={() => removeToast(toast.id)}
                    className={styles.closeBtn}
                    aria-label="Dismiss notification"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

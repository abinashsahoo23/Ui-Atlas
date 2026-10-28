"use client";

import { useState } from "react";
import { Folder, FileText } from "lucide-react";
import styles from "./tactile-folder-index.module.css";

interface FolderTab {
  id: string;
  label: string;
  title: string;
  badge: string;
  items: { name: string; status: string }[];
}

const TABS: FolderTab[] = [
  {
    id: "specimens",
    label: "SPECIMENS",
    title: "Registered Atlas Specimens",
    badge: "10 ACTIVE ENTRIES",
    items: [
      { name: "Prism Refraction Burst", status: "VERIFIED" },
      { name: "Lightning Energy Mesh", status: "SYNCHRONIZED" },
      { name: "Hyperspeed Frustum", status: "ONLINE" },
    ],
  },
  {
    id: "telemetry",
    label: "TELEMETRY",
    title: "System Performance Metrics",
    badge: "ZERO REGRESSION",
    items: [
      { name: "GPU Frame Rate", status: "120 FPS STABLE" },
      { name: "Pointer Listener Scope", status: "CONTAINER BOUND" },
      { name: "WebGL Context Count", status: "ISOLATED" },
    ],
  },
  {
    id: "security",
    label: "SECURITY",
    title: "Cryptographic Attestation",
    badge: "ENCLAVE VALID",
    items: [
      { name: "Local Storage Vault", status: "ENCRYPTED" },
      { name: "Static Registry Check", status: "PASSED" },
      { name: "TypeScript Strict Mode", status: "100% COMPLIANT" },
    ],
  },
];

export default function TactileFolderIndex() {
  const [activeTabId, setActiveTabId] = useState<string>("specimens");
  const currentTab = TABS.find((t) => t.id === activeTabId) || TABS[0];

  return (
    <div className={styles.container}>
      <div className={styles.centerStage}>
        <div className={styles.folderContainer}>
          {/* Tactile Tab Header */}
          <div className={styles.tabBar} role="tablist" aria-label="Folder drawer tabs">
            {TABS.map((tab) => {
              const isActive = tab.id === activeTabId;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  className={`${styles.tabButton} ${isActive ? styles.activeTab : ""}`}
                  onClick={() => setActiveTabId(tab.id)}
                  aria-selected={isActive}
                >
                  <Folder size={13} aria-hidden="true" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Folder Sheet Body */}
          <div className={styles.folderBody} role="tabpanel" aria-label={currentTab.title}>
            <div className={styles.sheetHeader}>
              <h4 className={styles.sheetTitle}>{currentTab.title}</h4>
              <span className={styles.sheetBadge}>{currentTab.badge}</span>
            </div>

            <div className={styles.sheetList}>
              {currentTab.items.map((row, idx) => (
                <div key={idx} className={styles.sheetRow}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <FileText size={14} color="#94a3b8" aria-hidden="true" />
                    <span>{row.name}</span>
                  </div>
                  <span className={styles.sheetRowStatus}>{row.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.overlay} data-preview-chrome>
        <div className={styles.badge}>
          <Folder size={12} aria-hidden="true" />
          <span>Neumorphic Tab Drawer Index</span>
        </div>
        <h3 className={styles.title}>Tactile Folder Index</h3>
        <p className={styles.description}>
          Layered paper-tab elevation indexer with physical tab-sheet switching and accessible ARIA keyboard navigation.
        </p>
      </div>

      <div className={styles.controls} data-preview-chrome>
        <div className={styles.controlGroup} role="toolbar" aria-label="Folder tab switchers">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`${styles.btn} ${activeTabId === tab.id ? styles.active : ""}`}
              onClick={() => setActiveTabId(tab.id)}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

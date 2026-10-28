"use client";

import { useState } from "react";
import { Bell, Compass, FolderKanban, Home, Search, Settings } from 'lucide-react';
import styles from "./floating-dock-nav.module.css";

interface DockItem {
  id: string;
  label: string;
  icon: typeof Home;
  badge?: number;
}

const dockItems: DockItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "explore", label: "Explore", icon: Compass },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "alerts", label: "Alerts", icon: Bell, badge: 3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function FloatingDockNav() {
  const [activeId, setActiveId] = useState<string>("home");
  const [searchFocused, setSearchFocused] = useState<boolean>(false);

  return (
    <nav className={styles.dockContainer} aria-label="Floating dock navigation">
      <div className={styles.dockBar}>
        <div className={styles.brandMark} aria-hidden="true">
          <span className={styles.brandDot} />
        </div>

        <ul className={styles.itemList} role="tablist">
          {dockItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeId === item.id;

            return (
              <li key={item.id} role="presentation">
                <button
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={item.label}
                  className={`${styles.dockButton} ${isActive ? styles.activeButton : ""}`}
                  onClick={() => setActiveId(item.id)}
                >
                  <Icon size={18} className={styles.icon} aria-hidden="true" />
                  <span className={styles.tooltip}>{item.label}</span>
                  {item.badge ? (
                    <span className={styles.badge} aria-label={`${item.badge} notifications`}>
                      {item.badge}
                    </span>
                  ) : null}
                  {isActive && <span className={styles.activePill} aria-hidden="true" />}
                </button>
              </li>
            );
          })}
        </ul>

        <div className={styles.divider} aria-hidden="true" />

        <div className={`${styles.quickAction} ${searchFocused ? styles.focused : ""}`}>
          <Search size={15} className={styles.searchIcon} aria-hidden="true" />
          <input
            type="search"
            placeholder="Jump to…"
            aria-label="Quick search navigation"
            className={styles.searchInput}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <kbd className={styles.kbd}>⌘K</kbd>
        </div>
      </div>
    </nav>
  );
}

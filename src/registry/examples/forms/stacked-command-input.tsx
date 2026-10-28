"use client";

import { useState } from "react";
import { Search, X, SlidersHorizontal, CornerDownLeft, FileCode, Layers, Key } from "lucide-react";
import styles from "./stacked-command-input.module.css";

interface SearchResult {
  id: string;
  category: "component" | "token" | "hook";
  title: string;
  subtitle: string;
  shortcut?: string;
}

const mockResults: SearchResult[] = [
  {
    id: "1",
    category: "component",
    title: "FloatingDockNav",
    subtitle: "src/registry/examples/navigation/floating-dock-nav.tsx",
    shortcut: "NAV",
  },
  {
    id: "2",
    category: "component",
    title: "TiltSpecimenCard",
    subtitle: "src/registry/examples/cards/tilt-specimen-card.tsx",
    shortcut: "CRD",
  },
  {
    id: "3",
    category: "hook",
    title: "useReducedMotion",
    subtitle: "src/hooks/use-reduced-motion.ts",
    shortcut: "A11Y",
  },
  {
    id: "4",
    category: "token",
    title: "--surface-raised",
    subtitle: "src/app/globals.css",
    shortcut: "CSS",
  },
];

export default function StackedCommandInput() {
  const [query, setQuery] = useState<string>("");
  const [filter, setFilter] = useState<"all" | "component" | "hook" | "token">("all");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const filteredResults = mockResults.filter((item) => {
    const matchesFilter = filter === "all" || item.category === filter;
    const matchesQuery =
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <div className={styles.commandModal}>
      {/* Input row */}
      <div className={styles.inputWrapper}>
        <Search size={18} className={styles.searchIcon} aria-hidden="true" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(0);
          }}
          placeholder="Type a command or search assets…"
          aria-label="Command search"
          className={styles.inputField}
        />
        {query ? (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={() => setQuery("")}
            aria-label="Clear search input"
          >
            <X size={14} aria-hidden="true" />
          </button>
        ) : (
          <kbd className={styles.kbdShortcut}>⌘K</kbd>
        )}
      </div>

      {/* Filter Chips Bar */}
      <div className={styles.chipsBar}>
        <SlidersHorizontal size={13} className={styles.filterIcon} aria-hidden="true" />
        <div className={styles.chipList}>
          <button
            type="button"
            className={`${styles.chip} ${filter === "all" ? styles.activeChip : ""}`}
            onClick={() => setFilter("all")}
          >
            All Items
          </button>
          <button
            type="button"
            className={`${styles.chip} ${filter === "component" ? styles.activeChip : ""}`}
            onClick={() => setFilter("component")}
          >
            Components
          </button>
          <button
            type="button"
            className={`${styles.chip} ${filter === "hook" ? styles.activeChip : ""}`}
            onClick={() => setFilter("hook")}
          >
            Hooks
          </button>
          <button
            type="button"
            className={`${styles.chip} ${filter === "token" ? styles.activeChip : ""}`}
            onClick={() => setFilter("token")}
          >
            Tokens
          </button>
        </div>
      </div>

      {/* Results List */}
      <div className={styles.resultsContainer} role="listbox">
        {filteredResults.length === 0 ? (
          <div className={styles.emptyState}>No artifacts matching &ldquo;{query}&rdquo;</div>
        ) : (
          filteredResults.map((item, index) => {
            const isSelected = index === selectedIndex;
            return (
              <div
                key={item.id}
                role="option"
                aria-selected={isSelected}
                className={`${styles.resultRow} ${isSelected ? styles.selectedRow : ""}`}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className={styles.iconCell}>
                  {item.category === "component" && <FileCode size={15} aria-hidden="true" />}
                  {item.category === "hook" && <Layers size={15} aria-hidden="true" />}
                  {item.category === "token" && <Key size={15} aria-hidden="true" />}
                </div>

                <div className={styles.infoCell}>
                  <div className={styles.titleLine}>
                    <span className={styles.resultTitle}>{item.title}</span>
                    {item.shortcut && <span className={styles.tagBadge}>{item.shortcut}</span>}
                  </div>
                  <span className={styles.resultSubtitle}>{item.subtitle}</span>
                </div>

                <div className={styles.actionCell}>
                  {isSelected && (
                    <span className={styles.selectHint}>
                      <CornerDownLeft size={12} aria-hidden="true" /> Select
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Navigation Hints */}
      <div className={styles.footerHints}>
        <span>
          <kbd className={styles.smallKbd}>↑</kbd> <kbd className={styles.smallKbd}>↓</kbd> Navigate
        </span>
        <span>
          <kbd className={styles.smallKbd}>↵</kbd> Open
        </span>
        <span>
          <kbd className={styles.smallKbd}>esc</kbd> Dismiss
        </span>
      </div>
    </div>
  );
}

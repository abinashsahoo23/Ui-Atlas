"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Terminal, Zap, FileText, CornerDownLeft, Sparkles, X } from 'lucide-react';
import styles from "./command-palette-overlay.module.css";

const COMMANDS = [
  { id: "deploy", label: "Deploy to Production", category: "Deployments", icon: Zap, shortcut: "⌘D" },
  { id: "logs", label: "View Real-time Runtime Logs", category: "Observability", icon: Terminal, shortcut: "⌘L" },
  { id: "docs", label: "Browse API Documentation", category: "Knowledge", icon: FileText, shortcut: "⌘B" },
  { id: "secret", label: "Rotate Cryptographic Keys", category: "Security", icon: Sparkles, shortcut: "⌘R" },
  { id: "purge", label: "Purge Edge Cache Network", category: "Performance", icon: Zap, shortcut: "⌘P" },
];

export default function CommandPaletteOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [executedMessage, setExecutedMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = COMMANDS.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => {
          if (prev) {
            setQuery("");
            setSelectedIndex(0);
          }
          return !prev;
        });
      } else if (e.key === "Escape") {
        setIsOpen(false);
        setQuery("");
        setSelectedIndex(0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const executeCommand = (cmd: (typeof COMMANDS)[0]) => {
    setExecutedMessage(`Executed: ${cmd.label}`);
    setIsOpen(false);
    setTimeout(() => setExecutedMessage(null), 3000);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault();
      executeCommand(filtered[selectedIndex]);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.triggerContainer}>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={styles.triggerBtn}
          aria-label="Open command palette"
        >
          <Search size={15} aria-hidden="true" />
          <span className={styles.triggerText}>Quick Command Search…</span>
          <span className={styles.kbdShortcut}>⌘K</span>
        </button>

        {executedMessage && (
          <div className={styles.toast} role="status">
            <Zap size={13} aria-hidden="true" />
            <span>{executedMessage}</span>
          </div>
        )}
      </div>

      {isOpen && (
        <div className={styles.backdrop} onClick={() => setIsOpen(false)}>
          <div
            className={styles.paletteModal}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Command search palette"
          >
            <div className={styles.searchBar}>
              <Search size={16} className={styles.searchIcon} aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleInputKeyDown}
                placeholder="Type a command or search action…"
                className={styles.input}
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={styles.closeBtn}
                aria-label="Close palette"
              >
                <X size={15} />
              </button>
            </div>

            <div className={styles.commandList} role="listbox">
              {filtered.length > 0 ? (
                filtered.map((cmd, idx) => {
                  const Icon = cmd.icon;
                  const isSelected = selectedIndex === idx;
                  return (
                    <div
                      key={cmd.id}
                      role="option"
                      aria-selected={isSelected}
                      className={styles.commandItem}
                      data-selected={isSelected}
                      onClick={() => executeCommand(cmd)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                    >
                      <div className={styles.commandIcon}>
                        <Icon size={14} />
                      </div>
                      <div className={styles.commandInfo}>
                        <span className={styles.commandLabel}>{cmd.label}</span>
                        <span className={styles.commandCategory}>{cmd.category}</span>
                      </div>
                      <span className={styles.shortcutBadge}>{cmd.shortcut}</span>
                    </div>
                  );
                })
              ) : (
                <div className={styles.emptyResults}>
                  <p>No commands matching “{query}”</p>
                </div>
              )}
            </div>

            <footer className={styles.paletteFooter}>
              <span>Navigate <kbd>↑</kbd> <kbd>↓</kbd></span>
              <span>Execute <kbd><CornerDownLeft size={10} /></kbd></span>
              <span>Close <kbd>ESC</kbd></span>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { Terminal, RotateCcw } from 'lucide-react';
import styles from "./decrypted-heading.module.css";

const GLYPHS = "01_#%&*+=-~<>[]{}!$";
const PHRASES = [
  "DECRYPTING ARCHITECTURAL SPECIFICATION",
  "SECURE KERNEL INITIALIZED: ZONE-01",
  "CYBERNETIC RUNTIME READY FOR PRODUCTION",
];

export default function DecryptedHeading() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const targetText = PHRASES[phraseIdx];
  const [displayText, setDisplayText] = useState(targetText);
  const [isDecoding, setIsDecoding] = useState(false);
  const [accentColor, setAccentColor] = useState<"emerald" | "cyan" | "amber">("emerald");

  const startDecryption = useCallback(() => {
    setIsDecoding(true);
    let iteration = 0;
    const maxIterations = targetText.length * 3;

    const interval = setInterval(() => {
      setDisplayText(() => {
        return targetText
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration / 3) {
              return targetText[index];
            }
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("");
      });

      iteration++;
      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(targetText);
        setIsDecoding(false);
      }
    }, 28);
  }, [targetText]);

  useEffect(() => {
    const timer = setTimeout(() => {
      startDecryption();
    }, 20);
    return () => clearTimeout(timer);
  }, [startDecryption]);

  return (
    <div className={styles.container} data-accent={accentColor}>
      <header className={styles.header}>
        <div className={styles.terminalBadge} data-preview-chrome>
          <Terminal size={14} aria-hidden="true" />
          <span>CYBERNETIC TELEMETRY // CIPHER-MATRIX</span>
        </div>
        <div className={styles.controls} data-preview-chrome>
          <div className={styles.colorPills}>
            {(["emerald", "cyan", "amber"] as const).map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setAccentColor(color)}
                className={styles.colorBtn}
                data-color={color}
                data-active={accentColor === color}
                aria-label={`Set accent to ${color}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setPhraseIdx((prev) => (prev + 1) % PHRASES.length);
            }}
            className={styles.actionBtn}
            disabled={isDecoding}
            aria-label="Switch phrase and decrypt"
          >
            <RotateCcw size={12} className={isDecoding ? styles.spinning : ""} />
            <span>Replay</span>
          </button>
        </div>
      </header>

      <div className={styles.cipherBox}>
        <span className={styles.metaPrompt}>ROOT@SYSTEM:~$ ./decrypt_stream.sh</span>
        <h2 className={styles.heading} aria-label={targetText}>
          {displayText}
          <span className={styles.cursor} aria-hidden="true">_</span>
        </h2>
      </div>

      <footer className={styles.footer}>
        <span>STATUS: {isDecoding ? "DECODING STREAM..." : "RESOLVED & VERIFIED"}</span>
        <span>CIPHER: AES-GCM-256</span>
      </footer>
    </div>
  );
}

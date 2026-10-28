"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Plane, Play, Pause, RefreshCw, Volume2, VolumeX, Send, Shuffle } from 'lucide-react';
import styles from "./split-flap-display.module.css";

const ROW_LEN = 24;

interface SchedulePreset {
  id: string;
  label: string;
  line1: string;
  line2: string;
  line3: string;
}

const PRESETS: SchedulePreset[] = [
  {
    id: "hnd",
    label: "Tokyo HND",
    line1: "JL 004 · TOKYO HND",
    line2: "GATE B12 · 14:30 · BOARD",
    line3: "ALL SEATS · ON TIME",
  },
  {
    id: "lhr",
    label: "London LHR",
    line1: "BA 091 · LONDON LHR",
    line2: "GATE A03 · 15:15 · ON TIME",
    line3: "BAGGAGE BELT 04 · OPEN",
  },
  {
    id: "jfk",
    label: "New York JFK",
    line1: "UA 880 · NEW YORK JFK",
    line2: "GATE C19 · 16:00 · DELAYED",
    line3: "CREW CHECK · WAIT 20M",
  },
  {
    id: "cdg",
    label: "Paris CDG",
    line1: "AF 142 · PARIS CDG",
    line2: "GATE D08 · 16:45 · ON TIME",
    line3: "FINAL CALL · GATE CLOSING",
  },
  {
    id: "atlas",
    label: "UI Atlas 01",
    line1: "UI ATLAS · DIGITAL CRAFT",
    line2: "INDEX 54 · ALL OPERATIONAL",
    line3: "LOCAL MEMORY · HIGH RELIEF",
  },
];

function playMechanicalTick() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.022);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.022);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.025);
  } catch {
    // Autoplay or audio context permission restricted
  }
}

interface FlapCellProps {
  char: string;
  delayMs: number;
  soundEnabled: boolean;
}

function FlapCell({ char, delayMs, soundEnabled }: FlapCellProps) {
  const [displayChar, setDisplayChar] = useState(char);
  const [prevChar, setPrevChar] = useState(char);
  const [isFlipping, setIsFlipping] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (char === displayChar) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setPrevChar(displayChar);
      setIsFlipping(true);

      if (soundEnabled && char !== " ") {
        playMechanicalTick();
      }

      const animTimeout = setTimeout(() => {
        setDisplayChar(char);
        setIsFlipping(false);
      }, 200);

      return () => clearTimeout(animTimeout);
    }, delayMs);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [char, delayMs, displayChar, soundEnabled]);

  const topChar = isFlipping ? char : displayChar;
  const bottomChar = isFlipping ? prevChar : displayChar;
  const flipTopChar = prevChar;
  const flipBottomChar = char;

  return (
    <div
      className={styles.flapCell}
      data-flipping={isFlipping ? "true" : "false"}
      data-empty={displayChar === " "}
      aria-hidden="true"
    >
      {/* Top half static (reveals next character as flip top falls) */}
      <div className={styles.topHalf}>
        <div className={styles.glyphTop}>{topChar}</div>
      </div>

      {/* Bottom half static (shows old character until covered by bottom flap) */}
      <div className={styles.bottomHalf}>
        <div className={styles.glyphBottom}>{bottomChar}</div>
      </div>

      {/* Animated falling flaps during 3D flip */}
      {isFlipping && (
        <>
          <div className={styles.flipTopLeaf}>
            <div className={styles.glyphTop}>{flipTopChar}</div>
            <div className={styles.flipShadow} />
          </div>
          <div className={styles.flipBottomLeaf}>
            <div className={styles.glyphBottom}>{flipBottomChar}</div>
            <div className={styles.flipHighlight} />
          </div>
        </>
      )}

      {/* Mechanical center seam & hinges */}
      <div className={styles.seam} />
      <div className={styles.hingeLeft} />
      <div className={styles.hingeRight} />
    </div>
  );
}

export default function SplitFlapDisplay() {
  const [presetIndex, setPresetIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [customInput1, setCustomInput1] = useState("");
  const [customInput2, setCustomInput2] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);

  const [activeLines, setActiveLines] = useState<string[]>([
    PRESETS[0].line1.padEnd(ROW_LEN, " ").slice(0, ROW_LEN),
    PRESETS[0].line2.padEnd(ROW_LEN, " ").slice(0, ROW_LEN),
    PRESETS[0].line3.padEnd(ROW_LEN, " ").slice(0, ROW_LEN),
  ]);

  const loadPreset = useCallback((idx: number) => {
    setIsCustomMode(false);
    setPresetIndex(idx);
    const p = PRESETS[idx];
    setActiveLines([
      p.line1.toUpperCase().padEnd(ROW_LEN, " ").slice(0, ROW_LEN),
      p.line2.toUpperCase().padEnd(ROW_LEN, " ").slice(0, ROW_LEN),
      p.line3.toUpperCase().padEnd(ROW_LEN, " ").slice(0, ROW_LEN),
    ]);
  }, []);

  useEffect(() => {
    if (isPaused || isCustomMode) return;
    const timer = setInterval(() => {
      setPresetIndex((prev) => {
        const next = (prev + 1) % PRESETS.length;
        loadPreset(next);
        return next;
      });
    }, 5500);

    return () => clearInterval(timer);
  }, [isPaused, isCustomMode, loadPreset]);

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput1.trim() && !customInput2.trim()) return;

    setIsCustomMode(true);
    setIsPaused(true);
    setActiveLines([
      customInput1.toUpperCase().padEnd(ROW_LEN, " ").slice(0, ROW_LEN),
      customInput2.toUpperCase().padEnd(ROW_LEN, " ").slice(0, ROW_LEN),
      "CUSTOM OPERATIONAL MESSAGE".padEnd(ROW_LEN, " ").slice(0, ROW_LEN),
    ]);
  };

  const handleShuffle = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const randLine = (prefix: string) => {
      let res = prefix;
      while (res.length < ROW_LEN) {
        res += chars[Math.floor(Math.random() * chars.length)];
      }
      return res;
    };
    setIsCustomMode(true);
    setIsPaused(true);
    setActiveLines([
      randLine("TEST ").slice(0, ROW_LEN),
      randLine("MATRIX ").slice(0, ROW_LEN),
      randLine("ZONE ").slice(0, ROW_LEN),
    ]);
  };

  const fullBoardAccessibleText = activeLines.map((l) => l.trim()).filter(Boolean).join(" | ");

  return (
    <div className={styles.board}>
      {/* Board Header Bar */}
      <header className={styles.boardHeader}>
        <div className={styles.headerTitle}>
          <Plane size={15} className={styles.planeIcon} aria-hidden="true" />
          <span>TERMINAL DEPARTURES // SOLARI MECHANICAL MATRIX</span>
        </div>

        <div className={styles.headerControls}>
          <button
            type="button"
            onClick={() => setSoundEnabled((prev) => !prev)}
            className={styles.controlBtn}
            aria-label={soundEnabled ? "Mute mechanical click sound" : "Enable mechanical click sound"}
            title={soundEnabled ? "Sound enabled" : "Sound muted"}
          >
            {soundEnabled ? <Volume2 size={13} className={styles.soundActive} /> : <VolumeX size={13} />}
            <span>{soundEnabled ? "Audio ON" : "Muted"}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPaused((prev) => !prev)}
            className={styles.controlBtn}
            aria-label={isPaused ? "Resume auto flap cycler" : "Pause auto flap cycler"}
          >
            {isPaused ? <Play size={13} /> : <Pause size={13} />}
            <span>{isPaused ? "Resume" : "Pause"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const next = (presetIndex + 1) % PRESETS.length;
              loadPreset(next);
            }}
            className={styles.controlBtn}
            aria-label="Next departure schedule"
          >
            <RefreshCw size={13} />
            <span>Cycle</span>
          </button>
        </div>
      </header>

      {/* Main Flap Matrix Grid (Row by Row) */}
      <div
        className={styles.flapMatrixContainer}
        role="region"
        aria-label={`Split-flap departures board: ${fullBoardAccessibleText}`}
      >
        {activeLines.map((line, rowIdx) => (
          <div key={rowIdx} className={styles.matrixRow}>
            {line.split("").map((c, colIdx) => (
              <FlapCell
                key={`${rowIdx}-${colIdx}`}
                char={c}
                delayMs={colIdx * 32 + rowIdx * 80}
                soundEnabled={soundEnabled}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Preset Quick Selectors */}
      <div className={styles.presetToolbar} data-preview-chrome>
        <span className={styles.toolbarLabel}>SCHEDULE PRESETS:</span>
        <div className={styles.presetButtons} data-preview-chrome>
          {PRESETS.map((p, idx) => (
            <button
              key={p.id}
              type="button"
              onClick={() => loadPreset(idx)}
              className={styles.presetBtn}
              data-active={!isCustomMode && presetIndex === idx}
            >
              {p.label}
            </button>
          ))}
          <button
            type="button"
            onClick={handleShuffle}
            className={styles.presetBtn}
            title="Trigger test mechanical shuffle"
          >
            <Shuffle size={11} />
            <span>Test Shuffle</span>
          </button>
        </div>
      </div>

      {/* Custom Message Input Form */}
      <form onSubmit={handleApplyCustom} className={styles.customForm}>
        <div className={styles.inputsRow}>
          <div className={styles.inputGroup}>
            <label htmlFor="flap-line1" className={styles.inputLabel}>
              Line 1 (Flight & Destination):
            </label>
            <input
              id="flap-line1"
              type="text"
              maxLength={ROW_LEN}
              placeholder="e.g. SKY 777 · SAN FRANCISCO"
              value={customInput1}
              onChange={(e) => setCustomInput1(e.target.value)}
              className={styles.customInput}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="flap-line2" className={styles.inputLabel}>
              Line 2 (Gate & Status):
            </label>
            <input
              id="flap-line2"
              type="text"
              maxLength={ROW_LEN}
              placeholder="e.g. GATE F04 · 18:20 · BOARD"
              value={customInput2}
              onChange={(e) => setCustomInput2(e.target.value)}
              className={styles.customInput}
            />
          </div>

          <button type="submit" className={styles.sendBtn}>
            <Send size={12} />
            <span>Flip to Board</span>
          </button>
        </div>
      </form>

      {/* Board Metadata Footer */}
      <footer className={styles.boardFooter}>
        <span className={styles.statusIndicator}>
          <span className={styles.statusLed} />
          <span>SOLARI MATRIX // BERLIN STATION</span>
        </span>
        <span>24 CHARACTERS × 3 LINES // ELECTROMECHANICAL 3D LEAF CASSETTE</span>
      </footer>
    </div>
  );
}

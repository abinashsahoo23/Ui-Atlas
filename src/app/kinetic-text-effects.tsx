"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import styles from "./kinetic-text.module.css";

const CIPHER_GLYPHS = "01_#%&*+=-~<>[]{}!$XA";

/**
 * 1. DecryptedText:
 * Cyberpunk matrix decryption scramble that progressively resolves to target text.
 * Triggers on initial mount and when hovered.
 */
export function DecryptedText({
  text,
  className = "",
  triggerOnHover = true,
  speed = 28,
  glow = "indigo",
}: {
  text: string;
  className?: string;
  triggerOnHover?: boolean;
  speed?: number;
  glow?: "red" | "indigo" | "none";
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isDecoding, setIsDecoding] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startDecryption = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsDecoding(true);
    let iteration = 0;
    const maxIterations = text.length * 3;

    intervalRef.current = setInterval(() => {
      setDisplayText(() => {
        return text
          .split("")
          .map((char, index) => {
            if (char === " " || char === "/" || char === "[" || char === "]" || char === "-") {
              return char;
            }
            if (index < iteration / 3) {
              return text[index];
            }
            return CIPHER_GLYPHS[Math.floor(Math.random() * CIPHER_GLYPHS.length)];
          })
          .join("");
      });

      iteration++;
      if (iteration >= maxIterations) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsDecoding(false);
      }
    }, speed);
  }, [text, speed]);

  useEffect(() => {
    const timer = setTimeout(() => {
      startDecryption();
    }, 40);
    return () => {
      clearTimeout(timer);
      const activeInterval = intervalRef.current;
      if (activeInterval) clearInterval(activeInterval);
    };
  }, [startDecryption]);

  const glowClass =
    glow === "red"
      ? styles.glowRed
      : glow === "indigo"
      ? styles.glowIndigo
      : "";

  return (
    <span
      className={`${styles.decryptedWrapper} ${glowClass} ${isDecoding ? styles.decodingActive : ""} ${className}`}
      onMouseEnter={triggerOnHover ? startDecryption : undefined}
      title={text}
      aria-label={text}
    >
      {displayText}
    </span>
  );
}

/**
 * 2. CyberGlitchText / GlitchText:
 * Authentic high-octane cyberpunk glitch animation featuring horizontal polygon
 * clip-path slice displacement, periodic analog scanline jitter, and dual-layer
 * RGB chromatic separation (neon red & cyan/electric indigo).
 */
export function CyberGlitchText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <span
      className={`${styles.glitchTextRoot} ${className}`}
      data-text={text}
      aria-label={text}
    >
      <span className={styles.glitchTextBase}>{text}</span>
      <span className={styles.glitchTextSliceRed} aria-hidden="true">
        {text}
      </span>
      <span className={styles.glitchTextSliceCyan} aria-hidden="true">
        {text}
      </span>
    </span>
  );
}

export const GlitchText = CyberGlitchText;
export const StaggeredRiseText = CyberGlitchText;

/**
 * 3. GlitchAuroraText:
 * High-octane flowing liquid gradient text that unleashes an analog RGB chromatic
 * glitch slice on hover with dual pseudo-layer displacement.
 */
export function GlitchAuroraText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <span
      className={`${styles.glitchAurora} ${className}`}
      data-text={text}
      aria-label={text}
    >
      <span className={styles.glitchBase}>{text}</span>
      <span className={styles.glitchSliceRed} aria-hidden="true">{text}</span>
      <span className={styles.glitchSliceIndigo} aria-hidden="true">{text}</span>
    </span>
  );
}

/**
 * 4. ShimmerText:
 * Refined holographic light-beam shimmer that glides continuously across typography.
 */
export function ShimmerText({
  children,
  className = "",
  speed = "normal",
  theme = "silver",
}: {
  children: React.ReactNode;
  className?: string;
  speed?: "fast" | "normal" | "slow";
  theme?: "silver" | "red" | "indigo";
}) {
  const speedClass =
    speed === "fast"
      ? styles.shimmerFast
      : speed === "slow"
      ? styles.shimmerSlow
      : styles.shimmerNormal;

  const themeClass =
    theme === "red"
      ? styles.shimmerThemeRed
      : theme === "indigo"
      ? styles.shimmerThemeIndigo
      : styles.shimmerThemeSilver;

  return (
    <span className={`${styles.shimmerWrapper} ${speedClass} ${themeClass} ${className}`}>
      {children}
    </span>
  );
}

/**
 * 5. CounterTicker:
 * Mechanical numeric counter that rolls from 0 to the target value when scrolled into view.
 */
export function CounterTicker({
  value,
  suffix = "",
  className = "",
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);

            // Animate number count up with easing
            const startTime = performance.now();
            const duration = 1200; // 1.2s

            const tick = (now: number) => {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease out quad
              const easeOut = 1 - (1 - progress) * (1 - progress);
              const current = Math.floor(easeOut * value);
              setCount(current);

              if (progress < 1) {
                requestAnimationFrame(tick);
              } else {
                setCount(value);
              }
            };

            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  const countStr = String(count).padStart(2, "0");

  return (
    <span ref={containerRef} className={`${styles.counterWrapper} ${className}`}>
      <span className={styles.counterNum}>{countStr}</span>
      {suffix && <span className={styles.counterSuffix}>{suffix}</span>}
    </span>
  );
}

/**
 * 6. WaveRippleHeading:
 * Interactive letter-by-letter undulating wave on mouse proximity/hover.
 */
export function WaveRippleHeading({
  text,
  className = "",
  periodChar = ".",
  periodColor = "red",
}: {
  text: string;
  className?: string;
  periodChar?: string;
  periodColor?: "red" | "indigo";
}) {
  const words = text.trim().split(/\s+/);
  let characterIndex = 0;

  return (
    <span className={`${styles.waveRippleWrapper} ${className}`} aria-label={text}>
      {words.map((word, wordIndex) => (
        <span key={`${word}-${wordIndex}`} className={styles.waveRippleWord} aria-hidden="true">
          {Array.from(word).map((ch) => (
            <span
              key={`${ch}-${characterIndex}`}
              className={styles.waveRippleChar}
              style={{ "--wave-i": characterIndex++ } as React.CSSProperties}
            >
              {ch}
            </span>
          ))}
          {periodChar && wordIndex === words.length - 1 && (
            <span className={periodColor === "red" ? styles.periodRed : styles.periodIndigo}>
              {periodChar}
            </span>
          )}
        </span>
      ))}
    </span>
  );
}

/**
 * 7. HoverScrambleTitle:
 * Applied to Bento cards and domain titles: on card/link hover, descrambles rapidly
 * into crisp text with an electric aura.
 */
export function HoverScrambleTitle({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const triggerScramble = () => {
    if (isScrambling) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setIsScrambling(true);
    let iter = 0;
    const total = 12;

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDisplayText(() => {
        return text
          .split("")
          .map((c, i) => {
            if (c === " " || c === "-") return c;
            if (i < (iter / total) * text.length) {
              return text[i];
            }
            return CIPHER_GLYPHS[Math.floor(Math.random() * CIPHER_GLYPHS.length)];
          })
          .join("");
      });

      iter++;
      if (iter >= total) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, 24);
  };

  useEffect(() => {
    setDisplayText(text);
    return () => {
      const activeInterval = intervalRef.current;
      if (activeInterval) clearInterval(activeInterval);
    };
  }, [text]);

  return (
    <span
      className={`${styles.hoverScrambleText} ${isScrambling ? styles.hoverScrambling : ""} ${className}`}
      onMouseEnter={triggerScramble}
      aria-label={text}
    >
      {displayText}
    </span>
  );
}

/**
 * 8. HoloWireframeNumber:
 * 3D floating wireframe number with electric gradient stroke and animated interior light.
 */
export function HoloWireframeNumber({
  number,
  className = "",
}: {
  number: string;
  className?: string;
}) {
  return (
    <div className={`${styles.holoWireframeNum} ${className}`} aria-hidden="true">
      <span className={styles.wireframeBackdrop}>{number}</span>
      <span className={styles.wireframeFront}>{number}</span>
    </div>
  );
}

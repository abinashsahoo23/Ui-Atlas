"use client";

import React, { useRef, useCallback } from "react";
import Link from "next/link";
import styles from "./interactive-cards.module.css";

/**
 * 1. SpotlightCard:
 * Dynamic cursor-following radial spotlight glow across the card surface and borders.
 */
export function SpotlightCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--mouse-x", `${x}px`);
    el.style.setProperty("--mouse-y", `${y}px`);
    el.style.setProperty("--spotlight-opacity", "1");
  }, []);

  const handlePointerLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--spotlight-opacity", "0");
  }, []);

  return (
    <div
      ref={cardRef}
      className={`${styles.spotlightCard} ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className={styles.spotlightGlow} aria-hidden="true" />
      <div className={styles.spotlightContent}>{children}</div>
    </div>
  );
}

/**
 * 2. TiltCard:
 * 3D Gyroscopic tilt physics tracking pointer coordinates with specular glare reflection.
 */
export function TiltCard({
  children,
  className = "",
  containerClassName = "",
  maxTilt = 7,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  maxTilt?: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = cardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const tiltX = (y - 0.5) * -maxTilt;
      const tiltY = (x - 0.5) * maxTilt;

      el.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
      el.style.setProperty("--glare-x", `${(x * 100).toFixed(1)}%`);
      el.style.setProperty("--glare-y", `${(y * 100).toFixed(1)}%`);
      el.style.setProperty("--glare-opacity", "1");
    },
    [maxTilt]
  );

  const handlePointerLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    el.style.setProperty("--glare-opacity", "0");
  }, []);

  return (
    <div className={`${styles.tiltCardContainer} ${containerClassName}`}>
      <div
        ref={cardRef}
        className={`${styles.tiltCard} ${className}`}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <div className={styles.tiltGlare} aria-hidden="true" />
        <div className={styles.tiltContent}>{children}</div>
      </div>
    </div>
  );
}

/**
 * 3. BorderBeamCard:
 * High-voltage circulating laser beam running continuously along the card perimeter.
 */
export function BorderBeamCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`${styles.borderBeamCard} ${className}`}>
      <div className={styles.borderBeamOverlay} aria-hidden="true" />
      <div className={styles.borderBeamContent}>{children}</div>
    </div>
  );
}

/**
 * 4. GlitchCard:
 * Cybernetic HUD card with scanlines and high-contrast corner reticles that activate on hover.
 */
export function GlitchCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`${styles.glitchCard} ${className}`}>
      <div className={styles.glitchScanlines} aria-hidden="true" />
      <div className={styles.glitchContent}>{children}</div>
    </div>
  );
}

/**
 * 5. PrismaticCard:
 * Diagonal iridescent rainbow sheen foil that reflects across the surface on hover.
 */
export function PrismaticCard({
  children,
  href,
  className = "",
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
}) {
  if (href) {
    return (
      <Link href={href} className={`${styles.prismaticCard} ${className}`}>
        {children}
      </Link>
    );
  }

  return <div className={`${styles.prismaticCard} ${className}`}>{children}</div>;
}

/**
 * 6. MagneticPillCard:
 * Subtle magnetic pull displacing compact taxonomy items toward the cursor center.
 */
export function MagneticPillCard({
  children,
  href,
  className = "",
  strength = 0.2,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
  strength?: number;
}) {
  const pillRef = useRef<HTMLAnchorElement>(null);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLAnchorElement>) => {
      const pill = pillRef.current;
      if (!pill) return;
      const rect = pill.getBoundingClientRect();
      const centerX = rect.left + rect.width * 0.5;
      const centerY = rect.top + rect.height * 0.5;
      const dx = (e.clientX - centerX) * strength;
      const dy = (e.clientY - centerY) * strength;
      pill.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
    },
    [strength]
  );

  const handlePointerLeave = useCallback(() => {
    const pill = pillRef.current;
    if (!pill) return;
    pill.style.transform = "translate3d(0, 0, 0)";
  }, []);

  return (
    <Link
      ref={pillRef}
      href={href}
      className={`${styles.magneticPillCard} ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </Link>
  );
}

"use client";

import React, { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./scroll-reveal.module.css";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
  as?: "div" | "section" | "article" | "li" | "header" | "nav";
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  threshold = 0,
  as: Component = "div",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: ScrollRevealProps) {
  // Keep server-rendered content visible until the browser can decide whether
  // it is below the fold. This prevents a blank page when hydration is delayed.
  const [isVisible, setIsVisible] = useState(true);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Check if IntersectionObserver is available
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const bounds = el.getBoundingClientRect();
    const isInViewport = bounds.top < window.innerHeight && bounds.bottom > 0;
    setIsVisible(isInViewport);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -32px 0px",
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  const style = delay > 0 ? { transitionDelay: `${delay}ms` } : undefined;

  return React.createElement(
    Component,
    {
      ref: elementRef,
      className: `${styles.reveal} ${isVisible ? styles.visible : styles.pending} ${className}`.trim(),
      style,
      "data-reveal-state": isVisible ? "visible" : "pending",
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
    },
    children
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { clientPreviewComponents } from "@/registry/client-previews";
import styles from "./home.module.css";

export function HomeLivePreview({ previewKey, title }: { previewKey: string; title: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(Boolean(entry?.isIntersecting));
      },
      { rootMargin: "150px" }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const Preview = clientPreviewComponents[previewKey];

  return (
    <div ref={containerRef} className={styles.livePreviewFrame}>
      {isVisible && Preview ? (
        <Preview />
      ) : (
        <div className={styles.previewStandby}>
          <div className={styles.standbyReticle} aria-hidden="true" />
          <span className={styles.standbyText}>STANDBY // {title.toUpperCase()}</span>
        </div>
      )}
    </div>
  );
}

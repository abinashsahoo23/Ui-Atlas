"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./library-category-sidebar.module.css";

export function LibrarySidebarViewportGuard({ children }: { children: ReactNode }) {
  const sidebarRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    const footer = document.querySelector("[data-site-footer]");

    if (!sidebar || !footer || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        sidebar.toggleAttribute("data-footer-visible", Boolean(entry?.isIntersecting));
      },
      { rootMargin: "0px 0px 16px 0px", threshold: 0 },
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <aside ref={sidebarRef} className={styles.sidebar} aria-label="Library navigation">
      {children}
    </aside>
  );
}

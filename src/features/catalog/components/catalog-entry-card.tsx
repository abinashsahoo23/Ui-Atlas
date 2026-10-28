"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Code2 } from "lucide-react";
import type { CatalogItem } from "@/features/catalog/types";
import { getCategory } from "@/features/catalog/lib/catalog";
import { clientPreviewComponents } from "@/registry/client-previews";
import { HoverScrambleTitle } from "@/app/kinetic-text-effects";
import { FavoriteButton } from "./favorite-button";
import styles from "./catalog-entry-card.module.css";

export function CatalogEntryCard({ item, index }: { item: CatalogItem; index?: number }) {
  const Preview = clientPreviewComponents[item.previewKey];
  const category = getCategory(item.category);
  const [isVisible, setIsVisible] = useState((index ?? 0) < 6);
  const cardRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isVisible || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <article ref={cardRef} className={styles.card}>
      <div className={styles.preview}>
        <div className={styles.previewInner} data-preview-density="compact">
          {isVisible && Preview ? (
            <Preview />
          ) : (
            <div
              className={styles.previewFallback}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                color: "var(--muted)",
                fontSize: "0.75rem",
                fontFamily: "var(--font-ui-mono)",
                background: "var(--surface-subtle)",
              }}
            >
              <span>SPECIMEN // {item.style}</span>
            </div>
          )}
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.eyebrowRow}>
          <span className={styles.categoryName}>{category?.title ?? item.category}</span>
          <span className={styles.styleBadge}>{item.style}</span>
        </div>
        <div className={styles.titleRow}>
          <h2>
            <Link href={"/item/" + item.slug}>
              <HoverScrambleTitle text={item.title} />
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </h2>
          <FavoriteButton entryId={item.id} title={item.title} />
        </div>
        <p className={styles.description}>{item.description}</p>
        <div className={styles.footerRow}>
          <ul className={styles.tags} aria-label="Tags">
            {item.tags.slice(0, 3).map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
          <Link href={"/item/" + item.slug} className={styles.codeQuickLink}>
            <Code2 size={13} aria-hidden="true" />
            <span>Code</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

"use client";

import Link from "next/link";
import { Bookmark, Trash2 } from "lucide-react";
import { useSavedEntries } from "@/features/collections/lib/use-saved-entries";
import type { CatalogItem } from "@/features/catalog/types";
import { getCategory } from "@/features/catalog/lib/catalog";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { HoverScrambleTitle, ShimmerText } from "@/app/kinetic-text-effects";
import styles from "./saved-collection.module.css";

export function SavedCollection({ entries }: { entries: readonly CatalogItem[] }) {
  const { savedIds, removeEntry } = useSavedEntries();

  const savedEntries = entries.filter((entry) => savedIds.includes(entry.id));

  if (savedEntries.length === 0) {
    return (
      <ScrollReveal as="section" className={styles.empty} aria-labelledby="collection-empty-title">
        <span className={styles.emptyMark} aria-hidden="true">00</span>
        <div>
          <h2 id="collection-empty-title"><HoverScrambleTitle text="Your collection is ready." /></h2>
          <p>
            <ShimmerText speed="slow" theme="silver">
              Save an example from the library and it will appear here on this device.
            </ShimmerText>
          </p>
          <Link href="/library">Find an idea <span aria-hidden="true">↗</span></Link>
        </div>
      </ScrollReveal>
    );
  }

  return (
    <div className={styles.list}>
      <p className={styles.count}>{savedEntries.length} SAVED {savedEntries.length === 1 ? "ENTRY" : "ENTRIES"}</p>
      {savedEntries.map((entry, index) => {
        const category = getCategory(entry.category);

        return (
          <ScrollReveal as="article" className={styles.row} key={entry.id} delay={(index % 6) * 45}>
            <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
            <div className={styles.description}>
              <span>{category?.title ?? entry.category} / {entry.style}</span>
              <h2><Link href={"/item/" + entry.slug}><HoverScrambleTitle text={entry.title} /></Link></h2>
              <p>{entry.description}</p>
            </div>
            <div className={styles.actions}>
              <Link className={styles.open} href={"/item/" + entry.slug} aria-label={"Open " + entry.title}>
                <Bookmark size={16} aria-hidden="true" />
              </Link>
              <button type="button" onClick={() => removeEntry(entry.id)} aria-label={"Remove " + entry.title + " from collection"}>
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </div>
          </ScrollReveal>
        );
      })}
    </div>
  );
}

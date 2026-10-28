"use client";

import { Bookmark } from "lucide-react";
import { useSavedEntry } from "@/features/collections/lib/use-saved-entries";
import styles from "./favorite-button.module.css";

export function FavoriteButton({ entryId, title }: { entryId: string; title: string }) {
  const { saved, toggle } = useSavedEntry(entryId);

  return (
    <button
      className={styles.button}
      type="button"
      aria-label={(saved ? "Remove " : "Save ") + title + (saved ? " from collection" : " to collection")}
      aria-pressed={saved}
      onClick={toggle}
    >
      <Bookmark size={16} aria-hidden="true" fill={saved ? "currentColor" : "none"} />
      <span>{saved ? "Saved" : "Save"}</span>
    </button>
  );
}

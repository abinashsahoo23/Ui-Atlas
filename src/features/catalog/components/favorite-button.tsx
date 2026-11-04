"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { trackAnalyticsEvent } from "@/features/analytics/lib/analytics";
import { requestCookieSettings } from "@/features/consent/lib/cookie-consent";
import { useSavedEntry } from "@/features/collections/lib/use-saved-entries";
import styles from "./favorite-button.module.css";

export function FavoriteButton({ entryId, title }: { entryId: string; title: string }) {
  const { saved, toggle } = useSavedEntry(entryId);
  const [storageUnavailable, setStorageUnavailable] = useState(false);

  function handleToggle() {
    const result = toggle();
    setStorageUnavailable(result.status === "unavailable");
    if (result.status === "saved") {
      trackAnalyticsEvent("collection_add", {
        component_id: entryId,
        component_name: title,
        source: "component_detail",
      });
    } else if (result.status === "removed") {
      trackAnalyticsEvent("collection_remove", {
        component_id: entryId,
        component_name: title,
        source: "component_detail",
      });
    }
    if (result.status === "needs-consent") {
      requestCookieSettings();
    }
  }

  return (
    <>
      <button
        className={styles.button}
        type="button"
        aria-label={(saved ? "Remove " : "Save ") + title + (saved ? " from collection" : " to collection")}
        aria-pressed={saved}
        onClick={handleToggle}
      >
        <Bookmark size={16} aria-hidden="true" fill={saved ? "currentColor" : "none"} />
        <span>{saved ? "Saved" : "Save"}</span>
      </button>
      {storageUnavailable && (
        <span className={styles.screenReaderOnly} role="status">
          This browser did not allow saving this example on this device.
        </span>
      )}
    </>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { trackAnalyticsEvent } from "@/features/analytics/lib/analytics";
import styles from "./sort-select.module.css";

export function SortSelect({ defaultValue = "default" }: { defaultValue?: string }) {
  const router = useRouter();

  return (
    <select
      id="library-sort"
      name="sort"
      defaultValue={defaultValue}
      className={styles.sortSelect}
      aria-label="Sort entries"
      onChange={(e) => {
        const form = e.currentTarget.form;
        const value = e.currentTarget.value;
        trackAnalyticsEvent("filter_select", {
          filter_name: "sort",
          filter_value: value,
          filter_surface: window.location.pathname,
        });

        if (!form) return;
        const destination = new URL(form.action, window.location.origin);
        const parameters = new URLSearchParams();
        new FormData(form).forEach((formValue, key) => {
          if (typeof formValue === "string") parameters.append(key, formValue);
        });
        parameters.set("sort", value);
        router.push(`${destination.pathname}?${parameters.toString()}`);
      }}
    >
      <option value="default">Default order</option>
      <option value="alpha-asc">Alphabetical (A–Z)</option>
      <option value="alpha-desc">Alphabetical (Z–A)</option>
    </select>
  );
}

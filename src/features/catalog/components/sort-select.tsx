"use client";

import styles from "./sort-select.module.css";

export function SortSelect({ defaultValue = "default" }: { defaultValue?: string }) {
  return (
    <select
      id="library-sort"
      name="sort"
      defaultValue={defaultValue}
      className={styles.sortSelect}
      aria-label="Sort entries"
      onChange={(e) => {
        e.currentTarget.form?.submit();
      }}
    >
      <option value="default">Default order</option>
      <option value="alpha-asc">Alphabetical (A–Z)</option>
      <option value="alpha-desc">Alphabetical (Z–A)</option>
    </select>
  );
}

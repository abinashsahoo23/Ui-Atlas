"use client";

import { useEffect } from "react";

export function HomeSearchShortcut({ className }: { className: string }) {
  useEffect(() => {
    const focusHomeSearch = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() !== "k" ||
        (!event.ctrlKey && !event.metaKey) ||
        event.altKey ||
        event.shiftKey ||
        event.repeat
      ) {
        return;
      }

      const search = document.getElementById("home-search");
      if (!(search instanceof HTMLInputElement)) return;

      event.preventDefault();
      search.focus();
    };

    document.addEventListener("keydown", focusHomeSearch);
    return () => document.removeEventListener("keydown", focusHomeSearch);
  }, []);

  return (
    <kbd className={className} aria-label="Control or Command plus K">
      Ctrl K
    </kbd>
  );
}

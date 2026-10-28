const SAVED_ENTRY_IDS_KEY = "ui-atlas:saved-entry-ids:v1";
const savedEntryListeners = new Set<() => void>();

function getStoredValue(): string {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    return window.localStorage.getItem(SAVED_ENTRY_IDS_KEY) ?? "";
  } catch {
    return "";
  }
}

export function subscribeToSavedEntryIds(listener: () => void) {
  savedEntryListeners.add(listener);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", listener);
  }

  return () => {
    savedEntryListeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", listener);
    }
  };
}

export function getSavedEntryIdsSnapshot() {
  return getStoredValue();
}

export function getSavedEntryIdsServerSnapshot() {
  return "";
}

/** Read saved IDs from browser storage. Call this only from client-side code. */
export function readSavedEntryIds(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedValue = getStoredValue();
    if (!storedValue) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(storedValue);
    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter(
      (value): value is string => typeof value === "string" && value.length > 0,
    );
  } catch {
    return [];
  }
}

/** Persist IDs from a client event or effect; this adapter has no React state. */
export function writeSavedEntryIds(ids: readonly string[]): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      SAVED_ENTRY_IDS_KEY,
      JSON.stringify([...new Set(ids)]),
    );
    for (const listener of savedEntryListeners) {
      listener();
    }
  } catch {
    // Storage can be unavailable in private browsing or restricted contexts.
  }
}

/** Safely add an ID to stored entries. */
export function addSavedEntryId(id: string): void {
  const current = readSavedEntryIds();
  if (!current.includes(id)) {
    writeSavedEntryIds([...current, id]);
  }
}

/** Safely remove an ID from stored entries. */
export function removeSavedEntryId(id: string): void {
  const current = readSavedEntryIds();
  writeSavedEntryIds(current.filter((item) => item !== id));
}

/** Safely toggle an ID in stored entries; returns whether it is now saved. */
export function toggleSavedEntryId(id: string): boolean {
  const current = readSavedEntryIds();
  const exists = current.includes(id);
  if (exists) {
    writeSavedEntryIds(current.filter((item) => item !== id));
    return false;
  } else {
    writeSavedEntryIds([...current, id]);
    return true;
  }
}

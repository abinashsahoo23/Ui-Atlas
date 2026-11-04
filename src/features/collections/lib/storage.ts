import {
  hasCookieConsent,
  subscribeToCookieConsentChanges,
} from "@/features/consent/lib/cookie-consent";

const SAVED_ENTRY_IDS_KEY = "ui-atlas:saved-entry-ids:v1";
const savedEntryListeners = new Set<() => void>();

function notifySavedEntryListeners() {
  for (const listener of savedEntryListeners) listener();
}

function handleConsentChange() {
  if (!hasCookieConsent("functional") && typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(SAVED_ENTRY_IDS_KEY);
    } catch {
      // Browser storage can be disabled independently of cookies.
    }
  }
  notifySavedEntryListeners();
}

const unsubscribeFromConsent = subscribeToCookieConsentChanges(handleConsentChange);
void unsubscribeFromConsent;

function getStoredValue(): string {
  if (typeof window === "undefined" || !hasCookieConsent("functional")) {
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

/** Read saved IDs from browser storage only after functional consent. */
export function readSavedEntryIds(): string[] {
  if (typeof window === "undefined" || !hasCookieConsent("functional")) {
    return [];
  }

  try {
    const storedValue = getStoredValue();
    if (!storedValue) return [];

    const parsedValue: unknown = JSON.parse(storedValue);
    if (!Array.isArray(parsedValue)) return [];

    return parsedValue.filter(
      (value): value is string => typeof value === "string" && value.length > 0,
    );
  } catch {
    return [];
  }
}

/** Persist IDs only after functional consent has been granted. */
export function writeSavedEntryIds(ids: readonly string[]): boolean {
  if (typeof window === "undefined" || !hasCookieConsent("functional")) {
    return false;
  }

  try {
    window.localStorage.setItem(
      SAVED_ENTRY_IDS_KEY,
      JSON.stringify([...new Set(ids)]),
    );
    notifySavedEntryListeners();
    return true;
  } catch {
    return false;
  }
}

export function addSavedEntryId(id: string): boolean {
  if (!hasCookieConsent("functional")) return false;
  const current = readSavedEntryIds();
  if (!current.includes(id)) {
    return writeSavedEntryIds([...current, id]);
  }
  return true;
}

export function removeSavedEntryId(id: string): boolean {
  if (!hasCookieConsent("functional")) return false;
  const current = readSavedEntryIds();
  if (!current.includes(id)) return false;
  return writeSavedEntryIds(current.filter((item) => item !== id));
}

export type SavedEntryToggleResult =
  | { status: "saved"; saved: true }
  | { status: "removed"; saved: false }
  | { status: "needs-consent"; saved: false }
  | { status: "unavailable"; saved: false };

/** Toggle a saved ID only when optional functional storage is permitted. */
export function toggleSavedEntryId(id: string): SavedEntryToggleResult {
  if (!hasCookieConsent("functional")) {
    return { status: "needs-consent", saved: false };
  }

  const current = readSavedEntryIds();
  const exists = current.includes(id);
  const didWrite = exists
    ? writeSavedEntryIds(current.filter((item) => item !== id))
    : writeSavedEntryIds([...current, id]);

  if (!didWrite) return { status: "unavailable", saved: false };
  return exists
    ? { status: "removed", saved: false }
    : { status: "saved", saved: true };
}

"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  addSavedEntryId,
  getSavedEntryIdsServerSnapshot,
  getSavedEntryIdsSnapshot,
  removeSavedEntryId,
  subscribeToSavedEntryIds,
  toggleSavedEntryId,
} from "./storage";

export function useSavedEntryIds(): readonly string[] {
  const storedValue = useSyncExternalStore(
    subscribeToSavedEntryIds,
    getSavedEntryIdsSnapshot,
    getSavedEntryIdsServerSnapshot,
  );

  return useMemo(() => {
    if (!storedValue) return [];
    try {
      const parsedValue: unknown = JSON.parse(storedValue);
      return Array.isArray(parsedValue)
        ? parsedValue.filter((value): value is string => typeof value === "string" && value.length > 0)
        : [];
    } catch {
      return [];
    }
  }, [storedValue]);
}

export function useSavedEntries() {
  const savedIds = useSavedEntryIds();

  const isSaved = useCallback((id: string) => savedIds.includes(id), [savedIds]);

  const toggleSave = useCallback((id: string) => {
    toggleSavedEntryId(id);
  }, []);

  const saveEntry = useCallback((id: string) => {
    addSavedEntryId(id);
  }, []);

  const removeEntry = useCallback((id: string) => {
    removeSavedEntryId(id);
  }, []);

  return {
    savedIds,
    isSaved,
    toggleSave,
    saveEntry,
    removeEntry,
  };
}

export function useSavedEntry(entryId: string) {
  const { isSaved, toggleSave } = useSavedEntries();
  const saved = isSaved(entryId);
  const toggle = useCallback(() => toggleSave(entryId), [toggleSave, entryId]);

  return { saved, toggle };
}

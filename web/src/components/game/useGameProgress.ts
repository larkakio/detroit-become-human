"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "convergence-field-progress-v1";

export interface GameProgress {
  level1Complete: boolean;
}

/** Stable references — useSyncExternalStore requires getSnapshot to be referentially stable when data is unchanged. */
const SNAPSHOT_FALSE: GameProgress = Object.freeze({ level1Complete: false });
const SNAPSHOT_TRUE: GameProgress = Object.freeze({ level1Complete: true });

let listeners: Array<() => void> = [];

function emit() {
  for (const l of listeners) l();
}

function readProgress(): GameProgress {
  if (typeof window === "undefined") return SNAPSHOT_FALSE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SNAPSHOT_FALSE;
    const p = JSON.parse(raw) as GameProgress;
    return p.level1Complete ? SNAPSHOT_TRUE : SNAPSHOT_FALSE;
  } catch {
    return SNAPSHOT_FALSE;
  }
}

function subscribe(onStoreChange: () => void) {
  listeners = [...listeners, onStoreChange];
  return () => {
    listeners = listeners.filter((l) => l !== onStoreChange);
  };
}

export function useGameProgress() {
  const progress = useSyncExternalStore(
    subscribe,
    readProgress,
    () => SNAPSHOT_FALSE,
  );

  const setLevel1Complete = useCallback((done: boolean) => {
    const next: GameProgress = { level1Complete: done };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    emit();
  }, []);

  return {
    ready: true,
    level1Complete: progress.level1Complete,
    level2Unlocked: progress.level1Complete,
    setLevel1Complete,
  };
}

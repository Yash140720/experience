import { useState, useCallback } from 'react';

const STORAGE_KEY = 'anniversary_progress';
const TOTAL_CHAPTERS = 7;

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveToStorage(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage unavailable — silently continue
  }
}

function getInitialState() {
  const saved = loadFromStorage();
  if (saved && Array.isArray(saved.unlocked) && Array.isArray(saved.completed)) {
    return saved;
  }
  return {
    unlocked: [1],   // chapter 1 is always available from the start
    completed: [],
  };
}

/**
 * Manages chapter unlock and completion state.
 * Persists to localStorage on every change.
 *
 * Does NOT manage animation state, reveal state, or navigation.
 * Those belong to the components that need them.
 */
export function useUnlockProgress() {
  const [progress, setProgress] = useState(getInitialState);

  const updateProgress = useCallback((next) => {
    setProgress(next);
    saveToStorage(next);
  }, []);

  const isUnlocked = useCallback(
    (id) => progress.unlocked.includes(id),
    [progress.unlocked]
  );

  const isCompleted = useCallback(
    (id) => progress.completed.includes(id),
    [progress.completed]
  );

  /**
   * Mark a chapter as completed and unlock the next one.
   * If all chapters are done, the "final" screen becomes accessible
   * via the allCompleted flag.
   */
  const completeChapter = useCallback(
    (id) => {
      setProgress((prev) => {
        if (prev.completed.includes(id)) return prev; // already done — no-op

        const nextCompleted = [...prev.completed, id];
        const nextUnlocked =
          id < TOTAL_CHAPTERS && !prev.unlocked.includes(id + 1)
            ? [...prev.unlocked, id + 1]
            : prev.unlocked;

        const next = { unlocked: nextUnlocked, completed: nextCompleted };
        saveToStorage(next);
        return next;
      });
    },
    []
  );

  /** Wipes all progress — for dev/debug use only. */
  const resetProgress = useCallback(() => {
    const initial = { unlocked: [1], completed: [] };
    updateProgress(initial);
  }, [updateProgress]);

  const allCompleted = progress.completed.length === TOTAL_CHAPTERS;

  return {
    isUnlocked,
    isCompleted,
    completeChapter,
    resetProgress,
    allCompleted,
    /** Raw progress shape — prefer the helper functions above. */
    progress,
  };
}

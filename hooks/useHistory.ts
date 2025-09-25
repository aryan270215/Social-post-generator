import { useState, useCallback } from 'react';

// Custom hook to manage state history for undo/redo functionality.
export const useHistory = <T>(initialState: T) => {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const state = history[currentIndex];
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  // Sets a new state, clearing any "redo" history.
  const setState = useCallback((updater: (prevState: T) => T) => {
    const nextState = updater(history[currentIndex]);

    // Avoid adding duplicate states to history
    if (JSON.stringify(nextState) === JSON.stringify(history[currentIndex])) {
      return;
    }

    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(nextState);

    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  }, [history, currentIndex]);

  // Moves the current state index back one step.
  const undo = useCallback(() => {
    if (canUndo) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [canUndo, currentIndex]);

  // Moves the current state index forward one step.
  const redo = useCallback(() => {
    if (canRedo) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [canRedo, currentIndex]);

  // Resets the history to a new state. Used for restoring a session.
  const reset = useCallback((newState: T) => {
    setHistory([newState]);
    setCurrentIndex(0);
  }, []);

  return {
    state,
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
  };
};
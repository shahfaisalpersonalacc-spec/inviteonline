"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Runs a timed opening animation: steps = [[phase, atMs], ...], then calls onDone.
// Respects prefers-reduced-motion by finishing immediately.
export default function useOpenSequence(steps, totalMs, { onStart, onDone } = {}) {
  const [phase, setPhase] = useState(0);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const open = useCallback(() => {
    if (phase !== 0) return;
    onStart?.();
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhase(steps[steps.length - 1][0]);
      onDone?.();
      return;
    }
    setPhase(1);
    for (const [p, at] of steps) timers.current.push(setTimeout(() => setPhase(p), at));
    timers.current.push(setTimeout(() => onDone?.(), totalMs));
  }, [phase, steps, totalMs, onStart, onDone]);

  const reset = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPhase(0);
  }, []);

  return { phase, open, reset };
}

"use client";
import { useSyncExternalStore } from "react";

// One-shot flag flipped by the preloader so entrance choreography starts as the curtain lifts.
let done = false;
const subs = new Set<() => void>();

export function markIntroDone() {
  if (done) return;
  done = true;
  subs.forEach((f) => f());
}

export function useIntroDone() {
  return useSyncExternalStore(
    (cb) => { subs.add(cb); return () => { subs.delete(cb); }; },
    () => done,
    () => false,
  );
}

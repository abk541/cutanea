"use client";
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

const fine = () => matchMedia("(pointer: fine)").matches;

// Pushes its content away from the cursor once it comes within `radius` px.
export function CursorFloat({ children, className = "", radius = 280, strength = 70 }: {
  children: React.ReactNode; className?: string; radius?: number; strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0), my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 70, damping: 12 }), y = useSpring(my, { stiffness: 70, damping: 12 });
  useEffect(() => {
    if (reduce || !fine()) return;
    const onMove = (e: PointerEvent) => {
      const b = ref.current!.getBoundingClientRect();
      const dx = b.left + b.width / 2 - e.clientX, dy = b.top + b.height / 2 - e.clientY;
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.max(0, 1 - d / radius) ** 1.5;
      mx.set((dx / d) * k * strength);
      my.set((dy / d) * k * strength);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, radius, strength, mx, my]);
  return <motion.div ref={ref} style={{ x, y }} className={className}>{children}</motion.div>;
}

// Soft light that trails the cursor across its parent section.
export function CursorGlow({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0), my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 40, damping: 16 }), y = useSpring(my, { stiffness: 40, damping: 16 });
  useEffect(() => {
    const host = ref.current?.closest("section");
    if (reduce || !host || !fine()) return;
    const onMove = (e: PointerEvent) => {
      const b = host.getBoundingClientRect();
      mx.set(e.clientX - b.left - b.width / 2);
      my.set(e.clientY - b.top - b.height / 2);
    };
    const onLeave = () => { mx.set(0); my.set(0); };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => { host.removeEventListener("pointermove", onMove); host.removeEventListener("pointerleave", onLeave); };
  }, [reduce, mx, my]);
  return <motion.div ref={ref} aria-hidden style={{ x, y }} className={className} />;
}

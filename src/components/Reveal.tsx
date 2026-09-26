"use client";
import { motion, useReducedMotion, type Variants } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({ children, className = "", stagger = 0.08, delay = 0, as = "div" }: {
  children: React.ReactNode; className?: string; stagger?: number; delay?: number; as?: "div" | "ul";
}) {
  const M = as === "ul" ? motion.ul : motion.div;
  return (
    <M className={className} initial="hidden" whileInView="show" viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}>
      {children}
    </M>
  );
}

export function RevealItem({ children, className = "", as = "div", spotlight }: { children: React.ReactNode; className?: string; as?: "div" | "li"; spotlight?: boolean }) {
  const reduce = useReducedMotion();
  const variants: Variants = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.4 } } }
    : { hidden: { opacity: 0, y: 32, scale: 0.97 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.9, ease } } };
  const M = as === "li" ? motion.li : motion.div;
  return <M className={className} variants={variants} data-spotlight={spotlight || undefined}>{children}</M>;
}

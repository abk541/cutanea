"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion } from "framer-motion";
import { markIntroDone } from "@/lib/intro";
import { lockScroll } from "@/lib/lenis";

const ease = [0.76, 0, 0.24, 1] as const;
const WORD = "CUTANÉA".split("");

// Curtain intro: letters rise, a counter runs, then the panel lifts with a bowed edge.
export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const count = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const quick = window.matchMedia("(prefers-reduced-motion: reduce)").matches || sessionStorage.getItem("cutanea-intro") === "1";
    lockScroll(true);
    window.scrollTo(0, 0);
    const finish = () => {
      sessionStorage.setItem("cutanea-intro", "1");
      lockScroll(false);
      setVisible(false);
      markIntroDone();
    };
    if (quick) {
      const t = window.setTimeout(finish, 250);
      return () => window.clearTimeout(t);
    }
    const run = animate(0, 100, {
      duration: 1.9, ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => {
        if (count.current) count.current.textContent = String(Math.round(v)).padStart(3, "0");
        if (bar.current) bar.current.style.transform = `scaleX(${v / 100})`;
      },
    });
    let t = 0;
    Promise.all([run.then(() => undefined), document.fonts?.ready]).then(() => { t = window.setTimeout(finish, 180); });
    return () => { run.stop(); window.clearTimeout(t); };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div key="pre" aria-hidden className="fixed inset-0 z-[90] text-ink"
          exit={{ y: "-100%" }} transition={{ duration: 1.1, ease }}>
          <div className="absolute inset-0 bg-cream" />
          {/* bowed lower edge that flattens as the curtain rises */}
          <svg className="absolute left-0 top-full h-[18vh] w-full" viewBox="0 0 100 20" preserveAspectRatio="none">
            <motion.path fill="#FAF6F1" initial={{ d: "M0 0 Q50 0 100 0 L100 0 L0 0Z" }}
              exit={{ d: "M0 0 Q50 20 100 0 L100 0 L0 0Z" }} transition={{ duration: 1.1, ease }} />
          </svg>
          <div className="relative flex h-full flex-col items-center justify-center">
            <p className="flex overflow-hidden font-serif text-[clamp(2.6rem,11vw,7rem)] font-light tracking-[0.14em]">
              {WORD.map((c, i) => (
                <motion.span key={i} className="inline-block" initial={{ y: "110%" }} animate={{ y: "0%" }}
                  transition={{ duration: 0.9, ease, delay: 0.1 + i * 0.06 }}>{c}</motion.span>
              ))}
            </p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.6 }}
              className="mt-4 text-[11px] uppercase tracking-[0.34em] text-mute">Dermatological care</motion.p>
          </div>
          <div className="pad-safe-x absolute inset-x-0 flex items-end justify-between gap-6 font-serif"
            style={{ bottom: "max(1.5rem, env(safe-area-inset-bottom))" }}>
            <span className="relative mb-3 block h-px flex-1 bg-ink/15">
              <span ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-ink" />
            </span>
            <span ref={count} className="text-5xl font-light tabular-nums md:text-7xl">000</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

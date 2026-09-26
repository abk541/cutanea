"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function MobileCTA() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const ids = ["hero", "produits", "contact"] as const;
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const visible = new Set<string>(["hero"]);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id)));
      setShow(visible.size === 0);
    }, { threshold: 0.15 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.a href="#produits" initial={{ y: 90, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="tap fixed left-1/2 z-40 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-7 py-4 text-sm text-cream shadow-[0_10px_40px_-10px_rgba(42,35,32,.6)] lg:hidden"
          style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}>
          Découvrir nos produits
        </motion.a>
      )}
    </AnimatePresence>
  );
}

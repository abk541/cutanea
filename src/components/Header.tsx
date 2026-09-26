"use client";
import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import Logo from "./Logo";
import { INSTAGRAM_URL } from "@/lib/products";
import { useIntroDone } from "@/lib/intro";

const links = [["Histoire", "#histoire"], ["Produits", "#produits"], ["Actifs", "#actifs"], ["Contact", "#contact"]] as const;

export default function Header() {
  const { scrollY } = useScroll();
  const play = useIntroDone();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const delta = y - (scrollY.getPrevious() ?? 0);
    setSolid(y > window.innerHeight * 0.6);
    if (Math.abs(delta) > 2) setHidden(delta > 0 && y > window.innerHeight * 0.9);
  });

  return (
    <motion.header animate={{ y: hidden ? "-110%" : "0%" }} transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      className="fixed inset-x-0 top-0 z-40 isolate">
      {/* colour is scrubbed with the page by BackgroundShift */}
      <div aria-hidden data-page-bg
        className={`absolute inset-0 -z-10 border-b border-ink/5 bg-cream transition-opacity duration-500 ${solid ? "opacity-95" : "opacity-0"}`} />
      <motion.div initial={{ opacity: 0, y: -12 }} animate={play ? { opacity: 1, y: 0 } : undefined} transition={{ delay: 0.9, duration: 0.8 }}
        className="pad-safe-x flex items-center justify-between py-3 pt-[max(0.75rem,env(safe-area-inset-top))] md:py-4">
        <a href="#hero" aria-label="Cutanéa, retour en haut" tabIndex={solid ? 0 : -1}
          className={`transition-opacity duration-500 ${solid ? "opacity-100" : "pointer-events-none opacity-0"}`}>
          <Logo size="sm" />
        </a>
        <nav aria-label="Sections" className="hidden gap-8 text-sm md:flex">
          {links.map(([l, h]) => (
            <a key={h} href={h} className="relative after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-ink after:transition-transform after:duration-500 hover:after:origin-left hover:after:scale-x-100">{l}</a>
          ))}
        </nav>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="tap flex min-h-11 items-center text-sm">
          @cutanea_laboratoire
        </a>
      </motion.div>
    </motion.header>
  );
}

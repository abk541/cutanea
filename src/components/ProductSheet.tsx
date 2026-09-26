"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { INSTAGRAM_DM_URL, whatsappLink, type Product } from "@/lib/products";
import { lockScroll } from "@/lib/lenis";
import { WhatsAppIcon } from "./icons";
import ProductVisual from "./ProductVisual";

const ease = [0.22, 1, 0.36, 1] as const;

export default function ProductSheet({ product, returnFocus, onClose }: {
  product: Product | null; returnFocus: HTMLElement | null; onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Modal state is released when closing starts (not after the exit animation), so focus can go back.
  useEffect(() => {
    if (!product) return;
    const outside = Array.from(document.body.children).filter((n) => !n.hasAttribute("data-sheet"));
    outside.forEach((n) => n.setAttribute("inert", ""));
    lockScroll(true);
    return () => {
      outside.forEach((n) => n.removeAttribute("inert"));
      lockScroll(false);
      returnFocus?.focus({ preventScroll: true });
    };
  }, [product, returnFocus]);

  if (!mounted) return null;
  return createPortal(
    <div data-sheet>
      <AnimatePresence>{product && <Sheet key={product.id} p={product} desktop={desktop} onClose={onClose} />}</AnimatePresence>
    </div>,
    document.body,
  );
}

function Sheet({ p, desktop, onClose }: { p: Product; desktop: boolean; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const drag = useDragControls();

  useEffect(() => {
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const order = whatsappLink(`Bonjour Cutanéa, je souhaite commander : ${p.name} (${p.line}, ${p.volume}) à ${p.price} DH.`);
  const slide = desktop ? { x: "100%" } : { y: "100%" };

  return (
    <>
      <motion.div aria-hidden onClick={onClose} className="fixed inset-0 z-50 bg-ink/35 backdrop-blur-[2px]"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} />
      <motion.div ref={panel} role="dialog" aria-modal="true" aria-labelledby="sheet-title"
        initial={{ ...slide, opacity: 0 }} animate={{ x: 0, y: 0, opacity: 1 }} exit={{ ...slide, opacity: 0 }}
        transition={{ duration: 0.6, ease, opacity: { duration: 0.25 } }}
        drag={desktop ? false : "y"} dragListener={false} dragControls={drag}
        dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.7 }}
        onDragEnd={(_, info) => { if (info.offset.y > 110 || info.velocity.y > 600) onClose(); }}
        className={`fixed z-50 flex flex-col bg-cream shadow-[0_-30px_80px_-30px_rgba(42,35,32,.45)] ${desktop
          ? "inset-y-0 right-0 w-[min(560px,46vw)]"
          : "inset-x-0 bottom-0 max-h-[92svh] rounded-t-[2rem]"}`}>

        {!desktop && (
          <div onPointerDown={(e) => drag.start(e)} className="flex h-9 shrink-0 cursor-grab touch-none items-center justify-center">
            <span aria-hidden className="h-1 w-11 rounded-full bg-ink/20" />
          </div>
        )}
        <button ref={closeBtn} type="button" onClick={onClose} aria-label="Fermer"
          className="tap absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/85 text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
          <svg viewBox="0 0 16 16" aria-hidden className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" /></svg>
        </button>

        <div data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain">
          <div className={`relative mx-3 overflow-hidden rounded-[1.6rem] ${desktop ? "mt-3 h-[46vh]" : "h-[36svh]"}`} style={{ backgroundColor: p.tint }}>
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(110%_75%_at_50%_15%,rgba(255,255,255,.95),transparent_62%)]" />
            <motion.div className="absolute inset-0 mix-blend-multiply"
              initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease, delay: 0.15 }}>
              <div className="absolute inset-x-[10%] bottom-[5%] top-[8%]">
                <ProductVisual p={p} sizes={desktop ? "540px" : "100vw"} />
              </div>
            </motion.div>
          </div>

          <div className="px-6 pb-6 pt-6 md:px-8">
            <p className="text-sm text-mute">{p.line}, {p.volume}</p>
            <div className="mt-1 flex items-baseline justify-between gap-4">
              <h2 id="sheet-title" className="soft font-serif text-[2rem] font-light leading-tight">{p.name}</h2>
              <p className="shrink-0 font-serif text-2xl">{p.price} DH</p>
            </div>
            <p className="mt-3 leading-relaxed text-mute">{p.benefit}</p>

            <h3 className="mt-8 font-serif text-lg">Ce qu&apos;il fait pour votre peau</h3>
            <ul className="mt-3 space-y-3">
              {p.highlights.map((h, i) => (
                <motion.li key={h} className="flex gap-3 text-[0.95rem] leading-snug"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease, delay: 0.3 + i * 0.07 }}>
                  <svg viewBox="0 0 16 16" aria-hidden className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke={p.accent} strokeWidth="1.4" strokeLinecap="round">
                    <path d="M3 13C3 7 7 3 13 3c0 6-4 10-10 10zM3 13l5-5" />
                  </svg>
                  {h}
                </motion.li>
              ))}
            </ul>

            {p.actives && (
              <>
                <h3 className="mt-8 font-serif text-lg">Actifs clés</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {p.actives.map((a) => <li key={a} className="rounded-full border border-ink/15 bg-white/60 px-3.5 py-1.5 text-sm">{a}</li>)}
                </ul>
              </>
            )}
          </div>

          <div className="sticky bottom-0 flex flex-col gap-2.5 bg-linear-to-t from-cream from-70% to-transparent px-6 pt-8 md:px-8"
            style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}>
            <a href={order} target="_blank" rel="noopener noreferrer"
              className="tap btn-fill inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-sage-deep text-cream [--fill:var(--color-ink)]">
              <WhatsAppIcon /> Commander sur WhatsApp
            </a>
            <a href={INSTAGRAM_DM_URL} target="_blank" rel="noopener noreferrer"
              className="tap inline-flex min-h-12 items-center justify-center rounded-full text-sm underline decoration-ink/25 underline-offset-4 hover:decoration-ink">
              Poser une question sur Instagram
            </a>
          </div>
        </div>
      </motion.div>
    </>
  );
}

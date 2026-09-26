"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform, type Variants } from "framer-motion";
import { products, whatsappLink, type Product } from "@/lib/products";
import ProductSheet from "../ProductSheet";
import SplitText from "../SplitText";
import Magnetic from "../Magnetic";
import { WhatsAppIcon } from "../icons";

const ease = [0.22, 1, 0.36, 1] as const;
const AUTOPLAY = 6500;

const photo: Variants = {
  enter: (d: number) => ({ opacity: 0, x: `${d * 18}%`, y: 40, rotate: d * 6, scale: 0.9, clipPath: "inset(100% 0% 0% 0%)" }),
  center: { opacity: 1, x: "0%", y: 0, rotate: 0, scale: 1, clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.1, ease } },
  exit: (d: number) => ({ opacity: 0, x: `${d * -22}%`, y: -30, rotate: d * -5, scale: 0.94, transition: { duration: 0.7, ease: [0.64, 0, 0.78, 0] } }),
};
const detail: Variants = {
  enter: { opacity: 0, y: 18 },
  center: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.8, ease, delay: 0.15 + i * 0.06 } }),
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
};

export default function Products() {
  const [[index, dir], setState] = useState<[number, number]>([0, 1]);
  const [open, setOpen] = useState<{ p: Product; trigger: HTMLElement | null } | null>(null);
  const [hovering, setHovering] = useState(false);
  const section = useRef<HTMLElement>(null);
  const panned = useRef(false);
  const inView = useInView(section, { amount: 0.55 });
  const reduce = useReducedMotion();
  const p = products[index];

  const go = useCallback((next: number, d?: number) => {
    setState(([i]) => {
      const n = (next + products.length) % products.length;
      return n === i ? [i, 1] : [n, d ?? (n > i ? 1 : -1)];
    });
  }, []);
  const onClose = useCallback(() => setOpen(null), []);

  const playing = !reduce && inView && !hovering && !open;
  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => go(index + 1, 1), AUTOPLAY);
    return () => window.clearTimeout(t);
  }, [playing, index, go]);

  // cursor tilt + halo counter-motion
  const mx = useMotionValue(0), my = useMotionValue(0), drag = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 90, damping: 16 }), sy = useSpring(my, { stiffness: 90, damping: 16 });
  const sdrag = useSpring(drag, { stiffness: 260, damping: 26 });
  const rotY = useTransform(sx, [-0.5, 0.5], [-14, 14]);
  const rotX = useTransform(sy, [-0.5, 0.5], [10, -10]);
  const tx = useTransform([sx, sdrag], ([a, b]: number[]) => a * 30 + b);
  const haloX = useTransform(sx, (v) => v * -80);
  const haloY = useTransform(sy, (v) => v * -60);
  const onStageMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || reduce) return;
    const b = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - b.left) / b.width - 0.5);
    my.set((e.clientY - b.top) / b.height - 0.5);
  };
  const resetTilt = () => { mx.set(0); my.set(0); };

  const onKeyTabs = (e: React.KeyboardEvent) => {
    const k = e.key;
    if (k !== "ArrowRight" && k !== "ArrowDown" && k !== "ArrowLeft" && k !== "ArrowUp") return;
    e.preventDefault();
    const n = (index + (k === "ArrowRight" || k === "ArrowDown" ? 1 : -1) + products.length) % products.length;
    go(n);
    (e.currentTarget.querySelectorAll<HTMLElement>("[role='tab']")[n])?.focus();
  };

  const openSheet = (e: React.MouseEvent<HTMLElement>) => {
    if (panned.current) { panned.current = false; return; }
    setOpen({ p, trigger: e.currentTarget });
  };

  return (
    <section id="produits" ref={section} data-bg="#F3EFEA" data-snap aria-roledescription="carrousel" aria-label="La gamme Cutanéa"
      className="relative isolate flex min-h-[100svh] flex-col overflow-clip pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-24 lg:grid lg:h-screen lg:min-h-[720px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)_minmax(0,1fr)] lg:items-center lg:gap-6 lg:px-[5vw] lg:py-0">

      {/* tint wash, cross-faded per product; soft edges blend into neighbouring sections */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 [mask-image:linear-gradient(to_bottom,transparent,#000_16%,#000_84%,transparent)]">
        {products.map((q, i) => (
          <div key={q.id} className={`absolute inset-0 transition-opacity duration-[1200ms] ${i === index ? "opacity-100" : "opacity-0"}`} style={{ backgroundColor: q.tint }} />
        ))}
      </div>

      {/* giant line name drifting behind the stage */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[34%] -z-10 overflow-hidden lg:top-[38%]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div key={p.id} initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -60 }} transition={{ duration: 0.9, ease }}
            className="flex w-max animate-[marquee_40s_linear_infinite] whitespace-nowrap font-serif text-[clamp(5rem,20vw,17rem)] font-light leading-none"
            style={{ ["--stroke" as string]: `${p.accent}66` }}>
            {Array.from({ length: 4 }, (_, k) => <span key={k} className="stroke-text soft pr-[0.4em]">{p.line}</span>)}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* left: heading + desktop list with cursor-follow preview */}
      <div className="pad-safe-x lg:self-stretch lg:px-0 lg:py-[14vh] lg:flex lg:flex-col lg:justify-between">
        <SplitText text={"L'essentiel,\nen cinq soins."} className="soft font-serif text-[clamp(2.2rem,5vw,4.2rem)] font-light leading-[1]" />
        <DesktopList index={index} go={go} onKey={onKeyTabs} />
      </div>

      {/* stage */}
      <motion.div data-cursor-label="Glisser" onPointerMove={onStageMove}
        onPointerEnter={(e) => e.pointerType === "mouse" && setHovering(true)}
        onPointerLeave={() => { resetTilt(); setHovering(false); }}
        onPanStart={() => { panned.current = true; }}
        onPan={(_, info) => drag.set(info.offset.x * 0.35)}
        onPanEnd={(_, info) => {
          drag.set(0);
          if (info.offset.x < -50 || info.velocity.x < -450) go(index + 1, 1);
          else if (info.offset.x > 50 || info.velocity.x > 450) go(index - 1, -1);
          window.setTimeout(() => { panned.current = false; }, 50);
        }}
        className="relative mx-auto mt-4 h-[42svh] w-full max-w-md touch-pan-y select-none lg:mt-0 lg:h-[78vh] lg:max-w-none">
        <motion.div aria-hidden style={{ x: haloX, y: haloY }} className="absolute inset-[-4%] -z-10">
          <AnimatePresence initial={false}>
            <motion.div key={p.id} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.25 }}
              transition={{ duration: 1.2, ease }} className="absolute inset-0 rounded-full"
              style={{ background: `radial-gradient(closest-side, #fff 0%, rgba(255,255,255,.95) 62%, ${p.accent}38 88%, ${p.accent}00 100%)` }} />
          </AnimatePresence>
        </motion.div>

        <motion.div className="absolute inset-0 mix-blend-multiply" style={{ x: tx, rotateY: rotY, rotateX: rotX, transformPerspective: 1000 }}>
          <AnimatePresence initial={false} custom={dir} mode="popLayout">
            <motion.button key={p.id} type="button" custom={dir} variants={photo} initial="enter" animate="center" exit="exit"
              onClick={openSheet} data-cursor-label="Voir" aria-haspopup="dialog" aria-label={`Voir le détail : ${p.name}`}
              className="absolute inset-x-[8%] bottom-[4%] top-[4%] rounded-[2rem] mix-blend-multiply outline-none focus-visible:ring-2 focus-visible:ring-ink/40">
              <Image src={p.image} alt={`${p.name} Cutanéa, ${p.volume}`} fill sizes="(min-width: 1024px) 40vw, 90vw" className="pointer-events-none object-contain" draggable={false} />
            </motion.button>
          </AnimatePresence>
        </motion.div>

        {/* light sweep on change */}
        <span key={`sweep-${p.id}`} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem] motion-reduce:hidden">
          <span className="absolute -inset-y-10 left-0 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/60 to-transparent opacity-0 animate-[sweep-x_1.3s_ease-out_.2s_1]" />
        </span>
      </motion.div>

      {/* right: details */}
      <div className="pad-safe-x relative mt-3 lg:mt-0 lg:px-0" aria-live={playing ? "off" : "polite"}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={p.id} initial="enter" animate="center" exit="exit" className="lg:max-w-sm">
            <motion.p custom={0} variants={detail} className="hidden text-sm text-mute lg:block">{p.line}, {p.volume}</motion.p>
            <div className="flex items-baseline justify-between gap-4 lg:block">
              <motion.h3 custom={1} variants={detail} className="soft font-serif text-[1.9rem] font-light leading-[1.05] lg:mt-2 lg:text-5xl">{p.name}</motion.h3>
              <motion.p custom={2} variants={detail} className="shrink-0 font-serif text-2xl lg:mt-5 lg:text-4xl">{p.price} DH</motion.p>
            </div>
            <motion.p custom={3} variants={detail} className="mt-2 max-w-[40ch] text-[0.95rem] leading-relaxed text-mute lg:mt-5">{p.benefit}</motion.p>
            <motion.ul custom={4} variants={detail} className="mt-6 hidden space-y-2.5 lg:block">
              {p.highlights.slice(0, 3).map((h) => (
                <li key={h} className="flex gap-3 text-sm"><span aria-hidden className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: p.accent }} />{h}</li>
              ))}
            </motion.ul>
            <motion.div custom={5} variants={detail} className="mt-5 flex flex-wrap items-center gap-3 lg:mt-8">
              <Magnetic>
                <button type="button" onClick={(e) => setOpen({ p, trigger: e.currentTarget })} aria-haspopup="dialog"
                  className="tap btn-fill inline-flex min-h-12 items-center rounded-full bg-ink px-6 text-sm text-cream">
                  Découvrir
                </button>
              </Magnetic>
              <a href={whatsappLink(`Bonjour Cutanéa, je souhaite commander : ${p.name} (${p.price} DH).`)} target="_blank" rel="noopener noreferrer"
                className="tap inline-flex min-h-12 items-center gap-2 rounded-full border border-ink/20 bg-white/50 px-5 text-sm hover:border-ink">
                <WhatsAppIcon className="h-4 w-4" /> Commander
              </a>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 hidden items-center gap-4 lg:flex">
          <ArrowBtn label="Produit précédent" onClick={() => go(index - 1, -1)} flip />
          <div className="relative h-px max-w-40 flex-1 bg-ink/15" aria-hidden>
            <span key={index} className="absolute inset-0 origin-left bg-ink animate-[grow_6.5s_linear_forwards]"
              style={{ animationPlayState: playing ? "running" : "paused" }} />
          </div>
          <ArrowBtn label="Produit suivant" onClick={() => go(index + 1, 1)} />
        </div>
        <MobileThumbs index={index} go={go} onKey={onKeyTabs} />
      </div>

      <ProductSheet product={open?.p ?? null} returnFocus={open?.trigger ?? null} onClose={onClose} />
    </section>
  );
}

function ArrowBtn({ label, onClick, flip }: { label: string; onClick: () => void; flip?: boolean }) {
  return (
    <Magnetic strength={0.5}>
      <button type="button" aria-label={label} onClick={onClick}
        className="tap btn-fill grid h-12 w-12 place-items-center rounded-full border border-ink/20 bg-white/40 [--fill:var(--color-ink)] hover:text-cream">
        <svg viewBox="0 0 16 16" className={`h-4 w-4 ${flip ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden><path d="M3 8h10M9 4l4 4-4 4" /></svg>
      </button>
    </Magnetic>
  );
}

function DesktopList({ index, go, onKey }: { index: number; go: (n: number) => void; onKey: (e: React.KeyboardEvent) => void }) {
  const [hover, setHover] = useState<number | null>(null);
  const px = useMotionValue(0), py = useMotionValue(0);
  const x = useSpring(px, { stiffness: 220, damping: 24 }), y = useSpring(py, { stiffness: 220, damping: 24 });
  const list = useRef<HTMLDivElement>(null);
  return (
    <div ref={list} role="tablist" aria-label="Produits" aria-orientation="vertical" onKeyDown={onKey}
      onPointerMove={(e) => { const b = list.current!.getBoundingClientRect(); px.set(e.clientX - b.left); py.set(e.clientY - b.top); }}
      onPointerLeave={() => setHover(null)}
      className="relative mt-10 hidden flex-col lg:flex">
      {products.map((q, i) => (
        <button key={q.id} role="tab" type="button" aria-selected={i === index} tabIndex={i === index ? 0 : -1}
          onClick={() => go(i)} onPointerEnter={() => setHover(i)}
          className={`group flex items-baseline justify-between gap-4 border-t border-ink/10 py-3.5 text-left transition-colors duration-500 last:border-b ${i === index ? "text-ink" : "text-ink/35 hover:text-ink/75"}`}>
          <span className="flex items-baseline gap-3">
            <span aria-hidden className={`h-1.5 w-1.5 rounded-full bg-current transition-transform duration-500 ${i === index ? "scale-100" : "scale-0"}`} />
            <span className="font-serif text-[1.35rem] leading-tight transition-transform duration-500 group-hover:translate-x-1.5">{q.name}</span>
          </span>
          <span className="whitespace-nowrap text-sm tabular-nums">{q.price} DH</span>
        </button>
      ))}
      {/* thumbnail trailing the cursor over the list */}
      <motion.div aria-hidden style={{ x, y }} className="pointer-events-none absolute left-0 top-0 z-10">
        <AnimatePresence>
          {hover !== null && hover !== index && (
            <motion.div key={hover} initial={{ opacity: 0, scale: 0.6, rotate: -8 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.4, ease }} className="absolute -top-28 left-10 h-44 w-32 overflow-hidden rounded-2xl shadow-[0_30px_60px_-25px_rgba(42,35,32,.5)]"
              style={{ backgroundColor: products[hover].tint }}>
              <div className="absolute inset-[8%] mix-blend-multiply"><Image src={products[hover].image} alt="" fill sizes="128px" className="object-contain" /></div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function MobileThumbs({ index, go, onKey }: { index: number; go: (n: number) => void; onKey: (e: React.KeyboardEvent) => void }) {
  return (
    <div role="tablist" aria-label="Produits" onKeyDown={onKey} className="mt-5 flex justify-between gap-2 lg:hidden">
      {products.map((q, i) => (
        <button key={q.id} role="tab" type="button" aria-selected={i === index} aria-label={q.name} tabIndex={i === index ? 0 : -1} onClick={() => go(i)}
          className={`tap relative isolate h-16 flex-1 overflow-hidden rounded-2xl border transition-[border-color,translate] duration-500 ${i === index ? "-translate-y-1 border-ink" : "border-ink/10"}`}
          style={{ backgroundColor: q.tint }}>
          <span className="absolute inset-[10%] mix-blend-multiply"><Image src={q.image} alt="" fill sizes="64px" loading="eager" className="object-contain" /></span>
        </button>
      ))}
    </div>
  );
}

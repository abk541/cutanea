"use client";
import { useRef } from "react";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { products } from "@/lib/products";

const WORDS = ["Nettoyer", "Hydrater", "Apaiser", "Protéger", "Révéler"];
const POOL = 8;
const wrap = (min: number, max: number, v: number) => { const r = max - min; return ((((v - min) % r) + r) % r) + min; };

function Leaf() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="mx-[0.35em] inline-block h-[0.42em] w-[0.42em] align-middle">
      <path d="M4 20C4 11 10 4 20 4c0 10-7 16-16 16zM4 20l7-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

// Kinetic band: speed and skew follow scroll velocity, direction flips with scroll direction.
function Row({ base, outline }: { base: number; outline?: boolean }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(vel, [-1200, 0, 1200], [-5, 0, 5], { clamp: false });
  const skew = useTransform(vel, [-2500, 2500], [10, -10]);
  const dirRef = useRef(1);
  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const f = factor.get();
    if (f < 0) dirRef.current = -1;
    else if (f > 0) dirRef.current = 1;
    let by = dirRef.current * base * (delta / 1000);
    by += dirRef.current * by * f;
    x.set(wrap(-50, 0, x.get() + by));
  });
  const tx = useTransform(x, (v) => `${v}%`);
  return (
    <motion.div style={{ x: tx, skewX: reduce ? 0 : skew }} className="flex w-max whitespace-nowrap will-change-transform">
      {[0, 1].map((k) => (
        <span key={k} aria-hidden={k === 1} className={`soft pr-[0.35em] font-serif text-[clamp(3.4rem,11vw,10rem)] font-light leading-[1.05] ${outline ? "stroke-text [--stroke:var(--color-terra)]" : ""}`}>
          {WORDS.map((w) => <span key={w}>{w}<Leaf /></span>)}
        </span>
      ))}
    </motion.div>
  );
}

export default function Marquee() {
  const reduce = useReducedMotion();
  const trail = useRef<HTMLDivElement>(null);
  const last = useRef({ x: -999, y: -999, i: 0 });

  // image trail: packshots pop along the cursor path
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse" || reduce || !trail.current) return;
    const b = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - b.left, y = e.clientY - b.top;
    const L = last.current;
    if (Math.hypot(x - L.x, y - L.y) < 95) return;
    L.x = x; L.y = y;
    const el = trail.current.children[L.i % POOL] as HTMLElement;
    const p = products[L.i % products.length];
    L.i++;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.backgroundColor = p.tint;
    (el.firstElementChild as HTMLImageElement).src = p.image;
    el.style.zIndex = String(L.i);
    const r = (Math.random() - 0.5) * 24;
    el.getAnimations().forEach((a) => a.cancel());
    el.animate([
      { opacity: 0, transform: `translate(-50%,-50%) scale(.3) rotate(${r}deg)` },
      { opacity: 1, transform: `translate(-50%,-50%) scale(1) rotate(${r / 3}deg)`, offset: 0.22 },
      { opacity: 1, transform: `translate(-50%,-50%) scale(1) rotate(${r / 3}deg)`, offset: 0.6 },
      { opacity: 0, transform: `translate(-50%,-20%) scale(.7) rotate(0deg)` },
    ], { duration: 1200, easing: "cubic-bezier(.2,.8,.2,1)", fill: "forwards" });
  };

  return (
    <section aria-label="Nettoyer, hydrater, apaiser, protéger, révéler" onPointerMove={onMove}
      className="relative overflow-clip py-14 md:py-24">
      <div className="-rotate-2 md:-rotate-[1.5deg]">
        <Row base={-4} />
        <Row base={3} outline />
      </div>
      <div ref={trail} aria-hidden className="pointer-events-none absolute inset-0 hidden [@media(pointer:fine)]:block">
        {Array.from({ length: POOL }, (_, i) => (
          <div key={i} className="absolute isolate h-52 w-40 overflow-hidden rounded-2xl opacity-0 shadow-[0_30px_60px_-30px_rgba(42,35,32,.55)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={products[i % products.length].image} alt="" loading="lazy" className="absolute inset-[8%] h-[84%] w-[84%] object-contain mix-blend-multiply" />
          </div>
        ))}
      </div>
    </section>
  );
}

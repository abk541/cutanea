"use client";
import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal, RevealItem } from "../Reveal";
import SplitText from "../SplitText";
import { CursorFloat } from "../CursorFx";

// SPF 50+ is printed on the pack; every other value is a placeholder to validate with the lab.
const stats = [
  { v: 50, suffix: "+", label: "SPF, très haute protection UVA/UVB de l'écran solaire" },
  { v: 100, suffix: "%", label: "des formules testées sous contrôle dermatologique", note: "[TO CONFIRM]" },
  { v: 92, suffix: "%", label: "d'ingrédients d'origine naturelle", note: "[TO CONFIRM]" },
  { v: 24, suffix: " h", label: "d'hydratation avec la crème Hydratation Optimale", note: "[TO CONFIRM]" },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) { setN(to); return; }
    const c = animate(0, to, { duration: 1.8, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, to, reduce]);
  return <span ref={ref}>{n}{suffix}</span>;
}

function Droplet({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 100 130" className={className} aria-hidden>
      <path d="M50 4C50 4 12 52 12 84a38 38 0 0 0 76 0C88 52 50 4 50 4z" fill="url(#drop-fill)" stroke="rgba(120,176,204,.45)" strokeWidth="1" />
      <ellipse cx="36" cy="80" rx="8" ry="15" fill="#fff" opacity=".85" transform="rotate(18 36 80)" />
      <circle cx="62" cy="104" r="4" fill="#fff" opacity=".5" />
    </svg>
  );
}

const layers = [
  { cls: "left-[5%] top-[5%] w-20 md:w-36", speed: -40, el: "drop" },
  { cls: "right-[-10%] top-[12%] w-64 opacity-80 md:right-[-2%] md:w-[30rem]", speed: 22, el: "cream" },
  { cls: "left-[36%] bottom-[6%] w-9 md:w-14", speed: -70, el: "drop" },
  { cls: "right-[24%] bottom-[16%] w-7 md:w-10", speed: 60, el: "drop" },
] as const;

export default function Ingredients() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) =>
        gsap.fromTo(el, { yPercent: -Number(el.dataset.speed) }, { yPercent: Number(el.dataset.speed), ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } }));
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="actifs" ref={ref} data-bg="#EEF1EC" data-snap className="pad-safe-x relative isolate overflow-clip py-28 md:py-44">
      <svg aria-hidden className="absolute h-0 w-0">
        <defs>
          <radialGradient id="drop-fill" cx="38%" cy="58%" r="70%">
            <stop offset="0" stopColor="#fff" stopOpacity=".95" />
            <stop offset=".55" stopColor="#CFE6F1" stopOpacity=".75" />
            <stop offset="1" stopColor="#8FC0DA" stopOpacity=".55" />
          </radialGradient>
          <linearGradient id="cream-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFFDFB" />
            <stop offset="1" stopColor="#EED9CE" />
          </linearGradient>
        </defs>
      </svg>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {layers.map((l, i) => (
          <div key={i} data-speed={l.speed} className={`absolute will-change-transform ${l.cls}`}>
            <CursorFloat strength={l.el === "cream" ? 40 : 90}>
            {l.el === "drop" ? <Droplet className="h-auto w-full drop-shadow-[0_18px_22px_rgba(80,120,140,.18)]" /> : (
              // cream swirl: a thick rounded stroke with a thin highlight riding on it
              <svg viewBox="0 0 220 160" className="h-auto w-full drop-shadow-[0_24px_30px_rgba(168,91,64,.16)]">
                <path d="M34 104C24 52 96 18 148 44s34 84-18 88-58-44-26-60 50 6 44 26" fill="none" stroke="url(#cream-fill)" strokeWidth="26" strokeLinecap="round" />
                <path d="M40 96C36 58 94 30 140 50" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity=".9" />
              </svg>
            )}
            </CursorFloat>
          </div>
        ))}
      </div>
      <div className="mx-auto max-w-6xl">
        <SplitText text="Des actifs reconnus, dosés avec douceur."
          className="soft max-w-[18ch] font-serif text-[clamp(2.2rem,6vw,4.8rem)] font-light leading-[1.02]" />
        <p className="mt-6 max-w-[44ch] leading-relaxed text-mute md:text-lg">
          Acide hyaluronique pour hydrater, niacinamide pour unifier, réglisse pour apaiser, bardane pour purifier.
          Des textures légères qui s&apos;effacent sur la peau.
        </p>
        <Reveal stagger={0.1} className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {stats.map((s) => (
            <RevealItem key={s.label} className="border-t border-ink/15 pt-5">
              <div className="soft font-serif text-5xl tabular-nums md:text-6xl"><Counter to={s.v} suffix={s.suffix} /></div>
              <p className="mt-3 text-sm leading-relaxed text-mute">{s.label}</p>
              {s.note && <p className="mt-1 text-[11px] font-medium text-terra">{s.note}</p>}
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

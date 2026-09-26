"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import Logo from "../Logo";
import Magnetic from "../Magnetic";
import LiquidCanvas from "../LiquidCanvas";
import SplitText from "../SplitText";
import { useIntroDone } from "@/lib/intro";
import { products } from "@/lib/products";

const ease = [0.76, 0, 0.24, 1] as const;

// Constellation of packshots; depth drives cursor parallax, scroll drift and stacking.
const fan = [
  { id: "gel-moussant", depth: 0.45, box: "left-[2%] bottom-[20%] h-[56%] -rotate-[9deg] hidden md:block", bob: "0s" },
  { id: "syndet", depth: 0.7, box: "left-[22%] bottom-[16%] h-[76%] md:left-[30%] md:h-[80%] rotate-[2deg]", bob: "-2s" },
  { id: "mousse-eclat-boost", depth: 1.25, box: "right-[6%] bottom-[6%] h-[62%] md:right-[6%] md:h-[60%] rotate-[7deg]", bob: "-1s" },
  { id: "ecran-solaire", depth: 1, box: "left-[-4%] bottom-[0%] h-[46%] md:left-[12%] md:h-[42%] -rotate-[4deg]", bob: "-4s" },
];

function FanItem({ i, cx, cy, drift, play }: { i: number; cx: MotionValue<number>; cy: MotionValue<number>; drift: MotionValue<number>; play: boolean }) {
  const f = fan[i];
  const p = products.find((x) => x.id === f.id)!;
  const x = useTransform(cx, (v) => v * 34 * f.depth);
  const y = useTransform([cy, drift], ([a, b]: number[]) => a * 24 * f.depth - b * 160 * f.depth);
  const rotY = useTransform(cx, (v) => v * 10 * f.depth);
  return (
    <motion.div className={`absolute aspect-[0.5] mix-blend-multiply ${f.box}`} style={{ zIndex: Math.round(f.depth * 10) }}
      initial={{ opacity: 0, y: 120, scale: 0.9 }} animate={play ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.55 + i * 0.12 }}>
      <motion.div className="absolute inset-0" style={{ x, y, rotateY: rotY, transformPerspective: 800 }}>
        <div className="absolute inset-0 animate-[bob_7s_ease-in-out_infinite]" style={{ animationDelay: f.bob }}>
          <Image src={p.image} alt="" fill priority={f.id === "syndet"} sizes="(min-width: 768px) 22vw, 40vw" className="object-contain" />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  const reduce = useReducedMotion();
  const play = useIntroDone();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "30%"]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const cx = useSpring(mx, { stiffness: 60, damping: 18 });
  const cy = useSpring(my, { stiffness: 60, damping: 18 });
  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my, reduce]);

  return (
    <section id="hero" ref={ref} data-bg="#FAF6F1" data-snap
      className="pad-safe-x relative isolate flex min-h-[100svh] flex-col overflow-hidden pb-6 pt-[max(5.5rem,calc(env(safe-area-inset-top)+4.5rem))] md:grid md:grid-cols-[1.05fr_1fr] md:items-center md:gap-8 md:pb-0">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="blob left-[-20%] top-[5%] h-[70vmax] w-[70vmax] bg-[radial-gradient(circle,rgba(241,217,210,.9),transparent_65%)] [animation:drift-a_18s_ease-in-out_infinite]" />
        <div className="blob right-[-25%] top-[30%] h-[60vmax] w-[60vmax] bg-[radial-gradient(circle,rgba(159,178,159,.45),transparent_65%)] [animation:drift-b_22s_ease-in-out_infinite]" />
        <LiquidCanvas className="absolute inset-0 h-full w-full" />
      </div>

      <motion.div style={{ y: textY, opacity: fade }} className="relative z-20 flex flex-col items-center text-center mix-blend-multiply md:items-start md:pl-[4vw] md:text-left">
        <motion.div initial={reduce ? { opacity: 0 } : { clipPath: "inset(0 100% 0 0)", scale: 1.06 }}
          animate={play ? (reduce ? { opacity: 1 } : { clipPath: "inset(0 0% 0 0)", scale: 1 }) : undefined}
          transition={{ duration: 1.4, ease }} className="origin-left">
          <Logo size="lg" priority />
        </motion.div>

        <SplitText as="h1" by="char" play={play} delay={0.25}
          text={"Une peau saine,\nnaturellement\nlumineuse."}
          className="soft mt-6 font-serif text-[clamp(2.6rem,10.5vw,6.4rem)] font-light leading-[0.96] tracking-[-0.025em] md:mt-10" />

        <motion.p initial={{ opacity: 0, y: 16 }} animate={play ? { opacity: 1, y: 0 } : undefined} transition={{ delay: 1.1, duration: 0.9 }}
          className="mt-5 max-w-[36ch] text-[0.95rem] leading-relaxed text-mute md:mt-7 md:text-lg">
          Cutanéa Laboratoire, marque marocaine de soins dermo-cosmétiques. Des formules précises et douces, pensées pour chaque type de peau.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={play ? { opacity: 1, y: 0 } : undefined} transition={{ delay: 1.3, duration: 0.8 }}
          className="mt-7 flex items-center gap-5 md:mt-10">
          <Magnetic>
            <a href="#produits" className="tap btn-fill inline-flex min-h-13 items-center rounded-full bg-ink px-8 text-sm tracking-wide text-cream">
              Découvrir la gamme
            </a>
          </Magnetic>
          <a href="#histoire" className="group hidden items-center gap-3 text-sm md:inline-flex">
            <span className="relative block h-10 w-px overflow-hidden bg-ink/15">
              <span className="absolute inset-x-0 top-0 h-1/3 bg-ink/70 [animation:cue_2.4s_cubic-bezier(.6,0,.4,1)_infinite]" />
            </span>
            <span className="text-mute transition-colors group-hover:text-ink">Notre histoire</span>
          </a>
        </motion.div>
      </motion.div>

      {/* no z-index here: a stacking context would isolate the packshots' multiply blend from the canvas */}
      <div className="relative mt-2 min-h-[36svh] flex-1 md:mt-0 md:h-[82vh] md:min-h-0">
        {/* pool of light: the packshots multiply onto it, so white bottles stay white */}
        <motion.div aria-hidden initial={{ opacity: 0, scale: 0.7 }} animate={play ? { opacity: 1, scale: 1 } : undefined} transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          className="absolute inset-x-[-15%] bottom-[-20%] top-[-5%] bg-[radial-gradient(closest-side,#fff_0%,rgba(255,255,255,.96)_55%,rgba(255,255,255,0)_100%)]" />
        {fan.map((_, i) => <FanItem key={fan[i].id} i={i} cx={cx} cy={cy} drift={scrollYProgress} play={play} />)}
        <RotatingBadge play={play} />
      </div>
    </section>
  );
}

function RotatingBadge({ play }: { play: boolean }) {
  const text = "Soins dermo-cosmétiques + Cutanéa + ";
  return (
    <motion.a href="#produits" aria-label="Voir les produits" data-cursor-label="Voir"
      initial={{ opacity: 0, scale: 0.6 }} animate={play ? { opacity: 1, scale: 1 } : undefined} transition={{ delay: 1.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="group absolute right-[2%] top-[2%] z-30 grid h-24 w-24 place-items-center md:right-[6%] md:top-[6%] md:h-32 md:w-32">
      <svg viewBox="0 0 100 100" className="absolute inset-0 animate-[spin_18s_linear_infinite] group-hover:[animation-duration:5s]" aria-hidden>
        <defs><path id="badge-circle" d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0" /></defs>
        <text fontSize="8" fill="currentColor" className="font-sans uppercase">
          <textPath href="#badge-circle" textLength="236" lengthAdjust="spacing">{text}</textPath>
        </text>
      </svg>
      <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-cream transition-transform duration-500 group-hover:scale-110 md:h-12 md:w-12">
        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden><path d="M8 3v10M4 9l4 4 4-4" /></svg>
      </span>
    </motion.a>
  );
}

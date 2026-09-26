"use client";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal, RevealItem } from "../Reveal";

const statement = "Cutanéa allie la rigueur de la dermatologie à la douceur d'un rituel. Chaque formule est pensée pour respecter, réparer et sublimer votre peau, jour après jour.";

const pillars = [
  { t: "Formulé par des experts", d: "Des actifs choisis et dosés avec précision, pour des soins efficaces et bien tolérés.",
    icon: "M9 3h6M10 3v6L5 19a1.5 1.5 0 0 0 1.3 2h11.4a1.5 1.5 0 0 0 1.3-2L14 9V3M7.5 15h9" },
  { t: "Testé dermatologiquement", d: "Une haute tolérance, validée sous contrôle dermatologique.",
    icon: "M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3zM9 12l2 2 4-4" },
  { t: "Pensé pour toutes les peaux", d: "Sèche, grasse ou sensible : un soin adapté à chacune, pour toute la famille.",
    icon: "M4 10a5 5 0 1 0 10 0a5 5 0 1 0-10 0M10 10a5 5 0 1 0 10 0a5 5 0 1 0-10 0M7 15a5 5 0 1 0 10 0a5 5 0 1 0-10 0" },
  { t: "Une marque marocaine", d: "Des soins pensés pour le quotidien au Maroc, du soleil d'été à la routine du soir.",
    icon: "M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7L12 3z" },
];

function PillarIcon({ d, delay }: { d: string; delay: number }) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="wiggle h-10 w-10 shrink-0 text-sage-deep" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      {reduce ? <path d={d} /> : (
        <motion.path d={d} initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "0px 0px -12% 0px" }}
          transition={{ pathLength: { duration: 1.6, ease: [0.65, 0, 0.35, 1], delay }, opacity: { duration: 0.2, delay } }} />
      )}
    </svg>
  );
}

export default function Story() {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      const words = ref.current!.querySelectorAll("span");
      gsap.fromTo(words, { opacity: 0.12, y: reduce ? 0 : 14 },
        { opacity: 1, y: 0, stagger: 0.08, ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top 80%", end: "bottom 45%", scrub: true } });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="histoire" data-bg="#F6ECE7" data-snap className="pad-safe-x pb-20 pt-28 md:pb-36 md:pt-44">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-serif text-lg text-mute md:text-xl">Pourquoi Cutanéa</h2>
        <p ref={ref} className="soft mt-6 max-w-[26ch] font-serif text-[clamp(1.8rem,5.4vw,3.6rem)] font-light leading-[1.14] md:max-w-none">
          {statement.split(" ").map((w, i) => <span key={i} className="inline-block will-change-transform">{w}&nbsp;</span>)}
        </p>

        <Reveal as="ul" stagger={0.09}
          className="mt-16 divide-y divide-ink/10 border-y border-ink/10 md:mt-24 lg:grid lg:grid-cols-4 lg:divide-x lg:divide-y-0">
          {pillars.map((p, i) => (
            <RevealItem as="li" spotlight key={p.t} className="group grid grid-cols-[auto_1fr] items-start gap-5 py-7 lg:flex lg:flex-col lg:gap-8 lg:px-8 lg:py-10 lg:first:pl-0">
              <PillarIcon d={p.icon} delay={0.2 + i * 0.09} />
              <div>
                <h3 className="font-serif text-xl leading-snug md:text-2xl">{p.t}</h3>
                <p className="mt-2 max-w-[34ch] text-sm leading-relaxed text-mute">{p.d}</p>
              </div>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

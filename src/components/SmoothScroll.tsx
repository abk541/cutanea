"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { MotionConfig } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollToTarget, setLenis } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

const RING = "rgb(227 183 172";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  // Soft pulse on every .tap element; the touch listener is what enables :active on iOS Safari.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onDown = (e: PointerEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>(".tap");
      if (!el || reduce.matches) return;
      const base = getComputedStyle(el).boxShadow;
      const keep = base && base !== "none" ? `, ${base}` : "";
      el.animate(
        [{ boxShadow: `0 0 0 0 ${RING} / .6)${keep}` }, { boxShadow: `0 0 0 16px ${RING} / 0)${keep}` }],
        { duration: 650, easing: "cubic-bezier(.2,.8,.2,1)" },
      );
    };
    const noop = () => {};
    // feeds the [data-spotlight] radial light
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-spotlight]");
      if (!el) return;
      const b = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - b.left}px`);
      el.style.setProperty("--my", `${e.clientY - b.top}px`);
    };
    document.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("touchstart", noop, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("touchstart", noop);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4) });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const onClick = (e: MouseEvent) => {
      const href = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')?.getAttribute("href");
      if (!href || href === "#") return;
      e.preventDefault();
      scrollToTarget(href);
    };
    document.addEventListener("click", onClick);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

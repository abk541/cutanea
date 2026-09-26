"use client";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Scrubs the page colour between the data-bg of consecutive sections. It is tweened on solid-colour
// layers ([data-page-bg]) instead of the body, so scrolling text never has to be repainted.
export default function BackgroundShift() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>("[data-page-bg]");
      const sections = gsap.utils.toArray<HTMLElement>("[data-bg]");
      sections.forEach((s, i) => {
        if (i === 0) return;
        gsap.fromTo(targets,
          { backgroundColor: sections[i - 1].dataset.bg },
          { backgroundColor: s.dataset.bg, ease: "none", immediateRender: false,
            scrollTrigger: { trigger: s, start: "top 85%", end: "top 35%", scrub: true } });
      });
    });
    return () => ctx.revert();
  }, []);
  return <div aria-hidden data-page-bg className="pointer-events-none fixed inset-0 -z-20 bg-cream" />;
}

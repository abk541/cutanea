"use client";
import { useEffect, useRef } from "react";

type Mode = "idle" | "link" | "label" | "text" | "stick";
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Dot + trailing ring. The ring stretches with velocity, wraps magnetic buttons, grows into a
// labelled bubble on [data-cursor-label] and collapses to a caret over text fields.
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");
    const d = dot.current!, r = ring.current!, l = label.current!;

    const m = { x: -100, y: -100 };
    const s = { x: -100, y: -100, w: 36, h: 36, rad: 18, press: 1, vis: 0 };
    let mode: Mode = "idle";
    let target: HTMLElement | null = null;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      m.x = e.clientX; m.y = e.clientY;
      if (s.vis === 0) { s.x = m.x; s.y = m.y; }
      s.vis = 1;
    };
    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      const labelled = t.closest<HTMLElement>("[data-cursor-label]");
      const magnet = t.closest<HTMLElement>("[data-magnetic]");
      const field = t.closest<HTMLElement>("input, textarea");
      const link = t.closest<HTMLElement>("a, button, [role='tab']");
      if (field) { mode = "text"; target = field; }
      else if (magnet) { mode = "stick"; target = (magnet.firstElementChild as HTMLElement) ?? magnet; }
      else if (labelled) { mode = "label"; target = labelled; l.textContent = labelled.dataset.cursorLabel ?? ""; }
      else if (link) { mode = "link"; target = link; }
      else { mode = "idle"; target = null; }
      r.dataset.mode = mode;
    };
    const onDown = (e: PointerEvent) => {
      s.press = 0.8;
      const ripple = document.createElement("span");
      ripple.className = "cursor-ripple";
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      document.body.appendChild(ripple);
      ripple.animate([{ transform: "translate(-50%,-50%) scale(.2)", opacity: 0.55 }, { transform: "translate(-50%,-50%) scale(2.6)", opacity: 0 }],
        { duration: 700, easing: "cubic-bezier(.2,.8,.2,1)" }).onfinish = () => ripple.remove();
    };
    const onUp = () => { s.press = 1; };
    const onLeave = () => { s.vis = 0; };

    const frame = () => {
      let tx = m.x, ty = m.y, tw = 36, th = 36, trad = 18, follow = 0.2;
      if (mode === "stick" && target) {
        const b = target.getBoundingClientRect();
        const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
        tx = cx + (m.x - cx) * 0.12; ty = cy + (m.y - cy) * 0.12;
        tw = b.width + 14; th = b.height + 14;
        trad = Math.min(th / 2, parseFloat(getComputedStyle(target).borderTopLeftRadius) + 7 || th / 2);
        follow = 0.25;
      } else if (mode === "label") { tw = th = 92; trad = 46; follow = 0.16; }
      else if (mode === "link") { tw = th = 58; trad = 29; }
      else if (mode === "text") { tw = 3; th = 30; trad = 2; follow = 0.35; }

      const px = s.x, py = s.y;
      s.x = lerp(s.x, tx, follow); s.y = lerp(s.y, ty, follow);
      s.w = lerp(s.w, tw, 0.2); s.h = lerp(s.h, th, 0.2); s.rad = lerp(s.rad, trad, 0.2);
      const vx = s.x - px, vy = s.y - py;
      const speed = Math.min(Math.hypot(vx, vy) / 40, 0.5);
      const stretch = mode === "idle" || mode === "link" ? speed : 0;
      const angle = Math.atan2(vy, vx);

      r.style.width = `${s.w}px`;
      r.style.height = `${s.h}px`;
      r.style.borderRadius = `${s.rad}px`;
      r.style.opacity = String(s.vis);
      r.style.transform = `translate3d(${s.x - s.w / 2}px, ${s.y - s.h / 2}px, 0) rotate(${angle}rad) scale(${(1 + stretch) * s.press}, ${(1 - stretch * 0.45) * s.press}) rotate(${-angle}rad)`;
      d.style.opacity = String(mode === "idle" || mode === "link" ? s.vis : 0);
      d.style.transform = `translate3d(${m.x - 3}px, ${m.y - 3}px, 0)`;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] hidden [.has-cursor_&]:block">
      <div ref={ring} data-mode="idle" className="cursor-ring fixed left-0 top-0 grid place-items-center opacity-0 [contain:strict]">
        <span ref={label} className="cursor-label text-[11px] font-medium tracking-wide" />
      </div>
      <div ref={dot} className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-ink opacity-0" />
    </div>
  );
}

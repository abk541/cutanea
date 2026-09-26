"use client";
import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/products";

// Uses /public/logo.png when present; falls back to a typeset wordmark.
export default function Logo({ className = "", size = "md", priority = false }: { className?: string; size?: "sm" | "md" | "lg" | "xl"; priority?: boolean }) {
  const [failed, setFailed] = useState(false);
  const img = useRef<HTMLImageElement>(null);
  // the load error can fire before hydration attaches onError
  useEffect(() => {
    if (img.current?.complete && img.current.naturalWidth === 0) setFailed(true);
  }, []);
  const h = { xl: "h-20 md:h-28", lg: "h-14 md:h-20", md: "h-10", sm: "h-8" }[size];
  if (!failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img ref={img} src={asset("/logo.png")} alt="Cutanéa" fetchPriority={priority ? "high" : "auto"}
        className={`${h} w-auto mix-blend-multiply ${className}`} onError={() => setFailed(true)} />
    );
  }
  const text = { xl: "text-[2.75rem] md:text-7xl", lg: "text-[2rem] md:text-5xl", md: "text-2xl", sm: "text-lg" }[size];
  const big = size === "xl" || size === "lg";
  return (
    <span className={`inline-flex flex-col items-center leading-none ${className}`} aria-label="Cutanéa" role="img">
      <span className={`font-serif tracking-[0.12em] ${text}`}>CUTANÉA</span>
      <span className={`mt-[0.45em] flex items-center gap-[0.6em] font-sans uppercase tracking-[0.28em] text-mute ${big ? "text-[9px] md:text-[11px]" : "text-[7px]"}`}>
        <span aria-hidden className="h-px w-[1.6em] bg-current" />Dermatological care<span aria-hidden className="h-px w-[1.6em] bg-current" />
      </span>
    </span>
  );
}

"use client";
import { Fragment } from "react";
import { motion, type Variants } from "framer-motion";

type Props = {
  text: string;
  as?: "h1" | "h2" | "p" | "span";
  className?: string;
  by?: "word" | "char";
  delay?: number;
  stagger?: number;
  /** when set, plays on this flag instead of on scroll into view */
  play?: boolean;
};

const ease = [0.22, 1, 0.36, 1] as const;

// Masked word/char rise. "\n" in text forces a line break.
export default function SplitText({ text, as = "h2", className = "", by = "word", delay = 0, stagger, play }: Props) {
  const Tag = motion[as];
  const item: Variants = {
    hidden: { y: "115%", rotate: by === "char" ? 10 : 4, opacity: 0 },
    show: { y: "0%", rotate: 0, opacity: 1, transition: { duration: by === "char" ? 1.1 : 1, ease } },
  };
  const trigger = play === undefined
    ? { initial: "hidden", whileInView: "show", viewport: { once: true, margin: "0px 0px -8% 0px" } }
    : { initial: "hidden", animate: play ? "show" : "hidden" };

  return (
    <Tag className={`${as === "span" ? "block " : ""}${className}`} {...trigger}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger ?? (by === "char" ? 0.022 : 0.055), delayChildren: delay } } }}>
      <span className="sr-only">{text.replace(/\n/g, " ")}</span>
      {text.split("\n").map((line, li) => (
        <span key={li} aria-hidden className="block">
          {line.split(" ").map((w, wi, arr) => (
            <Fragment key={wi}>
              <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-top">
                {by === "char"
                  ? w.split("").map((c, ci) => <motion.span key={ci} variants={item} className="inline-block origin-bottom-left">{c}</motion.span>)
                  : <motion.span variants={item} className="inline-block origin-bottom-left">{w}</motion.span>}
              </span>
              {wi < arr.length - 1 && " "}
            </Fragment>
          ))}
        </span>
      ))}
    </Tag>
  );
}

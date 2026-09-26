import type Lenis from "lenis";

let instance: Lenis | null = null;

export const setLenis = (lenis: Lenis | null) => { instance = lenis; };
export const getLenis = () => instance;

let jumpTimer = 0;

// Anchor jumps: Lenis when smoothing is on, native otherwise. Snap is paused so it can't fight the animation.
export function scrollToTarget(target: string | HTMLElement | number) {
  const root = document.documentElement;
  if (!instance) {
    if (typeof target === "number") window.scrollTo(0, target);
    else (typeof target === "string" ? document.querySelector(target) : target)?.scrollIntoView();
    return;
  }
  const release = () => { window.clearTimeout(jumpTimer); root.classList.remove("is-jumping"); };
  root.classList.add("is-jumping");
  window.clearTimeout(jumpTimer);
  // onComplete never fires when the user interrupts the jump
  jumpTimer = window.setTimeout(release, 2000);
  instance.scrollTo(target, { onComplete: release });
}

export function lockScroll(locked: boolean) {
  document.documentElement.classList.toggle("is-locked", locked);
  if (locked) instance?.stop();
  else instance?.start();
}

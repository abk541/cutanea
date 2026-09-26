import { INSTAGRAM_DM_URL } from "@/lib/products";
import { Reveal, RevealItem } from "../Reveal";
import Magnetic from "../Magnetic";
import Composer from "../Composer";
import SplitText from "../SplitText";
import { CursorGlow } from "../CursorFx";
import { InstagramIcon } from "../icons";

const particles = Array.from({ length: 16 }, (_, i) => ({
  left: `${(i * 37) % 100}%`, size: 4 + ((i * 7) % 10), dur: 14 + ((i * 5) % 12), delay: -((i * 3) % 14), dx: `${((i % 5) - 2) * 20}px`,
}));

export default function Contact() {
  return (
    <section id="contact" data-bg="#F4E4DE" data-snap className="pad-safe-x relative isolate flex min-h-[90svh] items-center overflow-clip py-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 motion-reduce:hidden">
        <CursorGlow className="absolute left-1/2 top-1/2 -ml-[45vmin] -mt-[45vmin] h-[90vmin] w-[90vmin] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.85),transparent_65%)]" />
        {particles.map((p, i) => (
          <span key={i} className={`absolute bottom-0 rounded-full bg-white/80 ${i > 9 ? "hidden md:block" : ""}`}
            style={{ left: p.left, width: p.size, height: p.size, animation: `float-up ${p.dur}s linear ${p.delay}s infinite`, "--dx": p.dx } as React.CSSProperties} />
        ))}
      </div>
      <Reveal stagger={0.09} className="mx-auto w-full max-w-3xl text-center">
        <RevealItem>
          <SplitText by="char" text="Parlons de votre peau." className="soft font-serif text-[clamp(2.4rem,7vw,5rem)] font-light leading-[1]" />
        </RevealItem>
        <RevealItem>
          <p className="mx-auto mt-6 max-w-[40ch] leading-relaxed text-mute">
            Une commande, un point de vente, un conseil pour votre routine : écrivez-nous, notre équipe vous répond directement.
          </p>
        </RevealItem>
        <RevealItem className="mt-10">
          <Composer />
        </RevealItem>
        <RevealItem className="mt-4">
          <Magnetic>
            <a href={INSTAGRAM_DM_URL} target="_blank" rel="noopener noreferrer"
              className="tap btn-fill inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border border-ink/20 bg-white/40 px-6 text-sm [--fill:var(--color-ink)] hover:text-cream">
              <InstagramIcon className="h-4 w-4" /> Message sur Instagram
            </a>
          </Magnetic>
        </RevealItem>
      </Reveal>
    </section>
  );
}

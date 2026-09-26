import { INSTAGRAM_URL, products } from "@/lib/products";
import { Reveal, RevealItem } from "../Reveal";
import Magnetic from "../Magnetic";
import ProductVisual from "../ProductVisual";
import { InstagramIcon } from "../icons";
import SplitText from "../SplitText";

type Tile = { id: string; bg: string; zoom?: boolean } | { quote: string; bg: string };

// Stand-ins for the feed (captions paraphrase the brand's posts). Swap for real posts when available.
const tiles: Tile[] = [
  { id: "ecran-solaire", bg: "#F3E3B3" },
  { quote: "Hydratation 1, sécheresse 0.", bg: "#D9EAF2" },
  { id: "mousse-eclat-boost", bg: "#F2DBD5" },
  { id: "creme-hydratante", bg: "#E2EFF4", zoom: true },
  { quote: "Protégez votre peau, sans compromis.", bg: "#EFE4D6" },
  { id: "gel-moussant", bg: "#DCE9E3" },
  { id: "syndet", bg: "#E6F0F2" },
  { id: "ecran-solaire", bg: "#F6EBD2", zoom: true },
  { quote: "L'éclat commence par une peau nette.", bg: "#F6E3D6" },
];

export default function Instagram() {
  return (
    <section data-bg="#FAF3EF" data-snap className="pad-safe-x py-28 md:py-40">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="soft font-serif text-[clamp(2.2rem,6vw,4.5rem)] font-light leading-[1.02]">
            <SplitText as="span" text="Suivez-nous" by="char" />
            <SplitText as="span" text="@cutanea_laboratoire" className="text-[0.62em]" delay={0.2} />
          </h2>
          <Magnetic>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
              className="tap btn-fill inline-flex min-h-12 items-center gap-2.5 rounded-full bg-ink px-7 text-sm text-cream">
              <InstagramIcon className="h-4 w-4" /> Voir sur Instagram
            </a>
          </Magnetic>
        </div>
        <Reveal stagger={0.07} className="mt-12 grid grid-cols-3 gap-1.5 md:gap-4">
          {tiles.map((t, i) => (
            <RevealItem key={i}>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label={`Publication Instagram ${i + 1} de Cutanéa`} data-cursor-label="Ouvrir" data-spotlight
                className="tap group relative isolate block aspect-square overflow-hidden rounded-md md:rounded-2xl" style={{ background: t.bg }}>
                {"quote" in t ? (
                  <span className="soft absolute inset-0 flex items-center justify-center p-[12%] text-center font-serif text-[clamp(0.85rem,3.4vw,1.6rem)] font-light leading-tight">
                    {t.quote}
                  </span>
                ) : (
                  <span className="absolute inset-0 mix-blend-multiply transition-[scale] duration-700 ease-out group-hover:scale-110">
                    <span className={`absolute ${t.zoom ? "inset-[-45%_-30%_-10%]" : "inset-[10%]"}`}>
                      <ProductVisual p={products.find((p) => p.id === t.id)!} sizes="(min-width: 768px) 24vw, 40vw" />
                    </span>
                  </span>
                )}
                <span aria-hidden className="absolute inset-0 grid place-items-center bg-ink/0 text-cream opacity-0 transition duration-500 group-hover:bg-ink/25 group-hover:opacity-100">
                  <InstagramIcon className="h-7 w-7" />
                </span>
              </a>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

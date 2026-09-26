import Logo from "./Logo";
import { INSTAGRAM_URL } from "@/lib/products";

export default function Footer() {
  return (
    <footer className="pad-safe-x border-t border-ink/10 pt-14 pb-[max(6rem,calc(env(safe-area-inset-bottom)+5rem))] lg:pb-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 text-center md:flex-row md:justify-between md:text-left">
        <Logo />
        <nav aria-label="Pied de page" className="flex flex-wrap justify-center gap-6 text-sm text-mute">
          <a href="#histoire">Histoire</a><a href="#produits">Produits</a><a href="#actifs">Actifs</a><a href="#contact">Contact</a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-ink">Instagram</a>
        </nav>
      </div>
      <p className="mt-10 text-center text-xs text-mute">© {new Date().getFullYear()} Cutanéa Laboratoire, Maroc. Tous droits réservés.</p>
    </footer>
  );
}

"use client";
import { useId } from "react";
import { WHATSAPP_URL, whatsappLink } from "@/lib/products";
import { WhatsAppIcon } from "./icons";

const FALLBACK = "Bonjour Cutanéa, j'aimerais un conseil pour ma routine.";

// Chat-style composer: whatever is typed pre-fills the WhatsApp conversation.
export default function Composer() {
  const id = useId();
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = (e.currentTarget.elements.namedItem("text") as HTMLInputElement).value.trim();
    window.open(whatsappLink(text || FALLBACK), "_blank", "noopener,noreferrer");
  };
  return (
    <form action={WHATSAPP_URL} method="get" target="_blank" onSubmit={submit}
      className="field mx-auto flex w-full max-w-md items-center gap-2 rounded-full border border-ink/15 bg-white/60 p-1.5 pl-5">
      <label htmlFor={id} className="sr-only">Votre message, envoyé sur WhatsApp</label>
      <input id={id} name="text" maxLength={500} autoComplete="off" enterKeyHint="send"
        placeholder="Écrivez votre message"
        className="min-w-0 flex-1 bg-transparent py-3 text-base outline-none placeholder:text-mute" />
      <button type="submit"
        className="tap btn-fill inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-sage-deep px-5 text-sm text-cream [--fill:var(--color-ink)]">
        <WhatsAppIcon className="h-4 w-4" /> Envoyer
      </button>
    </form>
  );
}

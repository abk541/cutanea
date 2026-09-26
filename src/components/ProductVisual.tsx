import Image from "next/image";
import type { Product } from "@/lib/products";

// Packshots are shot on white: the parent must sit on a tinted surface with mix-blend-multiply
// so the white drops out. Fills its (positioned) parent.
export default function ProductVisual({ p, sizes, className = "" }: { p: Product; sizes: string; className?: string }) {
  return <Image src={p.image} alt={`${p.name} Cutanéa, ${p.volume}`} fill sizes={sizes} className={`object-contain ${className}`} />;
}

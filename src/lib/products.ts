export type Product = {
  id: string;
  name: string;
  line: string;
  price: number;
  volume: string;
  benefit: string;
  highlights: string[];
  actives?: string[];
  tint: string;
  accent: string;
  image: string;
};

// next/image and plain <img> do not add basePath to /public URLs on a static export
export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

// Claims are taken from the packaging and the brand's own Instagram posts.
export const products: Product[] = [
  {
    id: "ecran-solaire", name: "Écran solaire", line: "Dry Touch SPF 50+", price: 230, volume: "50 ml",
    benefit: "Très haute protection UVA/UVB, au fini sec et invisible.",
    highlights: ["Très haute protection SPF 50+ UVA/UVB", "Défense contre la lumière bleue", "Aide à prévenir les taches et les signes de l'âge", "Toucher sec, matifiant, sans parfum"],
    actives: ["Acide hyaluronique", "Niacinamide", "Réglisse"],
    tint: "#F7EDCF", accent: "#E8B930", image: asset("/products/ecran-solaire.jpg"),
  },
  {
    id: "creme-hydratante", name: "Crème hydratante", line: "Hydratation Optimale", price: 132, volume: "50 ml",
    benefit: "Hydrate, nourrit et apaise le visage au quotidien.",
    highlights: ["Hydratation quotidienne du visage", "Apaise et renforce la barrière cutanée", "Pour les peaux normales à sèches et sensibles"],
    tint: "#E2EFF4", accent: "#38A8C8", image: asset("/products/creme-hydratante.jpg"),
  },
  {
    id: "mousse-eclat-boost", name: "Mousse nettoyante éclat boost", line: "Éclat Boost", price: 190, volume: "150 ml",
    benefit: "Nettoie, démaquille et ravive l'éclat du teint.",
    highlights: ["Nettoie en douceur", "Démaquille sans frotter", "Éclaircit et ravive l'éclat du teint"],
    tint: "#F6E8D8", accent: "#D4A060", image: asset("/products/mousse-eclat-boost.jpg"),
  },
  {
    id: "syndet", name: "Syndet", line: "Hydratation Optimale", price: 198, volume: "500 ml",
    benefit: "Nettoyant relipidant visage et corps, sans savon.",
    highlights: ["Nettoie sans dessécher et relipide", "Anti-irritation, anti-grattage", "Réduit la sécheresse sévère de la peau", "Visage et corps, grand format"],
    tint: "#E6F0F2", accent: "#38A8C8", image: asset("/products/syndet.jpg"),
  },
  {
    id: "gel-moussant", name: "Gel moussant", line: "Oily Skin", price: 198, volume: "500 ml",
    benefit: "Purifie et régule le sébum des peaux normales à grasses.",
    highlights: ["Élimine l'excès de sébum et les impuretés", "Aide à matifier et à contrôler la brillance", "Fraîcheur durable, sans dessécher", "Usage quotidien, matin et soir"],
    actives: ["Extrait de bardane"],
    tint: "#E0ECE7", accent: "#145E5A", image: asset("/products/gel-moussant.jpg"),
  },
];

export const INSTAGRAM_URL = "https://www.instagram.com/cutanea_laboratoire/";
export const INSTAGRAM_DM_URL = "https://ig.me/m/cutanea_laboratoire";
export const WHATSAPP_URL = "https://wa.me/212600000000"; // placeholder number

export const whatsappLink = (text: string) => `${WHATSAPP_URL}?text=${encodeURIComponent(text)}`;

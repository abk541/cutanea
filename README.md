# Cutanéa — site vitrine

Next.js 15 (App Router) · TypeScript · Tailwind v4 · Framer Motion · GSAP ScrollTrigger · Lenis.

```bash
npm install
npm run dev   # http://localhost:3000
```

## Remplacer les placeholders

- **Logo** → `public/logo.png`. Tant que le fichier est absent, un logotype typographique s'affiche. Un logo sur fond blanc fonctionne aussi (fusion `multiply`).
- **Photos produits** → déjà en place dans `public/products/<id>.jpg` (packshots fournis, recadrés). Pour en changer, remplacer le fichier du même nom
  (ids : `ecran-solaire`, `creme-hydratante`, `mousse-eclat-boost`, `syndet`, `gel-moussant`). Packshots sur fond blanc : le blanc disparaît automatiquement.
- **Textes et prix produits** → `src/lib/products.ts`.
- **Instagram grid** → tuiles dans `src/components/sections/Instagram.tsx`.
- **WhatsApp** → numéro placeholder dans `WHATSAPP_URL` (`src/lib/products.ts`).
- **Chiffres clés** → valeurs `[TO CONFIRM]` dans `src/components/sections/Ingredients.tsx`.

## Effets
- Intro rideau + compteur (une fois par session), fond liquide WebGL réactif au curseur/toucher dans le hero, titres révélés lettre par lettre.
- Gamme : une seule scène (pas de défilement forcé) — glisser/swiper, flèches, clavier, lecture auto, halo et teinte par produit, fiche produit en panneau/bottom sheet.
- Curseur desktop : anneau qui s'étire avec la vitesse, s'accroche aux boutons magnétiques, bulles « Voir / Glisser / Ouvrir », onde au clic ; traînée d'images sur le bandeau, gouttes qui fuient le curseur, halo qui suit la souris.

## Notes
- `prefers-reduced-motion` : Lenis, intro, WebGL animé, parallaxe, curseur custom et lecture auto désactivés ; révélations en fondu uniquement.
- Mobile : scène produits plein écran swipeable, CTA flottant après le hero, safe-area insets, WebGL rendu en basse résolution et mis en pause hors écran.

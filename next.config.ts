import type { NextConfig } from "next";

// Su GitHub Pages il sito è puramente statico: niente server Node.
// `output: "export"` fa generare a `next build` la cartella `out/` con
// solo HTML/CSS/JS, pronta da pubblicare.
//
// basePath: serve SOLO se il sito vive in una sottocartella, cioè
// all'indirizzo  https://<utente>.github.io/DGF-Website/ (GitHub "project page").
// Con un dominio personalizzato (o se il repo si chiama <utente>.github.io)
// il sito sta nella radice e basePath deve restare VUOTO.
// Lo controlliamo da una variabile così non serve toccare il codice:
//   - dominio personalizzato / radice  →  non impostare nulla
//   - sottocartella /DGF-Website        →  PAGES_BASE_PATH=/DGF-Website
const basePath = process.env.PAGES_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  // L'ottimizzatore immagini di Next ha bisogno di un server: con l'export
  // statico va disattivato e le immagini vengono servite così come sono.
  images: { unoptimized: true },
  // Ogni pagina diventa una cartella con index.html (es. /contatti/index.html):
  // così GitHub Pages serve i percorsi senza errori 404.
  trailingSlash: true,
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  // Il sito vetrina non ha lint configurato: non bloccare la build.
  eslint: { ignoreDuringBuilds: true },
  // Forza la root del progetto: nella home utente esiste un altro lockfile.
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;

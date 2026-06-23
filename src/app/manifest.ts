import type { MetadataRoute } from "next";

// Richiesto da output: "export" — generato staticamente a build time.
export const dynamic = "force-static";

// Web app manifest: abilita "Aggiungi a schermata Home" e dà coerenza di
// branding (nome, colori) su mobile. Next collega automaticamente
// <link rel="manifest"> dal metadata.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DGF Tech Solutions",
    short_name: "DGF",
    description:
      "Software house a Messina: siti web, e-commerce, app, software su misura e soluzioni AI.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a1f33",
    theme_color: "#054b77",
    icons: [
      { src: "/icon.png", sizes: "any", type: "image/png" },
      { src: "/apple-icon.png", sizes: "any", type: "image/png" },
    ],
  };
}

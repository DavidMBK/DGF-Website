import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono, Cormorant, Playfair_Display } from "next/font/google";
import { IntroAnimation } from "@/components/IntroAnimation";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  // Solo micro-etichette: non bloccare il primo render con il preload.
  preload: false,
});

const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
  // Usato solo nei mockup live (/preview): non serve in preload sull'home.
  preload: false,
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  // Usato solo nei mockup live (/preview): non serve in preload sull'home.
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dgftechsolutions.com"),
  title: {
    default: "DGF Tech Solutions | Software House a Messina",
    template: "%s | DGF Tech Solutions",
  },
  description:
    "Software house a Messina, attiva in tutta Italia: siti web, e-commerce, app, software su misura e soluzioni AI. Dall'idea al lancio, parli sempre con chi scrive il codice.",
  keywords: [
    "software house Messina",
    "software house Italia",
    "sviluppo siti web",
    "e-commerce personalizzato",
    "soluzioni AI aziende",
    "sviluppo app Italia",
    "software su misura",
    "DGF Tech Solutions",
  ],
  authors: [{ name: "DGF Tech Solutions" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "/",
    siteName: "DGF Tech Solutions",
    title: "DGF Tech Solutions | Software House a Messina",
    description:
      "Siti, e-commerce, app e soluzioni AI su misura. Una software house a Messina dove parli sempre con chi progetta e scrive il codice.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DGF Tech Solutions | Software House a Messina",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DGF Tech Solutions | Software House a Messina",
    description:
      "Siti, e-commerce, app e soluzioni AI su misura. Parli sempre con chi progetta e scrive il codice.",
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#054b77",
  width: "device-width",
  initialScale: 1,
  // Permette al layout di estendersi sotto notch/barre di sistema (iPhone, ecc.)
  // così possiamo gestire gli spazi con le safe-area-inset.
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} ${cormorant.variable} ${playfair.variable} antialiased`}
      >
        {/* Dati strutturati Schema.org: aiutano Google a identificare
            DGF Tech Solutions come entità precisa (riduce la confusione con
            aziende omonime tipo "DGF Technologies" o "DGF Group"). */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "DGF Tech Solutions",
              legalName: "DGF Tech Solutions S.r.l.",
              url: "https://dgftechsolutions.com",
              logo: "https://dgftechsolutions.com/logo-dgf-trasparente.png",
              image: "https://dgftechsolutions.com/og-image.jpg",
              description:
                "Software house italiana con sede a Messina: sviluppo di siti web, e-commerce, app, software su misura e soluzioni di intelligenza artificiale. Non è collegata ad aziende omonime estere.",
              slogan: "Dall'idea al lancio, parli sempre con chi scrive il codice.",
              email: "founders.dgftechsolutions@gmail.com",
              contactPoint: {
                "@type": "ContactPoint",
                email: "founders.dgftechsolutions@gmail.com",
                contactType: "customer support",
                areaServed: "IT",
                availableLanguage: ["Italian"],
              },
              // P.IVA italiana: identificatore univoco che distingue questa
              // azienda dalle omonime estere (DGF Group, DGF Technologies).
              vatID: "IT03882320835",
              taxID: "03882320835",
              foundingLocation: { "@type": "Place", name: "Messina, Italia" },
              address: {
                "@type": "PostalAddress",
                addressLocality: "Messina",
                addressRegion: "ME",
                addressCountry: "IT",
              },
              areaServed: { "@type": "Country", name: "Italia" },
              knowsAbout: [
                "Sviluppo software",
                "Sviluppo siti web",
                "E-commerce",
                "Sviluppo app mobile",
                "Intelligenza artificiale",
                "Automazione",
                "UI/UX design",
              ],
            }),
          }}
        />
        <IntroAnimation />
        {children}
      </body>
    </html>
  );
}

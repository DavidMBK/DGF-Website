import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CTAButton } from "@/components/ui/CTAButton";

export const metadata: Metadata = {
  title: "Pagina non trovata",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <Nav />
      <main
        id="main"
        tabIndex={-1}
        data-nav-theme="light"
        className="relative flex min-h-screen-safe flex-col items-center justify-center overflow-hidden bg-canvas-soft px-6 py-32 text-center"
      >
        {/* Alone brand d'atmosfera */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-60"
          style={{
            background:
              "radial-gradient(circle at center, rgba(61,156,199,0.18) 0%, rgba(61,156,199,0) 62%)",
            filter: "blur(34px)",
          }}
        />

        <div className="relative">
          <span className="eyebrow inline-flex items-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-brand-blue/60" />
            Errore 404
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-brand-blue/60" />
          </span>

          <p
            aria-hidden
            className="text-gradient-brand mt-6 font-display font-bold leading-none tracking-[-0.04em]"
            style={{ fontSize: "clamp(5rem, 18vw, 11rem)" }}
          >
            404
          </p>

          <h1 className="heading-lg mt-2 text-ink">Questa pagina non esiste</h1>

          <p className="lead mx-auto mt-5 max-w-[46ch]">
            Il link potrebbe essere vecchio o sbagliato. Nessun problema: torna alla home
            o scrivici, ci pensiamo noi.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CTAButton href="/">Torna alla home</CTAButton>
            <CTAButton href="/#contatti" variant="ghost">
              Scrivici
            </CTAButton>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

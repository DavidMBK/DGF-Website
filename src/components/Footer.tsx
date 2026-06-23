"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowUp } from "lucide-react";
import { SELECT_SERVICE_EVENT } from "@/lib/scroll";

// I servizi vivono come tab nella home: il link porta a /#servizi e, se siamo
// già sulla home, l'evento attiva la tab giusta.
const SERVICE_LINKS = [
  { label: "Siti web", cardId: "svc-siti" },
  { label: "E-commerce", cardId: "svc-ecommerce" },
  { label: "UI / UX Design", cardId: "svc-uiux" },
  { label: "App & Software", cardId: "svc-software" },
  { label: "AI & Automazione", cardId: "svc-ai" },
  { label: "Consulenza", cardId: "svc-consulenza" },
] as const;

const EXPLORE_LINKS = [
  { label: "Portfolio", href: "/portfolio" },
  { label: "Chi siamo", href: "/chi-siamo" },
  { label: "Blog", href: "/blog" },
] as const;

const STUDIO_LINKS = [
  { label: "Come lavoriamo", href: "/#processo" },
  { label: "Contatti", href: "/#contatti" },
] as const;

function requestService(cardId: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(SELECT_SERVICE_EVENT, { detail: cardId }));
  }
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer data-nav-theme="dark" className="relative overflow-hidden bg-ink text-white/60">
      {/* hairline gradiente in cima (stesso stile delle altre sezioni) */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-cyan/40 to-transparent"
      />
      {/* bagliore d'atmosfera */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[820px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(21,117,164,0.22) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative mx-auto max-w-[1180px] px-6 pt-20 lg:pt-24">
        {/* ── Colonne ── */}
        <div className="grid grid-cols-1 gap-12 py-14 sm:grid-cols-2 md:grid-cols-[1.4fr_auto_auto_auto] md:gap-14">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link href="/" aria-label="DGF Tech Solutions — home" className="mb-6 inline-block">
              <Image
                src="/logo-dgf-trasparente.png"
                alt="DGF Tech Solutions"
                width={164}
                height={80}
                className="h-9 w-auto opacity-80 brightness-0 invert"
              />
            </Link>
            <p className="max-w-[280px] text-sm leading-relaxed">
              Software house con base a Messina. Diamo forma a prodotti digitali,
              dal primo schizzo fino al lancio.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.26em] text-white/70">
              <span className="h-px w-5 bg-brand-cyan/50" />
              Messina · in tutta Italia
            </div>
          </div>

          {/* Esplora */}
          <nav aria-label="Esplora">
            <h3 className="mb-5 inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.26em] text-brand-cyan">
              <span className="h-px w-5 bg-brand-cyan/50" />
              Esplora
            </h3>
            <ul className="space-y-3.5">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                    <ArrowUpRight
                      size={13}
                      strokeWidth={2}
                      className="-translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Servizi */}
          <nav aria-label="Servizi">
            <h3 className="mb-5 inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.26em] text-brand-cyan">
              <span className="h-px w-5 bg-brand-cyan/50" />
              Servizi
            </h3>
            <ul className="space-y-3.5">
              {SERVICE_LINKS.map((link) => (
                <li key={link.cardId}>
                  <Link
                    href="/#servizi"
                    onClick={() => requestService(link.cardId)}
                    className="group inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                    <ArrowUpRight
                      size={13}
                      strokeWidth={2}
                      className="-translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Studio */}
          <nav aria-label="Studio">
            <h3 className="mb-5 inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.26em] text-brand-cyan">
              <span className="h-px w-5 bg-brand-cyan/50" />
              Studio
            </h3>
            <ul className="space-y-3.5">
              {STUDIO_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                    <ArrowUpRight
                      size={13}
                      strokeWidth={2}
                      className="-translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* ── Barra inferiore ── */}
        <div className="flex flex-col items-start justify-between gap-4 border-t border-white/10 py-8 sm:flex-row sm:items-center">
          <p className="text-xs text-white/70" suppressHydrationWarning>
            {year} DGF Tech Solutions.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <p className="text-xs text-white/70">
              P.IVA 03882320835
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group inline-flex items-center gap-1.5 text-xs font-medium text-white/55 transition-colors duration-200 hover:text-white"
            >
              Torna su
              <span className="flex h-4 w-4 items-center justify-center rounded-full border border-white/20 transition-colors duration-300 group-hover:border-brand-cyan group-hover:text-brand-cyan">
                <ArrowUp size={10} strokeWidth={2.4} />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Firma wordmark gigante ── */}
      <div aria-hidden className="relative select-none overflow-hidden">
        <div
          className="whitespace-nowrap text-center font-display font-bold leading-none tracking-[-0.04em] text-transparent"
          style={{
            fontSize: "clamp(4rem, 19vw, 17rem)",
            WebkitTextStroke: "1px rgba(255,255,255,0.06)",
            marginBottom: "-0.18em",
          }}
        >
          DGF Tech Solutions
        </div>
      </div>
    </footer>
  );
}

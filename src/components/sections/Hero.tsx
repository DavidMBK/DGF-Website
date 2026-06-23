"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { scrollToSection } from "@/lib/scroll";
import { HeroBackground } from "@/components/HeroBackground";

const ease = [0.22, 1, 0.36, 1] as const;

// Prova/valori front-loaded vicino all'hero (impegni reali, non metriche inventate).
const HERO_PROOF = [
  { value: "Un solo interlocutore", label: "dall'idea al lancio" },
  { value: "Risposta in 24h", label: "a ogni nuova richiesta" },
  { value: "Codice di proprietà", label: "il progetto resta tuo" },
];

const TITLE_WORDS = [
  { text: "Costruiamo", blue: false },
  { text: "prodotti", blue: false },
  { text: "digitali", blue: false },
  { text: "che", blue: true },
  { text: "funzionano", blue: true },
  { text: "davvero.", blue: true },
];

const INTRO_DELAY = 1.4;

export function Hero() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section
      aria-labelledby="hero-heading"
      data-nav-theme="light"
      className="relative bg-canvas overflow-hidden min-h-screen-safe pt-[120px] pb-14 sm:pt-[150px] lg:pt-[180px] lg:pb-16"
    >
      <HeroBackground />

      <div className="relative z-10 max-w-[1100px] mx-auto px-6">
        <div className="flex flex-col items-center text-center max-w-[900px] mx-auto">
          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: INTRO_DELAY }}
            className="text-[11px] uppercase tracking-[0.22em] text-brand-blue font-semibold mb-8 inline-flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
            SOFTWARE HOUSE · MESSINA
          </motion.p>

          <h1
            id="hero-heading"
            className="font-display text-ink mb-10 max-w-[1000px]"
            style={{
              fontSize: "clamp(2.75rem, 7vw, 5.75rem)",
              fontWeight: 600,
              lineHeight: 1.02,
              letterSpacing: "-0.035em",
            }}
          >
            {TITLE_WORDS.map((word, i) => (
              <motion.span
                key={`${word.text}-${i}`}
                initial={
                  reducedMotion
                    ? false
                    : { opacity: 0, filter: "blur(14px)" }
                }
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{
                  duration: 0.85,
                  delay: INTRO_DELAY + 0.15 + i * 0.09,
                  ease,
                }}
                className="inline-block"
                style={{
                  marginRight: i < TITLE_WORDS.length - 1 ? "0.28em" : 0,
                  color: word.blue ? "#1575a4" : "#0a1428",
                }}
              >
                {word.text}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: INTRO_DELAY + 0.95 }}
            className="leading-relaxed text-[1.0625rem] sm:text-[1.1875rem] max-w-[600px] text-body"
          >
            Dall&apos;idea al lancio: siti, e-commerce, app e soluzioni AI su misura,
            costruiti da chi scrive davvero il codice.
          </motion.p>

          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: INTRO_DELAY + 1.2 }}
            className="mt-11 flex flex-col items-center gap-3 sm:flex-row"
          >
            <button
              type="button"
              onClick={() => scrollToSection("contatti")}
              className="group inline-flex items-center gap-2 rounded-full bg-brand-navy px-7 py-4 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(5,75,119,0.5)] transition-colors duration-200 hover:bg-brand-blue"
            >
              <span>Parliamo del tuo progetto</span>
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1"
              >
                →
              </span>
            </button>
            <Link
              href="/portfolio"
              className="group inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-semibold text-brand-navy ring-1 ring-brand-blue/20 transition-colors duration-200 hover:ring-brand-blue/40"
            >
              <span>Guarda i lavori</span>
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </motion.div>

          {/* Prova/valori front-loaded vicino all'hero */}
          <motion.dl
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: INTRO_DELAY + 1.45 }}
            className="mt-14 grid w-full max-w-[640px] grid-cols-1 gap-px overflow-hidden rounded-2xl bg-hairline/60 ring-1 ring-brand-blue/10 sm:grid-cols-3"
          >
            {HERO_PROOF.map((p) => (
              <div key={p.value} className="bg-canvas/90 px-5 py-5 text-center backdrop-blur-sm">
                <dt className="font-display text-[15px] font-semibold tracking-[-0.01em] text-brand-navy">
                  {p.value}
                </dt>
                <dd className="mt-1 text-[12.5px] leading-snug text-body">{p.label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>
    </section>
  );
}

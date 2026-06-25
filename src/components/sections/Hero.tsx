"use client";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { scrollToSection } from "@/lib/scroll";
import { HeroBackground } from "@/components/HeroBackground";

const ease = [0.22, 1, 0.36, 1] as const;

// Micro-firme di credibilità sotto le CTA: anteprima snella (il dettaglio
// completo vive nella sezione "Garanzie").
const HERO_SIGNALS = [
  "Codice di tua proprietà",
  "Stack moderno e manutenibile",
  "Supporto dopo il lancio",
];

const TITLE_WORDS = [
  { text: "Costruiamo", blue: false },
  { text: "prodotti", blue: false },
  { text: "digitali", blue: false },
  { text: "che", blue: true },
  { text: "funzionano", blue: true },
  { text: "davvero.", blue: true },
];

// L'intro è un video a schermo intero separato: l'hero fa una cascata d'entrata
// rapida ed elegante (è già pronto dietro l'overlay quando il video termina).
const INTRO_DELAY = 0.15;

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
            className="eyebrow mb-8 inline-flex items-center gap-2.5"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-cyan opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-blue" />
            </span>
            Software House · Messina
          </motion.p>

          <h1
            id="hero-heading"
            className="display-2xl text-ink mb-10 max-w-[1000px]"
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
            transition={{ duration: 0.7, ease, delay: INTRO_DELAY + 0.55 }}
            className="lead max-w-[600px]"
          >
            Dall&apos;idea al lancio: siti, e-commerce, app e soluzioni AI su misura,
            costruiti da chi scrive davvero il codice.
          </motion.p>

          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: INTRO_DELAY + 0.7 }}
            className="mt-11 flex flex-col items-center gap-3 sm:flex-row"
          >
            <button
              type="button"
              onClick={() => scrollToSection("contatti")}
              className="group inline-flex items-center gap-2 rounded-full bg-brand-navy px-7 py-4 text-sm font-semibold text-white shadow-brand transition-colors duration-200 hover:bg-brand-blue"
            >
              <span>Parliamo del tuo progetto</span>
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1"
              >
                →
              </span>
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("servizi")}
              className="group inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-semibold text-brand-navy ring-1 ring-brand-blue/20 transition-colors duration-200 hover:ring-brand-blue/40"
            >
              <span>Scopri cosa facciamo</span>
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1"
              >
                →
              </span>
            </button>
          </motion.div>

          {/* Micro-firme di credibilità: piccoli check sotto le CTA. */}
          <motion.ul
            initial={reducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: INTRO_DELAY + 0.8 }}
            className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5"
          >
            {HERO_SIGNALS.map((s) => (
              <li key={s} className="inline-flex items-center gap-2 text-[13px] font-medium text-ink-soft">
                <svg
                  aria-hidden
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-brand-cyan"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                {s}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}

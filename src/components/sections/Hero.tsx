"use client";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { scrollToSection } from "@/lib/scroll";
import { HeroBackground } from "@/components/HeroBackground";

const ease = [0.22, 1, 0.36, 1] as const;

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
            className="leading-relaxed text-[1.0625rem] sm:text-[1.125rem] max-w-[560px] text-body"
          >
            Siti, e-commerce, app e soluzioni AI su misura. Dietro ogni
            progetto trovi sempre chi lo progetta e ne scrive il codice.
          </motion.p>

          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: INTRO_DELAY + 1.2 }}
            className="mt-12"
          >
            <button
              type="button"
              onClick={() => scrollToSection("contatti")}
              className="group inline-flex items-center gap-2 px-7 py-4 bg-brand-navy text-white text-sm font-semibold rounded-full hover:bg-brand-blue transition-colors duration-200 shadow-[0_8px_24px_-8px_rgba(5,75,119,0.5)]"
            >
              <span>Richiedi una consulenza gratuita</span>
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1"
              >
                →
              </span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

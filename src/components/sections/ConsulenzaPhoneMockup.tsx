"use client";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { scrollToSection } from "@/lib/scroll";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const ease = [0.22, 1, 0.36, 1] as const;

interface Bubble {
  from: "them" | "me";
  text: string;
}

const MESSAGES: readonly Bubble[] = [
  { from: "them", text: "Ciao! Parlaci del tuo progetto." },
  { from: "me", text: "Vorrei un sito nuovo con qualche integrazione AI." },
  { from: "them", text: "Perfetto, possiamo aiutarti. Una call domani?" },
  { from: "me", text: "Sì, alle 15." },
] as const;

/**
 * Mockup telefono nativo per mobile: riprende lo stato finale del morph desktop
 * (laptop → telefono) con la chat che compare bolla dopo bolla quando la sezione
 * entra in viewport. Niente scroll-jack, leggero e adatto allo schermo piccolo.
 */
export function ConsulenzaPhoneMockup() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-[260px]">
      {/* Bagliore d'atmosfera dietro al telefono */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 scale-125 rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(80,170,230,0.35) 0%, rgba(21,117,164,0.12) 45%, transparent 72%)",
          filter: "blur(36px)",
        }}
      />

      {/* Scocca */}
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 28, scale: 0.96 }}
        whileInView={reducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease }}
        className="relative rounded-[2.4rem] bg-[#0e3a5f] p-2.5 shadow-[0_40px_80px_-30px_rgba(10,20,40,0.6)]"
      >
        {/* Notch */}
        <div className="absolute left-1/2 top-3 z-30 h-5 w-20 -translate-x-1/2 rounded-full bg-black/90" />

        {/* Schermo */}
        <div className="relative flex flex-col rounded-[1.9rem] bg-[#0e3a5f] px-3.5 pb-3.5 pt-8">
          {/* Status bar */}
          <div className="mb-3 flex items-center justify-between px-1 text-[10px] font-semibold text-white/85">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-white/70" />
              <span className="h-1 w-1 rounded-full bg-white/70" />
              <span className="h-1 w-1 rounded-full bg-white/70" />
              <span className="ml-1 h-2 w-3 rounded-sm border border-white/60" />
            </div>
          </div>

          {/* Header chat */}
          <div className="flex items-center gap-3 border-b border-white/10 pb-3">
            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-cyan to-brand-blue text-[12px] font-bold text-white">
                D
              </div>
              <span className="absolute -bottom-px -right-px h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0e3a5f]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-semibold text-white">
                DGF Tech Solutions
              </div>
              <div className="text-[10px] text-emerald-300/90">attivo ora</div>
            </div>
          </div>

          {/* Conversazione — le bolle compaiono in sequenza */}
          <motion.div
            initial={reducedMotion ? false : "hidden"}
            whileInView={reducedMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.4 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.5, delayChildren: 0.4 } },
            }}
            className="flex flex-col gap-2 py-3.5"
          >
            {MESSAGES.map((m, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 8, scale: 0.96 },
                  visible: { opacity: 1, y: 0, scale: 1 },
                }}
                transition={{ duration: 0.4, ease }}
                className={
                  m.from === "me"
                    ? "self-end max-w-[80%] rounded-2xl rounded-br-md bg-white px-3 py-2 text-[11.5px] leading-[1.45] text-brand-navy"
                    : "self-start max-w-[80%] rounded-2xl rounded-bl-md bg-white/10 px-3 py-2 text-[11.5px] leading-[1.45] text-white ring-1 ring-white/10"
                }
              >
                {m.text}
              </motion.div>
            ))}

            {/* Indicatore "sta scrivendo" */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 8 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4, ease }}
              className="self-start flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-white/10 px-3 py-2.5 ring-1 ring-white/10"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/70" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/70 [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/70 [animation-delay:300ms]" />
            </motion.div>
          </motion.div>

          {/* Barra input */}
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 ring-1 ring-white/15">
            <span className="flex-1 truncate text-[11px] text-white/45">
              Scrivi un messaggio…
            </span>
            <button
              type="button"
              onClick={() => scrollToSection("contatti")}
              aria-label="Invia"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-brand-navy transition-transform duration-300 hover:scale-105"
            >
              <ArrowUpRight size={13} strokeWidth={2.4} />
            </button>
          </div>

          {/* Home indicator */}
          <div className="mx-auto mt-3 h-1 w-24 rounded-full bg-white/30" />
        </div>
      </motion.div>
    </div>
  );
}

"use client";
import { useRef, useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  MotionValue,
} from "framer-motion";
import { ArrowUpRight, Clock, MessageSquare, Code2 } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsMobile } from "@/hooks/useIsMobile";
import { scrollToSection } from "@/lib/scroll";

const ease = [0.22, 1, 0.36, 1] as const;

interface Feature {
  icon: typeof Clock;
  title: string;
  body: string;
  short: string;
}

const FEATURES: readonly Feature[] = [
  {
    icon: Clock,
    title: "Risposta entro 24 ore",
    body:
      "Ti rispondiamo sempre con un primo riscontro, anche solo per dirti se possiamo aiutarti.",
    short: "Risposta in 24h",
  },
  {
    icon: MessageSquare,
    title: "Primo confronto gratuito",
    body:
      "Una call iniziale per chiarire obiettivi, vincoli e fattibilità. Senza impegno.",
    short: "Call iniziale gratuita",
  },
  {
    icon: Code2,
    title: "Contatto diretto con chi sviluppa",
    body:
      "Parli con chi progetta e scrive il codice, non con un commerciale di passaggio.",
    short: "Parli con chi sviluppa",
  },
] as const;

const LAPTOP_W = 980;
const LAPTOP_H = 600;
const PHONE_W = 340;
const PHONE_H = 700;

// Versione compatta per mobile: laptop più piccolo (landscape) con contenuto
// semplificato e telefono che riempie bene lo schermo, così la trasformazione
// resta chiara e leggibile anche in verticale.
const LAPTOP_W_M = 440;
const LAPTOP_H_M = 280;
const PHONE_W_M = 320;
const PHONE_H_M = 640;

// Animation timing: 0 = section top hits viewport top (sticky engaged, laptop centered).
// 1 = section bottom hits viewport bottom (sticky releases).
// Morph happens fully within the sticky range, starting only after a short hold.
const HOLD_END = 0.18; // laptop stays still until this progress
const MORPH_END = 0.78; // phone is final by this progress
const FADE_START = 0.38;
const FADE_END = 0.58;

interface DeviceProps {
  progress: MotionValue<number>;
  reducedMotion: boolean;
  /** Scala del dispositivo nello stato laptop (1 = nessuna scala, su desktop). */
  fitLaptop: number;
  /** Scala del dispositivo nello stato telefono (1 = nessuna scala, su desktop). */
  fitPhone: number;
  /** Su mobile usa dimensioni ridotte e contenuto laptop semplificato. */
  compact: boolean;
}

function Device({ progress, reducedMotion, fitLaptop, fitPhone, compact }: DeviceProps) {
  // Dimensioni "di progetto": su mobile più piccole, così il contenuto
  // semplificato resta leggibile una volta scalato per stare nello schermo.
  const LW = compact ? LAPTOP_W_M : LAPTOP_W;
  const LH = compact ? LAPTOP_H_M : LAPTOP_H;
  const PW = compact ? PHONE_W_M : PHONE_W;
  const PH = compact ? PHONE_H_M : PHONE_H;
  const width = useTransform(progress, [HOLD_END, MORPH_END], [LW, PW]);
  const height = useTransform(progress, [HOLD_END, MORPH_END], [LH, PH]);
  const frameRadius = useTransform(progress, [HOLD_END, MORPH_END], [14, 44]);
  const screenRadius = useTransform(progress, [HOLD_END, MORPH_END], [6, 30]);
  const framePadding = useTransform(progress, [HOLD_END, MORPH_END], [14, 11]);

  const frameBg = useTransform(
    progress,
    [HOLD_END, MORPH_END],
    ["#0e3a5f", "#ffffff"]
  );
  const screenBg = useTransform(
    progress,
    [HOLD_END, MORPH_END],
    ["#ffffff", "#0e3a5f"]
  );

  // Laptop base (keyboard wedge) fades out as morph completes.
  const baseOpacity = useTransform(
    progress,
    [HOLD_END, FADE_START],
    [1, 0]
  );
  const baseColor = useTransform(
    progress,
    [HOLD_END, MORPH_END],
    ["#0a2e4d", "#e8eef4"]
  );

  // Notch fades in near end.
  const notchOpacity = useTransform(progress, [0.65, MORPH_END], [0, 1]);

  // Content crossfade: laptop content visible at start, phone content visible at end.
  const laptopOpacity = useTransform(progress, [HOLD_END, FADE_START, FADE_END], [1, 1, 0]);
  const phoneOpacity = useTransform(progress, [FADE_START, FADE_END, MORPH_END], [0, 1, 1]);

  // Halo behind device.
  const haloOpacity = useTransform(progress, [0, 0.5, 1], [0.35, 0.7, 0.4]);

  // Scala l'intero dispositivo per stare nello schermo: su mobile parte piccolo
  // (laptop largo 980px) e "zooma" fino a un telefono di dimensione comoda.
  // Su desktop fitLaptop = fitPhone = 1 → nessuna scala, comportamento invariato.
  const stageScale = useTransform(progress, [HOLD_END, MORPH_END], [fitLaptop, fitPhone]);

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <motion.div
        style={{ scale: stageScale }}
        className="relative flex items-center justify-center"
      >
      <motion.div
        aria-hidden
        style={{ opacity: reducedMotion ? 0.5 : haloOpacity }}
        className="pointer-events-none absolute h-[620px] w-[620px] rounded-full"
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background:
              "radial-gradient(circle at center, rgba(80,170,230,0.4) 0%, rgba(21,117,164,0.15) 40%, transparent 72%)",
            filter: "blur(45px)",
          }}
        />
      </motion.div>

      <div className="relative flex flex-col items-center">
        <motion.div
          style={{
            width,
            height,
            borderRadius: frameRadius,
            padding: framePadding,
            background: frameBg,
            boxShadow:
              "0 50px 90px -30px rgba(10,20,40,0.55), 0 18px 40px -18px rgba(10,20,40,0.35)",
          }}
          className="relative transition-colors"
        >
          {/* Phone notch */}
          <motion.div
            aria-hidden
            style={{ opacity: notchOpacity }}
            className="absolute left-1/2 top-3 z-30 h-5 w-24 -translate-x-1/2 rounded-full bg-black/90"
          />

          {/* Laptop webcam dot */}
          <motion.div
            aria-hidden
            style={{ opacity: useTransform(progress, [HOLD_END, FADE_START], [1, 0]) }}
            className="absolute left-1/2 top-[6px] z-30 h-1 w-1 -translate-x-1/2 rounded-full bg-white/50"
          />

          {/* Screen */}
          <motion.div
            style={{
              background: screenBg,
              borderRadius: screenRadius,
            }}
            className="relative h-full w-full overflow-hidden"
          >
            {/* LAPTOP CONTENT */}
            <motion.div
              style={{ opacity: laptopOpacity }}
              className="absolute inset-0 flex flex-col"
              aria-hidden={false}
            >
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-slate-200/80 bg-slate-50/60 px-4 py-2.5">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                </div>
                <div
                  className={`mx-auto flex h-5 items-center justify-center rounded-md bg-white text-[10px] font-medium text-slate-400 ring-1 ring-slate-200/70 ${compact ? "w-40" : "w-56"}`}
                >
                  {compact ? "dgftechsolutions.com" : "dgftechsolutions.com / consulenza"}
                </div>
              </div>

              {compact ? (
                /* Mobile: contenuto essenziale, grande e leggibile */
                <div className="flex flex-1 flex-col justify-center px-6 py-6">
                  <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-brand-blue/85">
                    <span className="h-px w-5 bg-brand-blue/60" />
                    Consulenza
                  </div>
                  <h3 className="mt-3 font-display text-[26px] font-semibold leading-[1.08] tracking-[-0.03em] text-ink">
                    Parliamo del tuo progetto,{" "}
                    <span className="bg-gradient-to-br from-brand-blue to-brand-cyan bg-clip-text text-transparent italic">
                      davvero.
                    </span>
                  </h3>
                  <p className="mt-3 text-[13px] leading-[1.5] text-body/90">
                    Prima del codice mettiamo a fuoco obiettivi e priorità.
                  </p>
                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={() => scrollToSection("contatti")}
                      className="inline-flex items-center gap-2 rounded-full bg-brand-navy px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_12px_28px_-10px_rgba(10,30,60,0.5)]"
                    >
                      Richiedi una call
                      <span
                        aria-hidden
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15"
                      >
                        <ArrowUpRight size={12} strokeWidth={2.2} />
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
              /* Desktop: contenuto completo */
              <div className="flex flex-1 flex-col px-10 pt-8 pb-7">
                <div className="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.32em] text-brand-blue/85">
                  <span className="h-px w-6 bg-brand-blue/60" />
                  Consulenza
                </div>

                <h3 className="mt-3 font-display text-[40px] font-semibold leading-[1.02] tracking-[-0.035em] text-ink">
                  Parliamo del tuo progetto,{" "}
                  <span className="bg-gradient-to-br from-brand-blue to-brand-cyan bg-clip-text text-transparent italic">
                    davvero.
                  </span>
                </h3>

                <p className="mt-4 max-w-[60ch] text-[14.5px] leading-[1.6] text-body/90">
                  Prima di scrivere una riga di codice, mettiamo a fuoco obiettivi,
                  vincoli e priorità. Niente tecnicismi inutili, niente fretta:
                  prima la direzione giusta, poi il codice.
                </p>

                <div className="mt-6 grid grid-cols-3 gap-4">
                  {FEATURES.map((f) => {
                    const Icon = f.icon;
                    return (
                      <div
                        key={f.title}
                        className="rounded-xl border border-hairline bg-white p-4 shadow-[0_4px_14px_-8px_rgba(20,40,80,0.18)]"
                      >
                        <span className="mb-2.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue">
                          <Icon size={15} strokeWidth={1.8} />
                        </span>
                        <h4 className="font-display text-[12.5px] font-semibold leading-tight tracking-[-0.005em] text-ink">
                          {f.title}
                        </h4>
                        <p className="mt-1.5 text-[11px] leading-[1.5] text-body/80">
                          {f.body}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-auto pt-5">
                  <button
                    type="button"
                    onClick={() => scrollToSection("contatti")}
                    className="group inline-flex items-center gap-2.5 rounded-full bg-brand-navy px-6 py-3 text-[13.5px] font-semibold text-white shadow-[0_12px_28px_-10px_rgba(10,30,60,0.5)] transition-all duration-300 hover:bg-brand-blue hover:-translate-y-0.5"
                  >
                    Richiedi una call
                    <span
                      aria-hidden
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15 transition-transform duration-500 group-hover:rotate-45"
                    >
                      <ArrowUpRight size={12} strokeWidth={2.2} />
                    </span>
                  </button>
                </div>
              </div>
              )}
            </motion.div>

            {/* PHONE CONTENT — narrative continuation: the conversation begins */}
            <motion.div
              style={{ opacity: phoneOpacity }}
              className="absolute inset-0 flex flex-col px-4 pb-4 pt-9"
              aria-hidden={false}
            >
              {/* Status bar */}
              <div className="mb-3 flex items-center justify-between px-2 text-[10px] font-semibold text-white/85">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-white/70" />
                  <span className="h-1 w-1 rounded-full bg-white/70" />
                  <span className="h-1 w-1 rounded-full bg-white/70" />
                  <span className="ml-1 h-2 w-3 rounded-sm border border-white/60" />
                </div>
              </div>

              {/* Chat header */}
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
                  <div className="text-[10px] text-emerald-300/90">
                    attivo ora
                  </div>
                </div>
              </div>

              {/* Conversation */}
              <div className="flex flex-1 flex-col gap-2 overflow-hidden py-3.5">
                <div className="self-start max-w-[78%] rounded-2xl rounded-bl-md bg-white/10 px-3 py-2 text-[11.5px] leading-[1.45] text-white ring-1 ring-white/10">
                  Ciao! Parlaci del tuo progetto.
                </div>
                <div className="self-end max-w-[78%] rounded-2xl rounded-br-md bg-white px-3 py-2 text-[11.5px] leading-[1.45] text-brand-navy">
                  Vorrei un sito nuovo con qualche integrazione AI.
                </div>
                <div className="self-start max-w-[80%] rounded-2xl rounded-bl-md bg-white/10 px-3 py-2 text-[11.5px] leading-[1.45] text-white ring-1 ring-white/10">
                  Perfetto, possiamo aiutarti. Ti torna comodo una call domani?
                </div>
                <div className="self-end max-w-[60%] rounded-2xl rounded-br-md bg-white px-3 py-2 text-[11.5px] leading-[1.45] text-brand-navy">
                  Sì, alle 15.
                </div>
                <div className="self-start flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-white/10 px-3 py-2.5 ring-1 ring-white/10">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/70" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/70 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/70 [animation-delay:300ms]" />
                </div>
              </div>

              {/* Input bar */}
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
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Laptop base: hinge + keyboard wedge */}
        <motion.div
          aria-hidden
          style={{ opacity: baseOpacity }}
          className="relative flex flex-col items-center"
        >
          {/* Hinge line */}
          <div className="h-1 w-[100px] rounded-b-full bg-black/30" />
          {/* Wedge base */}
          <motion.div
            style={{ background: baseColor, width: compact ? LAPTOP_W_M + 24 : 1040 }}
            className="relative mt-px h-3.5 rounded-b-[14px] shadow-[0_10px_22px_-10px_rgba(0,0,0,0.45)]"
          >
            {/* Trackpad indication */}
            <div className="mx-auto mt-[3px] h-1.5 w-28 rounded-full bg-black/15" />
          </motion.div>
        </motion.div>
      </div>
      </motion.div>
    </div>
  );
}

export function Consulenza() {
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const scrollYProgress = useMotionValue(0);
  // Quanto scalare il dispositivo per stare nello schermo. Su desktop lo spazio
  // è abbondante e restano entrambi a 1 (nessuna scala); su mobile diventano <1.
  const [fit, setFit] = useState({ laptop: 1, phone: 1 });

  useEffect(() => {
    function measure() {
      const el = stageRef.current;
      const availW = el ? el.clientWidth : window.innerWidth;
      const availH = window.innerHeight * 0.82;
      const lw = isMobile ? LAPTOP_W_M : LAPTOP_W;
      const pw = isMobile ? PHONE_W_M : PHONE_W;
      const ph = isMobile ? PHONE_H_M : PHONE_H;
      const laptop = Math.min(1, (availW - 24) / lw);
      const phone = Math.min(1, (availW - 24) / pw, availH / ph);
      setFit({ laptop, phone });
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [isMobile]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let rafId = 0;
    let running = false;

    function update() {
      const node = sectionRef.current;
      if (node) {
        const rect = node.getBoundingClientRect();
        const total = node.offsetHeight - window.innerHeight;
        if (total > 0) {
          const p = Math.max(0, Math.min(1, -rect.top / total));
          scrollYProgress.set(p);
        }
      }
      rafId = requestAnimationFrame(update);
    }

    // Il loop gira solo quando la sezione è (quasi) a schermo: evita lavoro
    // continuo a 60fps quando non serve, risparmiando CPU/batteria su mobile.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          rafId = requestAnimationFrame(update);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(rafId);
        }
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [scrollYProgress]);

  return (
    <section
      ref={sectionRef}
      id="consulenza"
      aria-labelledby="consulenza-heading"
      className="relative"
      style={{
        background:
          "linear-gradient(180deg, #f5f8fb 0%, #e8f0f7 35%, #cfe0ee 70%, #0e3a5f 100%)",
      }}
    >
      {/* Sentinelle per il tema della navbar: lo sfondo è chiaro in alto e diventa
          navy in fondo (transizione verso Process). La sentinella scura copre
          l'ultimo tratto così il menù passa a "scuro" al momento giusto. */}
      <div aria-hidden data-nav-theme="light" className="pointer-events-none absolute inset-x-0 top-0 bottom-[30%]" />
      <div aria-hidden data-nav-theme="dark" className="pointer-events-none absolute inset-x-0 top-[70%] bottom-0" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-cyan/30 to-transparent"
      />

      <h2 id="consulenza-heading" className="sr-only">
        Consulenza — Parliamo del tuo progetto, davvero.
      </h2>

      {/* Morph laptop → telefono guidato dallo scroll. Su desktop a dimensione
          piena; su mobile il dispositivo viene scalato per stare nello schermo. */}
      <div
        ref={stageRef}
        className="relative mx-auto max-w-[1400px] px-4 sm:px-6 min-h-[280vh] lg:min-h-[300vh]"
      >
        <div className="sticky top-0 flex h-screen-safe items-center justify-center overflow-hidden py-8">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 30 }}
            whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease }}
            className="flex w-full items-center justify-center"
          >
            <Device
              progress={scrollYProgress}
              reducedMotion={reducedMotion}
              fitLaptop={fit.laptop}
              fitPhone={fit.phone}
              compact={isMobile}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

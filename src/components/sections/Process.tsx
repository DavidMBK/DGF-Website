"use client";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsMobile } from "@/hooks/useIsMobile";

// Mixkit free stock clips (commercial use), self-hosted da /public/videos per
// togliere la dipendenza dalla CDN esterna e servirli same-origin (cache +
// affidabilità). 360p tiene leggera la sezione; suona solo la fase attiva.
const clip = (id: number) => `/videos/${id}-360.mp4`;

const STEPS = [
  {
    num: "01",
    title: "Scoperta",
    body: "Ascoltiamo le tue esigenze, analizziamo il contesto e definiamo insieme obiettivi e priorità.",
    video: clip(4809),
    videoAlt: "Team in riunione di lavoro",
  },
  {
    num: "02",
    title: "Proposta",
    body: "Tempi, costi e stack tecnologico nero su bianco. Tutto concordato prima di iniziare.",
    video: clip(4547),
    videoAlt: "Persone in riunione attorno a un tavolo",
  },
  {
    num: "03",
    title: "Sviluppo",
    body: "Cicli brevi e aggiornamenti frequenti. Vedi i progressi in tempo reale sul repository.",
    video: clip(4907),
    videoAlt: "Mani che digitano su un computer",
  },
  {
    num: "04",
    title: "Lancio",
    body: "Deploy in produzione e supporto continuativo. Rimaniamo al tuo fianco anche dopo il go-live.",
    video: clip(918),
    videoAlt: "Ufficio operativo al lavoro",
  },
] as const;

const BG_GRADIENTS = [
  "linear-gradient(135deg, #061a2b 0%, #0a3554 100%)",
  "linear-gradient(135deg, #0a3554 0%, #0e547f 100%)",
  "linear-gradient(135deg, #0e547f 0%, #1575a4 100%)",
  "linear-gradient(135deg, #1575a4 0%, #3d9cc7 100%)",
];

interface VideoFrameProps {
  src: string;
  alt: string;
  videoRef?: React.Ref<HTMLVideoElement>;
  autoPlay?: boolean;
  reducedMotion?: boolean;
}

// Framed clip styled to match the cyan ServiceVisuals frames: navy field,
// inset cyan ring, faint grid texture, and a navy tint over a slightly
// desaturated video so footage reads as part of the brand system, not raw stock.
function VideoFrame({ src, alt, videoRef, autoPlay, reducedMotion }: VideoFrameProps) {
  return (
    <div className="group relative aspect-video w-full overflow-hidden rounded-2xl bg-brand-navy">
      <video
        ref={videoRef}
        // #t pins a poster frame for the paused/reduced-motion state.
        src={reducedMotion ? `${src}#t=1.5` : src}
        aria-label={alt}
        muted
        loop
        playsInline
        autoPlay={!reducedMotion && autoPlay}
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: "saturate(0.82) contrast(1.04) brightness(0.92)" }}
      />

      {/* Navy tint — top-down + cyan wash from the corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(6,26,43,0.18) 0%, rgba(6,26,43,0.04) 45%, rgba(6,26,43,0.55) 100%), radial-gradient(120% 90% at 12% 8%, rgba(61,156,199,0.22) 0%, transparent 55%)",
        }}
      />

      {/* Faint tech grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "linear-gradient(rgba(214,239,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(214,239,255,1) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />

      {/* Inset ring */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-brand-cyan/20"
      />

      {/* Corner index marker */}
      <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan" style={{ filter: "drop-shadow(0 0 6px rgba(125,200,230,0.8))" }} />
        <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/70">DGF · live</span>
      </div>
    </div>
  );
}

const PHASE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// L'ultimo pallino (Lancio) viene raggiunto a questa frazione di scroll; il
// tratto restante [HOLD_LAST → 1] tiene l'ultima fase a schermo. Così barra,
// pallini e testo cambiano esattamente nello stesso istante.
const HOLD_LAST = 0.85;

interface PhaseBackgroundProps {
  src: string;
  alt: string;
  active: boolean;
  fast?: boolean;
}

// Full-bleed background clip for a single phase. Only the active clip plays and
// is opaque; the others fade to 0 and pause, so one video decodes at a time.
// The idle 1.06 scale settling to 1 gives a slow Ken Burns-style push-in.
// `fast` (mobile) accorcia il crossfade così lo stacco tra le fasi è netto.
function PhaseBackground({ src, alt, active, fast }: PhaseBackgroundProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (active) void el.play().catch(() => {});
    else el.pause();
  }, [active]);

  return (
    <motion.div
      aria-hidden={!active}
      className="absolute inset-0 overflow-hidden"
      initial={false}
      animate={{ opacity: active ? 1 : 0, scale: active ? 1 : fast ? 1 : 1.06 }}
      transition={{ duration: fast ? 0.32 : 1.1, ease: PHASE_EASE }}
    >
      <video
        ref={ref}
        src={src}
        aria-label={alt}
        muted
        loop
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
        style={{ filter: "saturate(0.62) brightness(0.46) contrast(1.06)" }}
      />
    </motion.div>
  );
}

interface StepMarkerProps {
  step: (typeof STEPS)[number];
  index: number;
  total: number;
  active: number;
  reducedMotion: boolean;
}

function StepMarker({
  step,
  index,
  total,
  active,
  reducedMotion,
}: StepMarkerProps) {
  const center = total > 1 ? index / (total - 1) : 0;
  const leftPct = center * 100;
  const isActive = index === active;

  // Le etichette agli estremi (prima/ultima) vengono ancorate verso l'interno,
  // così su mobile non sforano i bordi dello schermo. I punti restano allineati.
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const alignClass = isFirst ? "items-start" : isLast ? "items-end" : "items-center";
  const wrapperTransform = isFirst
    ? "translateX(0)"
    : isLast
      ? "translateX(-100%)"
      : "translateX(-50%)";
  const labelAlign = isFirst ? "text-left" : isLast ? "text-right" : "text-center";

  return (
    <div
      className={`absolute top-0 flex flex-col ${alignClass}`}
      style={{ left: `${leftPct}%`, transform: wrapperTransform }}
    >
      <motion.div
        className="-mt-[5px] h-3 w-3 rounded-full bg-white"
        initial={false}
        animate={
          reducedMotion
            ? { opacity: 1, scale: 1 }
            : { opacity: isActive ? 1 : 0.4, scale: isActive ? 1.45 : 1 }
        }
        transition={{ duration: 0.3, ease: PHASE_EASE }}
        style={{ filter: "drop-shadow(0 0 10px rgba(125,200,230,0.7))" }}
      />
      <motion.p
        className={`mt-5 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.16em] text-white sm:text-[10px] sm:tracking-[0.22em] ${labelAlign}`}
        initial={false}
        animate={{ opacity: reducedMotion ? 1 : isActive ? 1 : 0.5 }}
        transition={{ duration: 0.3, ease: PHASE_EASE }}
      >
        {step.title}
      </motion.p>
    </div>
  );
}

interface ProgressBarProps {
  steps: typeof STEPS;
  scrollYProgress: MotionValue<number>;
  active: number;
  reducedMotion: boolean;
}

function ProgressBar({
  steps,
  scrollYProgress,
  active,
  reducedMotion,
}: ProgressBarProps) {
  const barWidth = useTransform(scrollYProgress, [0, HOLD_LAST], ["0%", "100%"]);

  return (
    <div className="relative">
      <div className="relative h-[2px] w-full rounded-full bg-white/15">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 h-full origin-left rounded-full"
          style={{
            width: reducedMotion ? "100%" : barWidth,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(61,156,199,0.9) 50%, rgba(170,225,245,0.9) 100%)",
            filter: "blur(8px)",
            opacity: 0.85,
          }}
        />
        <motion.div
          className="absolute left-0 top-0 h-full origin-left rounded-full"
          style={{
            width: reducedMotion ? "100%" : barWidth,
            background:
              "linear-gradient(90deg, #1575a4 0%, #3d9cc7 55%, #d6efff 100%)",
          }}
        />
      </div>

      <div className="relative h-16">
        {steps.map((step, i) => (
          <StepMarker
            key={step.num}
            step={step}
            index={i}
            total={steps.length}
            active={active}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>
    </div>
  );
}

function StaticFallback() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-32">
      <div className="mb-14">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-brand-cyan">
          Come lavoriamo
        </p>
        <h2
          id="processo-heading"
          className="mt-2 font-display text-[clamp(2rem,3.5vw,2.75rem)] font-semibold tracking-[-0.025em] text-white"
        >
          Il nostro processo
        </h2>
      </div>
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step) => (
          <div key={step.num}>
            <VideoFrame src={step.video} alt={step.videoAlt} reducedMotion />
            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.22em] text-brand-cyan">
              Fase {step.num} &mdash; 04
            </p>
            <h3 className="mt-3 font-display text-2xl font-semibold tracking-[-0.025em] text-white">
              {step.title}
            </h3>
            <p className="mt-3 leading-relaxed text-white/85">{step.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Process() {
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Snap the active phase to the nearest progress marker so text + background
  // change in lockstep with the timeline dots below.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    // La fase scatta quando la barra raggiunge il pallino: stessa mappatura
    // della barra (clamp a HOLD_LAST), così testo e milestone sono sincronizzati.
    const frac = Math.min(1, v / HOLD_LAST);
    const next = Math.min(
      STEPS.length - 1,
      Math.max(0, Math.floor(frac * (STEPS.length - 1) + 1e-6)),
    );
    setActive((prev) => (prev === next ? prev : next));
  });

  const step = STEPS[active];

  const bg = useTransform(
    scrollYProgress,
    [0, 0.33, 0.66, 1],
    BG_GRADIENTS
  );

  return (
    <section
      ref={sectionRef}
      id="processo"
      aria-labelledby="processo-heading"
      data-nav-theme="dark"
      className="relative bg-brand-navy"
      style={{ height: reducedMotion ? "auto" : "500vh" }}
    >
      <div
        className={[
          "relative overflow-hidden",
          reducedMotion ? "" : "sticky top-0 h-screen",
        ].join(" ")}
      >
        {/* Base navy field — visible before the first clip paints */}
        <motion.div
          aria-hidden
          className="absolute inset-0"
          style={{ background: reducedMotion ? BG_GRADIENTS[2] : bg }}
        />

        {reducedMotion ? (
          <StaticFallback />
        ) : (
          <>
            {/* One full-bleed background clip per phase */}
            {STEPS.map((s, i) => (
              <PhaseBackground
                key={s.num}
                src={s.video}
                alt={s.videoAlt}
                active={active === i}
                fast={isMobile}
              />
            ))}

            {/* Left-weighted navy wash keeps the copy legible over footage */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(6,26,43,0.95) 0%, rgba(6,26,43,0.8) 32%, rgba(6,26,43,0.32) 64%, rgba(6,26,43,0.6) 100%)",
              }}
            />
            {/* Top + bottom fade so the section blends with its neighbours */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(6,26,43,0.88) 0%, rgba(6,26,43,0.08) 24%, rgba(6,26,43,0.12) 66%, rgba(6,26,43,0.92) 100%)",
              }}
            />
            {/* Cyan atmosphere + vignette */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 80% at 6% 50%, rgba(61,156,199,0.18) 0%, transparent 55%), radial-gradient(ellipse 78% 62% at center, transparent 0%, rgba(0,0,0,0.42) 100%)",
              }}
            />
            {/* Faint tech grid over the footage */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-overlay"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(214,239,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(214,239,255,1) 1px, transparent 1px)",
                backgroundSize: "46px 46px",
                maskImage:
                  "linear-gradient(180deg, transparent 0%, #000 18%, #000 82%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(180deg, transparent 0%, #000 18%, #000 82%, transparent 100%)",
              }}
            />

            {/* Header */}
            <div className="absolute left-1/2 top-10 z-10 -translate-x-1/2 px-6 text-center sm:top-14">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/65">
                Come lavoriamo
              </p>
              <h2
                id="processo-heading"
                className="mt-2 font-display text-[clamp(1.25rem,2vw,1.625rem)] font-medium tracking-[-0.02em] text-white"
              >
                Il nostro processo
              </h2>
            </div>

            {/* Foreground phase copy — exactly one phase on screen at a time */}
            <div className="absolute inset-0 z-10 flex items-center">
              <div className="mx-auto w-full max-w-[1180px] px-6 sm:px-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step.num}
                    initial={isMobile ? { opacity: 0 } : { opacity: 0, y: 28 }}
                    animate={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
                    exit={isMobile ? { opacity: 0 } : { opacity: 0, y: -22 }}
                    transition={{ duration: isMobile ? 0.18 : 0.5, ease: PHASE_EASE }}
                    className="max-w-[620px]"
                  >
                    <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.34em] text-brand-cyan">
                      Fase {step.num} <span className="text-white/40">/ 04</span>
                    </p>
                    <h3
                      className="font-display font-semibold text-white"
                      style={{
                        fontSize: "clamp(3rem, 8vw, 6rem)",
                        lineHeight: 0.95,
                        letterSpacing: "-0.04em",
                        textShadow: "0 6px 50px rgba(0,0,0,0.5)",
                      }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="mt-6 max-w-[480px] text-[1.0625rem] leading-[1.65] text-white/85 sm:text-[1.1875rem]"
                      style={{ textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}
                    >
                      {step.body}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Progress timeline */}
            <div className="absolute bottom-14 left-1/2 z-10 w-full max-w-[920px] -translate-x-1/2 px-6 sm:bottom-16">
              <ProgressBar
                steps={STEPS}
                scrollYProgress={scrollYProgress}
                active={active}
                reducedMotion={reducedMotion}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}

"use client";
import Link from "next/link";
import { useRef, useState, useEffect, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const ease = [0.22, 1, 0.36, 1] as const;
const SCALE = 0.7;
const VIRTUAL_PCT = "142.857%"; // 1 / 0.7

type Mockup = {
  id: string;
  url: string;
  image: string; // anteprima leggera (~1000px WebP) per card/lista
  full: string; // alta risoluzione (~1920px WebP) solo per il lightbox
  render: () => ReactNode;
};

// Il sito mostra gli SCREENSHOT (campo `image`, in /public/mockups) per avere
// proporzioni identiche e massima nitidezza nel ventaglio 3D.
// Gli asset sono WebP ottimizzati: `image` (~1000px, anteprima) caricato in
// pagina, `full` (~1920px) caricato on-demand all'apertura del lightbox.
// Le funzioni *Mockup() vive restano qui e su /preview: per modificarne uno,
// edita la funzione → rigenera lo screenshot → riottimizza in public/mockups.
export const MOCKUPS: readonly Mockup[] = [
  { id: "ecommerce",    url: "erba.it",              image: "/mockups/ecommerce.webp",    full: "/mockups/ecommerce-full.webp",    render: () => <EcommerceMockup /> },
  { id: "gestionale",   url: "saldo.app",            image: "/mockups/gestionale.webp",   full: "/mockups/gestionale-full.webp",   render: () => <GestionaleMockup /> },
  { id: "ristorazione", url: "sale-ristorante.it",   image: "/mockups/ristorazione.webp", full: "/mockups/ristorazione-full.webp", render: () => <RistorazioneMockup /> },
  { id: "immobiliare",  url: "dimora.it",            image: "/mockups/immobiliare.webp",  full: "/mockups/immobiliare-full.webp",  render: () => <ImmobiliareMockup /> },
  { id: "turismo",      url: "altrove.com",          image: "/mockups/turismo.webp",      full: "/mockups/turismo-full.webp",      render: () => <TurismoMockup /> },
  { id: "moda",         url: "maison.com",           image: "/mockups/moda.webp",         full: "/mockups/moda-full.webp",         render: () => <ModaMockup /> },
];

function MockupImage({ mockup }: { mockup: Mockup }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={mockup.image}
      alt=""
      loading="lazy"
      width={1000}
      height={625}
      className="absolute inset-0 w-full h-full object-cover"
    />
  );
}

export function MockupFrame({ mockup }: { mockup: Mockup }) {
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "#1c1c1e" }}>
      <div className="relative flex-1 overflow-hidden">
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: VIRTUAL_PCT,
            height: VIRTUAL_PCT,
            transform: `scale(${SCALE})`,
            transformOrigin: "top left",
          }}
        >
          {mockup.render()}
        </div>
      </div>
    </div>
  );
}

/* Diagonal fan — from front-left big to back-right small.
   Uniform rotateY −28° so cards look like a parallel fan opened in depth.
   Large X/Y/Z spacing so cards don't overlap; gentle scale/opacity decay
   so far cards stay legible. Subtle blur only on the two farthest. */
const POSITIONS = [
  { tx: -470, ty: 132,  tz: 200,  ry: -20, scale: 0.96, opacity: 1.0,  blur: 0 },
  { tx: -282, ty: 79,   tz: 100,  ry: -20, scale: 0.96, opacity: 0.97, blur: 0 },
  { tx: -94,  ty: 26,   tz: 0,    ry: -20, scale: 0.96, opacity: 0.94, blur: 0 },
  { tx: 94,   ty: -26,  tz: -100, ry: -20, scale: 0.96, opacity: 0.91, blur: 0 },
  { tx: 282,  ty: -79,  tz: -200, ry: -20, scale: 0.96, opacity: 0.88, blur: 0 },
  { tx: 470,  ty: -132, tz: -300, ry: -20, scale: 0.96, opacity: 0.86, blur: 0 },
];

const CARD_W = 600;
const CARD_H = (CARD_W / 16) * 10;

export function StyleGallery() {
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const { scrollYProgress: headingProgress } = useScroll({
    target: headingRef,
    offset: ["start 95%", "end 5%"],
  });
  const headingOpacity = useTransform(
    headingProgress,
    [0, 0.2, 0.75, 1],
    reducedMotion ? [1, 1, 1, 1] : [0, 1, 1, 0],
  );
  const headingY = useTransform(
    headingProgress,
    [0, 0.2, 0.75, 1],
    reducedMotion ? [0, 0, 0, 0] : [60, 0, 0, -60],
  );

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 80, damping: 20, mass: 0.5 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 80, damping: 20, mass: 0.5 });

  const mouseRotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-3, 3]);
  const mouseRotateX = useTransform(smoothMouseY, [-0.5, 0.5], [2, -2]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    mouseX.set(mx / rect.width - 0.5);
    mouseY.set(my / rect.height - 0.5);

    // Manual hit-test: project each card to 2D and pick the closest one under cursor
    const cx0 = rect.width / 2;
    const cy0 = rect.height / 2;
    const perspective = 2000;
    let closest: number | null = null;
    let minDist = Infinity;
    POSITIONS.forEach((pos, i) => {
      const factor = perspective / (perspective - pos.tz);
      const cx = cx0 + pos.tx * factor;
      const cy = cy0 + pos.ty * factor;
      const halfW = (CARD_W / 2) * pos.scale * factor;
      const halfH = (CARD_H / 2) * pos.scale * factor;
      if (Math.abs(mx - cx) < halfW && Math.abs(my - cy) < halfH) {
        const dist = Math.hypot(mx - cx, my - cy);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      }
    });
    setHovered(closest);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setHovered(null);
  };

  // Lightbox: clic su una card → screenshot grande e leggibile.
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  // Elemento che aveva il focus prima di aprire: ci torniamo alla chiusura.
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const closeLightbox = () => setLightboxIdx(null);
  const stepLightbox = (dir: number) =>
    setLightboxIdx((idx) => (idx === null ? null : (idx + dir + MOCKUPS.length) % MOCKUPS.length));

  useEffect(() => {
    if (lightboxIdx === null) return;
    // Salva il focus corrente e spostalo dentro il dialog.
    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxIdx(null);
      } else if (e.key === "ArrowRight") {
        setLightboxIdx((idx) => (idx === null ? null : (idx + 1) % MOCKUPS.length));
      } else if (e.key === "ArrowLeft") {
        setLightboxIdx((idx) => (idx === null ? null : (idx - 1 + MOCKUPS.length) % MOCKUPS.length));
      } else if (e.key === "Tab") {
        // Focus trap: mantieni il focus tra i controlli del dialog.
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>("button");
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const activeEl = document.activeElement;
        if (e.shiftKey && (activeEl === first || activeEl === dialogRef.current)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && activeEl === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      // Ripristina il focus sull'elemento che aveva aperto il lightbox.
      lastFocusedRef.current?.focus?.();
    };
  }, [lightboxIdx]);

  return (
    <section
      ref={sectionRef}
      id="style-gallery"
      aria-labelledby="style-gallery-heading"
      data-nav-theme="dark"
      className="relative bg-ink py-24 lg:py-28 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute top-0 inset-x-0 h-14 bg-gradient-to-b from-[#f4f7fa] to-transparent pointer-events-none z-10"
      />

      <div className="relative max-w-[1180px] mx-auto px-6">
        <motion.div
          ref={headingRef}
          className="text-center mb-4 lg:mb-6"
          style={{ opacity: headingOpacity, y: headingY }}
        >
          <h2
            id="style-gallery-heading"
            className="font-display font-semibold text-white text-[clamp(2.5rem,5vw,4rem)] leading-[1.02] tracking-[-0.03em] mb-6 max-w-[720px] mx-auto"
            style={{ textShadow: "0 4px 40px rgba(0,0,0,0.45)" }}
          >
            Ogni progetto, un mondo a sé.
          </h2>
          <p
            className="text-white/85 text-lg max-w-[560px] mx-auto leading-relaxed"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
          >
            Non esiste un solo modo giusto di dare forma a un'idea. Esiste
            quello giusto per te.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 text-white/60 text-[13px] font-medium">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
            Clicca un&apos;anteprima per ingrandirla
          </div>
        </motion.div>

        {reducedMotion ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1100px] mx-auto">
            {MOCKUPS.map((m, i) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setLightboxIdx(i)}
                className="relative aspect-[16/10] rounded-lg overflow-hidden border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] cursor-pointer text-left"
              >
                <MockupImage mockup={m} />
              </button>
            ))}
          </div>
        ) : (
          <>
            <div
              ref={sceneRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={() => { if (hovered !== null) setLightboxIdx(hovered); }}
              className={`hidden md:block relative h-[560px] lg:h-[640px] -mt-8 lg:-mt-12 ${hovered !== null ? "cursor-pointer" : ""}`}
              style={{
                perspective: "2000px",
                perspectiveOrigin: "50% 50%",
              }}
            >
              <motion.div
                style={{
                  rotateX: mouseRotateX,
                  rotateY: mouseRotateY,
                  transformStyle: "preserve-3d",
                }}
                className="absolute inset-0"
              >
                {MOCKUPS.map((m, i) => {
                  const pos = POSITIONS[i];
                  const isHovered = hovered === i;
                  const isDimmed = hovered !== null && hovered !== i;
                  return (
                    <motion.div
                      key={m.id}
                      initial={{
                        x: pos.tx - CARD_W / 2,
                        y: pos.ty - CARD_H / 2,
                        z: pos.tz,
                        rotateY: pos.ry,
                        scale: pos.scale,
                        opacity: 0,
                      }}
                      animate={{
                        x: pos.tx - CARD_W / 2,
                        y: pos.ty - CARD_H / 2,
                        opacity: isHovered ? 1 : pos.opacity,
                        z: isHovered ? 380 : isDimmed ? pos.tz - 60 : pos.tz,
                        scale: isHovered ? pos.scale * 1.12 : pos.scale,
                        rotateY: isHovered ? 0 : pos.ry,
                      }}
                      transition={{ duration: 0.5, ease, delay: hovered === null ? i * 0.07 : 0 }}
                      className="absolute top-1/2 left-1/2 cursor-pointer pointer-events-none"
                      style={{
                        width: CARD_W,
                        height: CARD_H,
                        transformStyle: "preserve-3d",
                        willChange: "transform, filter",
                        filter: isHovered
                          ? "brightness(1.12) saturate(1.08) drop-shadow(0 0 40px rgba(61,156,199,0.45))"
                          : isDimmed
                          ? "brightness(0.55) saturate(0.7) blur(1.5px)"
                          : undefined,
                      }}
                    >
                      <div className="relative w-full h-full rounded-lg overflow-hidden border border-white/10 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)]">
                        <MockupImage mockup={m} />
                        {isHovered && (
                          <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/45 backdrop-blur-sm flex items-center justify-center text-white">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            {/* Equivalente da tastiera del ventaglio 3D (che è mouse-only):
                bottoni focusabili e annunciati dagli screen reader, nascosti
                visivamente ma resi visibili al focus. Solo desktop (md+); su
                mobile la lista qui sotto ha già i suoi bottoni. (WCAG 2.1.1) */}
            <ul className="hidden md:flex md:flex-wrap md:justify-center md:gap-2">
              {MOCKUPS.map((m, i) => (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => setLightboxIdx(i)}
                    className="sr-only focus:not-sr-only focus:rounded-full focus:border focus:border-white/30 focus:bg-white/10 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
                  >
                    Apri anteprima del progetto {m.url}
                  </button>
                </li>
              ))}
            </ul>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.12 } },
              }}
              className="flex flex-col gap-4 md:hidden"
            >
              {MOCKUPS.map((m, i) => (
                <motion.button
                  key={m.id}
                  type="button"
                  onClick={() => setLightboxIdx(i)}
                  custom={i % 2 === 0 ? -1 : 1}
                  variants={{
                    hidden: (dir: number) => ({ opacity: 0, x: dir * 28, y: 12 }),
                    visible: { opacity: 1, x: 0, y: 0 },
                  }}
                  transition={{ duration: 0.55, ease }}
                  whileTap={{ scale: 0.985 }}
                  className="group relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/10 shadow-[0_22px_50px_-18px_rgba(0,0,0,0.7)] cursor-pointer text-left"
                >
                  <MockupImage mockup={m} />
                  {/* Didascalia: nome del sito + icona ingrandisci */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/60 via-black/10 to-transparent px-3.5 pb-2.5 pt-10">
                    <span className="font-mono text-[12px] tracking-wide text-white/90">
                      {m.url}
                    </span>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                      </svg>
                    </span>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </>
        )}

        <div className="mt-14 flex justify-center">
          <Link
            href="/portfolio"
            className="group inline-flex items-center gap-2.5 rounded-full bg-white/10 py-3 pl-6 pr-2 text-sm font-semibold text-white ring-1 ring-white/15 backdrop-blur-sm transition-colors duration-300 hover:bg-white/15"
          >
            Esplora tutti i progetti
            <span
              aria-hidden
              className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-cyan/20 text-brand-cyan transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
        </div>

      </div>

      {lightboxIdx !== null && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Anteprima del progetto ${MOCKUPS[lightboxIdx].url}`}
          tabIndex={-1}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 backdrop-blur-sm p-6 outline-none"
          onClick={closeLightbox}
        >
          <button
            type="button"
            aria-label="Chiudi"
            onClick={closeLightbox}
            className="absolute top-5 right-6 text-white/70 hover:text-white text-2xl leading-none"
          >
            ✕
          </button>
          <button
            type="button"
            aria-label="Precedente"
            onClick={(e) => { e.stopPropagation(); stepLightbox(-1); }}
            className="absolute left-3 md:left-10 text-white/55 hover:text-white text-4xl px-3 py-2 leading-none"
          >
            ‹
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={MOCKUPS[lightboxIdx].full}
            alt={`Anteprima del progetto ${MOCKUPS[lightboxIdx].url}`}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[min(1150px,94vw)] aspect-[16/10] object-contain rounded-xl shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]"
          />
          <button
            type="button"
            aria-label="Successivo"
            onClick={(e) => { e.stopPropagation(); stepLightbox(1); }}
            className="absolute right-3 md:right-10 text-white/55 hover:text-white text-4xl px-3 py-2 leading-none"
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}

/* ============================================================
   Mockup vetrina — direzione artistica ispirata a campagne reali
   (Revolut, Wolverine, ZARA, OVS, VAULK): foto editoriale a tutto
   schermo, tipografia enorme, un elemento "firma" fluttuante,
   nav minimale, color grading caldo.
   ============================================================ */

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif";
const IMG = "https://images.unsplash.com/photo-";
const Q = "?w=1500&q=85&fit=crop";

// 01 — E-commerce skincare botanico alla Aesop: palette calda, serif, prodotto + card fluttuante
function EcommerceMockup() {
  const INK = "#2e271f";
  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden" style={{ fontFamily: SANS, background: "#e9e1d4", color: INK }}>
      <div className="relative flex items-center justify-between px-7 h-12 border-b border-black/10 z-10">
        <span className="font-semibold text-[13px] tracking-[0.32em]" style={{ fontFamily: SERIF }}>ERBA</span>
        <nav className="flex items-center gap-7 text-[10px] uppercase tracking-[0.16em]" style={{ color: "rgba(46,39,31,0.6)" }}>
          <span className="font-medium" style={{ color: INK }}>Viso</span>
          <span>Corpo</span>
          <span>Profumi</span>
          <span>Rituali</span>
        </nav>
        <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.16em]" style={{ color: "rgba(46,39,31,0.6)" }}>
          <span>Cerca</span>
          <span>Borsa (1)</span>
        </div>
      </div>

      <div className="relative flex-1 grid grid-cols-[1fr_1fr]">
        <div className="flex flex-col justify-center px-8">
          <div className="text-[9.5px] uppercase tracking-[0.4em] mb-4" style={{ color: "#8a7a63" }}>Skincare naturale · dal 2019</div>
          <h3 className="leading-[0.92] tracking-[-0.01em] mb-4" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "3.8rem", fontWeight: 600 }}>
            Pura essenza<br /><span className="italic" style={{ color: "#6f7d5a" }}>botanica.</span>
          </h3>
          <p className="text-[12px] leading-relaxed max-w-[230px] mb-6" style={{ color: "#5c5042" }}>
            Formule pulite a base vegetale, prodotte in piccoli lotti. Per ogni tipo di pelle.
          </p>
          <button className="self-start text-white text-[10px] uppercase tracking-[0.18em] px-6 py-3" style={{ background: INK }}>
            Scopri i rituali
          </button>
        </div>
        <div className="relative overflow-hidden" style={{ background: "#d8cdb9" }}>
          <img
            src={`${IMG}1612817288484-6f916006741a${Q}`}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="absolute bottom-5 right-6 bg-white/92 backdrop-blur-md px-3.5 py-2.5 w-[200px] shadow-[0_18px_44px_-16px_rgba(46,39,31,0.5)]">
        <div className="text-[8px] uppercase tracking-wide" style={{ color: "#8a7a63" }}>Più amato</div>
        <div className="text-[11.5px] font-medium" style={{ fontFamily: SERIF }}>Siero alla Camelia</div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[12px] font-semibold">€ 48</span>
          <span className="text-[8.5px] uppercase tracking-wide border-b pb-0.5" style={{ borderColor: INK }}>Aggiungi</span>
        </div>
      </div>
    </div>
  );
}

// 02 — Gestionale (rev. boss): sfondo bianco, titolo Space Grotesk, emerald
// brillante, dashboard "app.dgftechsolutions.com" con grafico a barre.
function GestionaleMockup() {
  const INK = "#0f1722";
  const EMER = "#16a34a";
  const EMER_DK = "#15803d";
  const MUT = "#64707e";
  const LINE = "#eceef1";
  const SG = "var(--font-space-grotesk), 'Inter', sans-serif";
  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden" style={{ fontFamily: SANS, background: "#ffffff", color: INK }}>
      <div className="relative flex items-center justify-between px-8 h-12 z-10 border-b" style={{ borderColor: LINE }}>
        <span className="font-bold text-[15px] tracking-[-0.03em]" style={{ fontFamily: SG }}>Saldo<span style={{ color: EMER }}>.</span></span>
        <nav className="flex items-center gap-7 text-[10.5px] font-medium" style={{ color: MUT }}>
          <span style={{ color: INK }}>Prodotto</span>
          <span>Funzioni</span>
          <span>Prezzi</span>
          <span>Risorse</span>
        </nav>
        <div className="flex items-center gap-4 text-[10.5px] font-medium">
          <span style={{ color: MUT }}>Accedi</span>
          <span className="text-white rounded-full px-4 py-1.5 font-semibold" style={{ background: EMER }}>Prova gratis</span>
        </div>
      </div>

      <div className="relative flex-1 grid grid-cols-[0.92fr_1.08fr] items-stretch pb-2">
        <div className="flex flex-col justify-between py-8 pl-8 pr-3">
          <div className="self-start text-[8.5px] uppercase tracking-[0.22em] font-semibold rounded-full px-3 py-1.5 mb-7" style={{ background: "#e7f7ee", color: EMER_DK }}>
            Fatturazione &amp; magazzino
          </div>
          <h3 className="leading-[1] tracking-[-0.03em] mb-6 font-bold" style={{ fontFamily: SG, fontSize: "3rem" }}>
            La tua azienda<br />sotto controllo,<br /><span style={{ color: EMER }}>in ordine.</span>
          </h3>
          <p className="text-[12px] leading-relaxed max-w-[270px] mb-8" style={{ color: MUT }}>
            Gestisci fatture, scorte di magazzino e ordini dei clienti in un&apos;unica dashboard intelligente. Chiara, rapida e nativa.
          </p>
          <div className="flex items-center gap-4 mb-8">
            <button className="text-white text-[11px] font-semibold rounded-full px-5 py-2.5" style={{ background: EMER }}>Inizia ora gratis</button>
            <button className="flex items-center gap-2 text-[11px] font-semibold" style={{ color: INK }}>
              Guarda la demo attiva
              <span className="w-4 h-4 rounded-full flex items-center justify-center text-[7px]" style={{ border: `1px solid ${INK}` }}>▶</span>
            </button>
          </div>
          <div className="flex items-center gap-2 text-[9.5px]" style={{ color: MUT }}>
            <span style={{ color: "#f0a93a", letterSpacing: "1.5px" }}>★★★★★</span>
            <span>Valutato <span className="font-semibold" style={{ color: INK }}>4,9/5</span> da oltre 3.000 imprese in Italia</span>
          </div>
        </div>

        <div className="relative h-full flex items-center pr-8">
          <div className="relative w-full">
          <div className="relative w-full rounded-xl bg-white overflow-hidden" style={{ boxShadow: "0 30px 70px -24px rgba(15,23,34,0.35)", border: `1px solid ${LINE}` }}>
            <div className="flex items-center gap-2 px-3.5 py-2 border-b" style={{ background: "#f7f8fa", borderColor: LINE }}>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#e0635a" }} />
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#e6b23c" }} />
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#3fb56b" }} />
              </div>
              <div className="flex-1 flex justify-center">
                <span className="text-[8px] px-3 py-0.5 rounded" style={{ background: "#eceef1", color: MUT }}>app.dgftechsolutions.com/dashboard</span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 pt-3 pb-2">
              <div className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[10px] font-bold" style={{ background: EMER, fontFamily: SG }}>S</div>
              <span className="text-[11px] font-semibold">Panoramica Aziendale</span>
            </div>

            <div className="grid grid-cols-3 gap-2 px-4 pb-1">
              {[["Incassato", "€ 48.250", "↑ +12% questo mese", true], ["In attesa", "€ 6.400", "4 fatture attive", true], ["Magazzino", "1.284", "articoli in stock", false]].map(([a, b, c, up], i) => (
                <div key={i} className="rounded-lg border px-3 py-3" style={{ borderColor: LINE }}>
                  <div className="text-[8px] uppercase tracking-wide" style={{ color: MUT }}>{a}</div>
                  <div className="text-[14px] font-bold leading-tight" style={{ fontFamily: SG }}>{b}</div>
                  <div className="text-[8px] mt-0.5" style={{ color: up ? EMER_DK : MUT }}>{c}</div>
                </div>
              ))}
            </div>

            <div className="px-4 pt-4 pb-2">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] font-semibold">Andamento incassi</span>
                <span className="text-[8.5px]" style={{ color: MUT }}>Ultimi 7 mesi</span>
              </div>
              <div className="h-16 flex items-end gap-1.5">
                {[0.45, 0.6, 0.5, 0.72, 0.66, 0.85, 1].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t" style={{ height: `${h * 100}%`, background: i === 6 ? EMER : "#c9efd8" }} />
                ))}
              </div>
            </div>

            <div className="px-4 pt-2 pb-4">
              {[["Rossi S.r.l.", "€ 2.450", "Pagata", true], ["Bianchi & Co.", "€ 1.120", "In attesa", false], ["Studio Verdi", "€ 880", "Pagata", true]].map(([n, amt, st, paid], i) => (
                <div key={i} className="flex items-center justify-between py-2" style={{ borderTop: i ? `1px solid ${LINE}` : "none" }}>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full text-[9px] font-semibold flex items-center justify-center" style={{ background: "#f1f3f5", color: INK }}>{String(n)[0]}</div>
                    <span className="text-[10px] font-medium">{n}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[8px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: paid ? "#e3f5ea" : "#fbf0dd", color: paid ? EMER_DK : "#b07d1e" }}>{st}</span>
                    <span className="text-[10px] font-semibold w-12 text-right">{amt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

            <div className="absolute -bottom-3 -left-5 rounded-xl bg-white px-3.5 py-2.5 w-[172px]" style={{ boxShadow: "0 18px 44px -16px rgba(15,23,34,0.4)", border: `1px solid ${LINE}` }}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[12px]" style={{ background: EMER }}>↑</div>
                <div>
                  <div className="text-[8px]" style={{ color: MUT }}>Incasso registrato oggi</div>
                  <div className="text-[12px] font-bold leading-none" style={{ fontFamily: SG }}>+ 2.550 €</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 03 — Ristorante: full-bleed immersivo, contenuto ancorato in basso-sinistra,
// card menu degustazione fluttuante. Palette gold/cream/charcoal dal piatto.
function RistorazioneMockup() {
  const GOLD = "#cda86a";
  const CREAM = "#f3ece0";
  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden" style={{ fontFamily: SERIF, background: "#0a0806", color: CREAM }}>
      <div className="absolute inset-0">
        <img
          src={`${IMG}1414235077428-338989a2e8c0${Q}`}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(8,5,3,0.55) 0%, rgba(8,5,3,0.12) 36%, rgba(8,5,3,0.93) 100%)" }} />
      </div>

      <div className="relative flex items-center justify-between px-8 h-12" style={{ fontFamily: SANS }}>
        <span className="text-[13px] tracking-[0.44em] font-semibold" style={{ color: CREAM, fontFamily: SERIF }}>SALE</span>
        <nav className="flex items-center gap-7 text-[9.5px] uppercase tracking-[0.2em]" style={{ color: "rgba(243,236,224,0.72)" }}>
          <span>Menù</span>
          <span>Cantina</span>
          <span>Lo Chef</span>
          <span>Eventi</span>
        </nav>
        <span className="text-[9px] uppercase tracking-[0.22em] px-3.5 py-1.5" style={{ border: "1px solid rgba(205,168,106,0.55)", color: GOLD }}>Prenota</span>
      </div>

      <div className="relative flex-1 flex flex-col justify-end px-8 pb-9">
        <div className="flex items-center gap-3 mb-4" style={{ fontFamily: SANS }}>
          <span className="text-[9px] uppercase tracking-[0.34em]" style={{ color: GOLD }}>★ Una stella Michelin</span>
          <span className="w-px h-3" style={{ background: "rgba(243,236,224,0.3)" }} />
          <span className="text-[9px] uppercase tracking-[0.28em]" style={{ color: "rgba(243,236,224,0.7)" }}>Palermo</span>
        </div>
        <h3 className="leading-[0.92] tracking-[-0.005em] max-w-[440px] font-semibold" style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "3.9rem" }}>
          Il gusto del<br /><span className="italic" style={{ color: GOLD }}>territorio.</span>
        </h3>
        <p className="mt-4 text-[11.5px] leading-relaxed max-w-[270px]" style={{ fontFamily: SANS, color: "rgba(243,236,224,0.82)" }}>
          Cucina siciliana d&apos;autore. Ingredienti del giorno, una sala sola, nessun menù fisso.
        </p>
      </div>

      <div className="absolute bottom-9 right-8 w-[188px] px-4 py-3.5 backdrop-blur-md" style={{ background: "rgba(20,14,9,0.7)", border: "1px solid rgba(205,168,106,0.35)", fontFamily: SANS }}>
        <div className="text-[8px] uppercase tracking-[0.3em] mb-1.5" style={{ color: GOLD }}>Menu degustazione</div>
        <div className="text-[15px] leading-tight" style={{ fontFamily: SERIF, color: CREAM }}>Sette portate</div>
        <div className="flex items-center justify-between mt-2.5 pt-2.5" style={{ borderTop: "1px solid rgba(243,236,224,0.16)" }}>
          <span className="text-[8.5px]" style={{ color: "rgba(243,236,224,0.6)" }}>vini in abbinamento</span>
          <span className="text-[13px]" style={{ fontFamily: SERIF, color: GOLD }}>€ 95</span>
        </div>
      </div>

      {/* card stampa/recensione in alto-destra — riempie l'area alta */}
      <div className="absolute top-[68px] right-8 w-[210px] px-4 py-3 backdrop-blur-md" style={{ background: "rgba(20,14,9,0.5)", border: "1px solid rgba(243,236,224,0.16)", fontFamily: SANS }}>
        <div className="text-[10px]" style={{ color: GOLD, letterSpacing: "2.5px" }}>★★★★★</div>
        <p className="text-[12px] leading-snug mt-1.5" style={{ fontFamily: SERIF, color: CREAM }}>
          «Una delle migliori tavole del Sud.»
        </p>
        <div className="text-[8px] uppercase tracking-[0.22em] mt-2" style={{ color: "rgba(243,236,224,0.58)" }}>Gambero Rosso · 2025</div>
      </div>

      {/* orari in alto, sotto al menu */}
      <div className="absolute top-[68px] left-8 flex flex-col gap-1.5" style={{ fontFamily: SANS }}>
        <div className="text-[8.5px] uppercase tracking-[0.28em]" style={{ color: "rgba(243,236,224,0.55)" }}>Aperto · cena</div>
        <div className="text-[11px]" style={{ fontFamily: SERIF, color: CREAM }}>Mar – Dom · 19:30 – 23:00</div>
      </div>

      {/* etichetta verticale sul bordo sinistro */}
      <div className="absolute left-2.5 bottom-9" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontFamily: SANS }}>
        <span className="text-[8px] uppercase tracking-[0.42em]" style={{ color: "rgba(243,236,224,0.5)" }}>Trattoria contemporanea — dal 1998</span>
      </div>
    </div>
  );
}

// 04 — Immobiliare: hero fotografico arrotondato + headline sans bold + riga
// di 3 card categoria. Ispirato a farmform/horeca: foto grande, molto respiro,
// tipografia sans decisa, accento verde salvia naturale.
function ImmobiliareMockup() {
  const CREAM = "#f3f1ec";
  const INK = "#1f2421";
  const SAGE = "#5f6f52";
  const MUT = "#787c73";
  const SG = "var(--font-space-grotesk), 'Inter', sans-serif";
  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden" style={{ fontFamily: SANS, background: CREAM, color: INK }}>
      <div className="relative flex items-center justify-between px-8 h-12">
        <span className="text-[15px] font-bold tracking-[0.01em]" style={{ fontFamily: SG }}>Dimora</span>
        <nav className="flex items-center gap-7 text-[10.5px] font-medium" style={{ color: MUT }}>
          <span style={{ color: INK }}>Proprietà</span>
          <span>Ville</span>
          <span>Agenzia</span>
          <span>Contatti</span>
        </nav>
        <span className="text-[10.5px] font-semibold rounded-full px-4 py-1.5 text-white" style={{ background: INK }}>Prenota visita</span>
      </div>

      <div className="relative flex-1 px-2.5 pb-2.5">
        {/* hero fotografico a tutto frame */}
        <div className="relative h-full rounded-2xl overflow-hidden">
          <img
            src={`${IMG}1600596542815-ffad4c1539a9${Q}`}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(18,22,18,0.36) 0%, rgba(18,22,18,0.04) 34%, rgba(18,22,18,0.82) 100%)" }} />

          <div className="absolute top-5 left-6 text-[8.5px] uppercase tracking-[0.3em] text-white/85">
            Immobili di prestigio · 2025
          </div>

          {/* card in evidenza */}
          <div className="absolute top-5 right-6 rounded-lg px-3.5 py-2.5 backdrop-blur-md" style={{ background: "rgba(243,241,236,0.14)", border: "1px solid rgba(255,255,255,0.25)" }}>
            <div className="text-[7.5px] uppercase tracking-[0.22em] text-white/75">In evidenza</div>
            <div className="text-[12px] text-white mt-0.5" style={{ fontFamily: SG, fontWeight: 600 }}>Villa sul lago · Como</div>
            <div className="text-[10px] text-white/85 mt-0.5">6 camere · 820 m² · € 4,8M</div>
          </div>

          {/* headline + cta */}
          <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between gap-4">
            <div>
              <h3 className="text-white leading-[0.98] tracking-[-0.02em]" style={{ fontFamily: SG, fontSize: "3.1rem", fontWeight: 700 }}>
                Lo spazio<br />che senti tuo.
              </h3>
              <p className="mt-3.5 text-[12.5px] text-white/85 max-w-[320px] leading-relaxed">
                Ville, attici e dimore selezionate, in tutta Italia.
              </p>
              <div className="mt-5 flex items-center gap-3.5 text-[9px] uppercase tracking-[0.18em] text-white/70">
                <span>120+ proprietà</span>
                <span className="w-px h-3" style={{ background: "rgba(255,255,255,0.3)" }} />
                <span>8 città</span>
                <span className="w-px h-3" style={{ background: "rgba(255,255,255,0.3)" }} />
                <span>dal 1998</span>
              </div>
            </div>
            <button className="shrink-0 flex items-center gap-2 text-[11px] font-semibold rounded-full px-5 py-2.5" style={{ background: CREAM, color: INK }}>
              Esplora il portfolio
              <span style={{ color: SAGE }}>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 05 — Turismo: full-bleed paesaggio, titolo centrato, widget di ricerca
// booking orizzontale (elemento firma) + card spotlight destinazione.
function TurismoMockup() {
  const TERRA = "#c8643c";
  return (
    <div className="absolute inset-0 flex flex-col text-white overflow-hidden" style={{ fontFamily: SANS, background: "#08101a" }}>
      <div className="absolute inset-0">
        <img
          src={`${IMG}1523906834658-6e24ef2386f9${Q}`}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(8,16,26,0.5) 0%, rgba(8,16,26,0.12) 32%, rgba(8,16,26,0.78) 100%)" }} />
      </div>

      <div className="relative flex items-center justify-between px-8 h-12">
        <span className="font-bold tracking-[0.06em] text-[15px]">ALTROVE</span>
        <nav className="flex items-center gap-7 text-[10px] uppercase tracking-[0.16em] text-white/85">
          <span>Esperienze</span>
          <span>Soggiorni</span>
          <span>Diario</span>
          <span>Chi siamo</span>
        </nav>
        <span className="text-[10px] uppercase tracking-[0.16em] px-3.5 py-1.5 rounded-full" style={{ border: "1px solid rgba(255,255,255,0.4)" }}>Accedi</span>
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center text-center px-8">
        <div className="text-[9px] uppercase tracking-[0.46em] mb-4 text-white/80">Viaggi disegnati a mano · dal 2010</div>
        <h3 className="leading-[0.95] tracking-[-0.015em]" style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "4.4rem", fontWeight: 600 }}>
          Il mondo,<br /><span className="italic" style={{ color: "#e6bd84" }}>su misura.</span>
        </h3>
        <p className="mt-4 text-white/85 text-[12.5px] max-w-[320px] leading-relaxed">
          Itinerari su misura, disegnati a mano da specialisti di destinazione.
        </p>
      </div>

      {/* widget di ricerca booking */}
      <div className="relative px-8 pb-8 flex justify-center">
        <div className="flex items-center gap-1 rounded-full bg-white p-1.5 pl-5 text-neutral-900 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]">
          <div className="pr-4">
            <div className="text-[7.5px] uppercase tracking-[0.18em] text-neutral-400">Destinazione</div>
            <div className="text-[10.5px] font-semibold leading-tight">Venezia, Italia</div>
          </div>
          <div className="w-px h-7 bg-neutral-200" />
          <div className="px-4">
            <div className="text-[7.5px] uppercase tracking-[0.18em] text-neutral-400">Quando</div>
            <div className="text-[10.5px] font-semibold leading-tight">Set – Ott</div>
          </div>
          <div className="w-px h-7 bg-neutral-200" />
          <div className="px-4">
            <div className="text-[7.5px] uppercase tracking-[0.18em] text-neutral-400">Viaggiatori</div>
            <div className="text-[10.5px] font-semibold leading-tight">2 adulti</div>
          </div>
          <button className="ml-1 flex items-center gap-1.5 text-white text-[10px] font-semibold uppercase tracking-[0.12em] rounded-full px-5 py-2.5" style={{ background: TERRA }}>
            Cerca
          </button>
        </div>
      </div>
    </div>
  );
}

// 06 — Moda: diptych editoriale (due immagini affiancate), titolo serif
// oversize al centro che taglia la cucitura, card look fluttuante.
function ModaMockup() {
  const CREAM = "#ece6dc";
  return (
    <div className="absolute inset-0 flex flex-col text-white overflow-hidden" style={{ fontFamily: SANS, background: "#141210" }}>
      <div className="relative flex items-center justify-between px-8 h-12 text-[10px] uppercase tracking-[0.18em]">
        <span className="text-[14px] tracking-[0.34em] font-semibold" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>MAISON</span>
        <nav className="flex items-center gap-7 text-white/85">
          <span>Donna</span>
          <span>Uomo</span>
          <span>Lookbook</span>
        </nav>
        <div className="flex items-center gap-5 text-white/85">
          <span>Cerca</span>
          <span>Borsa (2)</span>
        </div>
      </div>

      {/* diptych */}
      <div className="relative flex-1 grid grid-cols-2 gap-1.5 px-1.5 pb-1.5">
        <div className="relative overflow-hidden">
          <img
            src={`${IMG}1483985988355-763728e1935b${Q}`}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: "center 22%" }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.55) 100%)" }} />
          <span className="absolute bottom-3 left-3.5 text-[8.5px] uppercase tracking-[0.24em] text-white/85">Donna · 2026</span>
        </div>
        <div className="relative overflow-hidden">
          <img
            src={`${IMG}1485462537746-965f33f7f6a7${Q}`}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: "center 28%" }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.55) 100%)" }} />
          <span className="absolute bottom-3 right-3.5 text-[8.5px] uppercase tracking-[0.24em] text-white/85">Lookbook · 2026</span>
        </div>
      </div>

      {/* titolo serif oversize al centro */}
      <div className="absolute inset-x-0 top-[44%] -translate-y-1/2 flex flex-col items-center text-center pointer-events-none">
        <div className="text-[9px] uppercase tracking-[0.5em] mb-3" style={{ color: CREAM }}>Autunno · Inverno 2026</div>
        <h3 className="leading-[0.92] tracking-[-0.01em]" style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "3.7rem", fontWeight: 600, textShadow: "0 6px 40px rgba(0,0,0,0.55)" }}>
          La nuova<br /><span className="italic">collezione.</span>
        </h3>
        <span className="mt-5 text-[9.5px] uppercase tracking-[0.22em] border-b pb-1" style={{ borderColor: "rgba(236,230,220,0.7)", color: CREAM }}>Scopri il lookbook</span>
      </div>
    </div>
  );
}

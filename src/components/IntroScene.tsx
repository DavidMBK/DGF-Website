"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/* ------------------------------------------------------------------ *
 *  IntroScene — intro "stile-video" a schermo intero (solo home).
 *
 *  Coreografia (~4.2s):
 *   - fondo navy scuro #0a1f33 con vignettatura
 *   - PAVIMENTO A GRIGLIA in prospettiva che receda verso un punto di fuga;
 *     accelera e si illumina con il collasso (climax)
 *   - VORTICE di particelle pseudo-3D (proiezione punto→2D, stessa tecnica del
 *     globo dell'Hero) navy→blue→cyan per profondità, che SPIRALEGGIANO verso il
 *     centro con un imbuto 3D; bloom finto via sprite radiali pre-renderizzati
 *     (niente shadowBlur per-particella → economico anche su mobile)
 *   - al collasso un breve LAMPO cyan secco e il LOGO DGF entra A FUOCO
 *     (blur→nitido reale via ctx.filter) con doppio passaggio di glow neon
 *   - in uscita il fondo vira da navy a BIANCO (bridge cromatico verso l'Hero,
 *     che vive su sfondo bianco) e l'overlay sfuma rivelando il sito.
 *
 *  Mono-blu rigoroso: navy / blue (#1575a4) / cyan (#3d9cc7). Zero viola/rosa.
 *  Solo in home, una volta per sessione, skippabile (bottone + Esc), bypassata
 *  con prefers-reduced-motion. Nessun Math.random a livello di modulo → niente
 *  mismatch di hydration (il canvas viene disegnato solo client-side, in effect;
 *  show parte false e si attiva solo dopo i gate, così la HTML statica esportata
 *  non dipinge mai l'overlay).
 * ------------------------------------------------------------------ */

const ease = [0.22, 1, 0.36, 1] as const;
// Chiave dedicata: NON condivisa con IntroReveal, così i due intro non si
// annullano a vicenda (decisione: usare UNO solo dei due in layout.tsx).
const SESSION_KEY = "dgf-intro-scene-seen";
const LOGO_SRC = "/logo-dgf-trasparente.png";
// basePath a runtime per i deploy in sottocartella (GitHub project page):
// gli asset assegnati a mano a img.src NON vengono riscritti da Next.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// Palette mono-blu coerente col logo.
const NAVY_BG = "#0a1f33";
const CYAN = { r: 61, g: 156, b: 199 }; // #3d9cc7
const BLUE = { r: 21, g: 117, b: 164 }; // #1575a4
const NAVY = { r: 9, g: 51, b: 89 }; // navy profondo per particelle lontane

// Tempistiche (ms). DURATION_MS = momento in cui parte il fade d'uscita.
const DURATION_MS = 4200;
const FADE_OUT_MS = 800;

// Fasi normalizzate sul tempo dell'animazione (0..1 su DURATION_MS).
const T_CONVERGE_END = 0.5; // le particelle finiscono di convergere qui
const T_FLASH = 0.52; // picco del lampo
const T_LOGO_START = 0.5; // il logo inizia a comparire
const T_LOGO_IN = 0.22; // durata (frazione) entrata logo → pieno a ~0.72

const PARTICLE_COUNT_DESKTOP = 170;
const PARTICLE_COUNT_MOBILE = 80;

const TAU = Math.PI * 2;

interface Particle {
  angle: number; // angolo nel piano orbitale
  radius: number; // raggio iniziale (0..1)
  height: number; // quota verticale per l'imbuto pseudo-3D
  spin: number; // velocità angolare
  hue: 0 | 1; // 0 = cyan-bias, 1 = blue-bias (modulato poi da depth)
  size: number;
}

/**
 * Generatore deterministico (mulberry32) → niente Math.random globale,
 * nessun rischio di hydration mismatch. Le particelle vengono comunque
 * costruite solo client-side dentro l'effect.
 */
function makeRng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildParticles(count: number): Particle[] {
  const rng = makeRng(0x9e3779b9);
  const out: Particle[] = [];
  for (let i = 0; i < count; i++) {
    out.push({
      angle: rng() * TAU,
      radius: 0.55 + rng() * 0.5, // partono dalla periferia
      height: (rng() - 0.5) * 1.8,
      spin: 1.6 + rng() * 1.4, // più calmo: la spirale resta leggibile
      hue: rng() > 0.45 ? 0 : 1,
      size: 1.2 + rng() * 2.2,
    });
  }
  return out;
}

function easeExpo(t: number): number {
  // ease-out-expo: usato per l'ENTRATA del logo (rapida e morbida).
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function easeInOutCubic(x: number): number {
  // Convergenza LENTA poi rapida: il raggio resta ampio nella prima metà
  // (la spirale si vede) e collassa solo nel finale.
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function clamp01(x: number): number {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** NAVY → BLUE → CYAN in funzione della profondità (0=lontano, 1=vicino). */
function depthColor(depth: number, bias: 0 | 1): RGB {
  // Le "blue-bias" pesano di più verso navy/blue, le "cyan-bias" verso cyan.
  const d = bias === 0 ? Math.min(1, depth + 0.18) : Math.max(0, depth - 0.1);
  let from: RGB;
  let to: RGB;
  let local: number;
  if (d < 0.5) {
    from = NAVY;
    to = BLUE;
    local = d / 0.5;
  } else {
    from = BLUE;
    to = CYAN;
    local = (d - 0.5) / 0.5;
  }
  return {
    r: lerp(from.r, to.r, local),
    g: lerp(from.g, to.g, local),
    b: lerp(from.b, to.b, local),
  };
}

/** Sprite radiale di glow pre-renderizzato (sostituisce shadowBlur per-particella). */
function makeGlowSprite(color: RGB, dpr: number): HTMLCanvasElement {
  const size = Math.round(48 * dpr);
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const g = c.getContext("2d")!;
  const cx = size / 2;
  const grad = g.createRadialGradient(cx, cx, 0, cx, cx, cx);
  const rgb = `${Math.round(color.r)},${Math.round(color.g)},${Math.round(color.b)}`;
  grad.addColorStop(0, `rgba(${rgb},0.95)`);
  grad.addColorStop(0.25, `rgba(${rgb},0.55)`);
  grad.addColorStop(0.6, `rgba(${rgb},0.16)`);
  grad.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

export function IntroScene() {
  const isHome = usePathname() === "/";
  const prefersReduced = usePrefersReducedMotion();

  // show parte FALSE: la HTML statica (output: "export") non dipinge mai
  // l'overlay, niente flash per chi è in reduced-motion o torna sul sito.
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  // Smaschera la scrittura del flag di sessione solo a intro COMPLETATA,
  // così StrictMode (doppio mount in dev) non sopprime l'intro per sempre.
  const completedRef = useRef(false);

  // Gate di montaggio: home, prima volta nella sessione, no reduced-motion.
  useEffect(() => {
    if (!isHome || prefersReduced) {
      setShow(false);
      return;
    }
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) {
      setShow(false);
      return;
    }
    // NB: NON scriviamo qui il flag — solo a completamento (vedi sotto).
    setShow(true);
  }, [isHome, prefersReduced]);

  // Lock dello scroll: UNICA fonte di verità. Il cleanup (allo smonto) è
  // l'unico punto che ripristina, così lo scroll resta bloccato per tutto
  // il fade d'uscita.
  useEffect(() => {
    if (!show) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  // Avvia il fade d'uscita allo scadere della durata e marca come completata.
  useEffect(() => {
    if (!show) return;
    const t = window.setTimeout(() => {
      completedRef.current = true;
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* storage non disponibile: pazienza, riapparirà */
      }
      setLeaving(true);
    }, DURATION_MS);
    return () => window.clearTimeout(t);
  }, [show]);

  // Smonta dopo il fade.
  useEffect(() => {
    if (!leaving) return;
    const t = window.setTimeout(() => setShow(false), FADE_OUT_MS);
    return () => window.clearTimeout(t);
  }, [leaving]);

  // Skip via Esc o bottone: marca comunque come "vista" (è una scelta utente).
  const skip = () => {
    completedRef.current = true;
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* noop */
    }
    setLeaving(true);
  };

  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show]);

  // Loop di animazione del canvas.
  useEffect(() => {
    if (!show) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const coarse =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;
    const particles = buildParticles(
      coarse ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP
    );

    // Logo: caricato come immagine e disegnato sul canvas col glow.
    const logo = new Image();
    let logoReady = false;
    // Silhouette BIANCA del logo (per il bordino): la costruiamo una volta al
    // load riempiendo di bianco i pixel opachi del PNG.
    let logoWhite: HTMLCanvasElement | null = null;
    logo.onload = () => {
      logoReady = true;
      const ow = logo.naturalWidth || logo.width;
      const oh = logo.naturalHeight || logo.height;
      if (ow > 0 && oh > 0) {
        const oc = document.createElement("canvas");
        oc.width = ow;
        oc.height = oh;
        const octx = oc.getContext("2d");
        if (octx) {
          octx.drawImage(logo, 0, 0, ow, oh);
          octx.globalCompositeOperation = "source-in";
          octx.fillStyle = "#ffffff";
          octx.fillRect(0, 0, ow, oh);
          logoWhite = oc;
        }
      }
    };
    logo.onerror = () => {
      // Asset mancante (es. basePath errato): degradiamo senza logo, niente crash.
      logoReady = false;
    };
    logo.src = BASE_PATH + LOGO_SRC;

    // Dimensioni + devicePixelRatio (cap a 2 per non far esplodere il fill-rate).
    let dpr = 1;
    let w = 0;
    let h = 0;
    // Gradient costanti, ricreati solo su resize (niente alloc per-frame).
    let vignette: CanvasGradient | null = null;
    // Sprite di glow pre-renderizzati per profondità (5 step) × 2 bias.
    const GLOW_STEPS = 5;
    let glowCyan: HTMLCanvasElement[] = [];
    let glowBlue: HTMLCanvasElement[] = [];

    const buildSprites = () => {
      glowCyan = [];
      glowBlue = [];
      for (let s = 0; s < GLOW_STEPS; s++) {
        const depth = s / (GLOW_STEPS - 1);
        glowCyan.push(makeGlowSprite(depthColor(depth, 0), dpr));
        glowBlue.push(makeGlowSprite(depthColor(depth, 1), dpr));
      }
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cx = w / 2;
      const cy = h / 2;
      vignette = ctx.createRadialGradient(
        cx,
        cy,
        Math.min(w, h) * 0.12,
        cx,
        cy,
        Math.max(w, h) * 0.72
      );
      vignette.addColorStop(0, "rgba(15,58,95,0.55)");
      vignette.addColorStop(1, "rgba(4,16,28,0.92)");

      buildSprites();
      // Ridisegna subito il frame corrente (utile se il loop è già fermo).
      drawFrame(performance.now());
    };

    // Costanti di proiezione pseudo-3D (sorgente al centro schermo).
    const FOV = 320;
    const CAM_Z = 2.2;

    let startTs = 0;

    const drawFrame = (ts: number) => {
      if (startTs === 0) startTs = ts;
      const elapsed = ts - startTs;
      const t = Math.min(elapsed / DURATION_MS, 1); // 0..1
      const cx = w / 2;
      const cy = h / 2;
      const tSec = elapsed / 1000;

      ctx.clearRect(0, 0, w, h);

      /* ---- Fondo navy con vignettatura (gradient cachato) ---- */
      ctx.fillStyle = NAVY_BG;
      ctx.fillRect(0, 0, w, h);
      if (vignette) {
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, w, h);
      }

      // Convergenza lenta-poi-rapida: spirale visibile, collasso nel finale.
      const conv = easeInOutCubic(clamp01(t / T_CONVERGE_END));
      // L'imbuto: la quota collassa PIÙ TARDI del raggio (alto+largo→sottile).
      const heightCollapse = smoothstep(0.32, T_CONVERGE_END, t);

      /* ---- Pavimento a griglia in prospettiva (reagisce al collasso) ---- */
      drawPerspectiveGrid(ctx, w, h, tSec, conv);

      /* ---- Vortice di particelle pseudo-3D con bloom (sprite) ---- */
      ctx.save();
      ctx.globalCompositeOperation = "lighter"; // additivo → bloom naturale

      // Spegnimento dopo il collasso per lasciare spazio al logo.
      const fadeParticles =
        t > T_CONVERGE_END
          ? Math.max(0, 1 - (t - T_CONVERGE_END) / 0.18)
          : 1;

      if (fadeParticles > 0.01) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          // Raggio orbitale che si contrae + ondulazione a spirale.
          const r =
            p.radius * (1 - conv) + 0.04 * Math.sin(p.angle * 3 + tSec);
          const a = p.angle + tSec * p.spin * (0.4 + conv * 1.4);
          const px = Math.cos(a) * r;
          const py = p.height * (1 - heightCollapse);
          const pz = Math.sin(a) * r;

          // Proiezione prospettica 3D→2D.
          const denom = CAM_Z - pz;
          if (denom <= 0.05) continue;
          const scale = FOV / denom;
          const sx = cx + px * scale;
          const sy = cy + py * scale;

          const depth = (pz + 1) / 2; // 0..1
          const baseAlpha = 0.25 + depth * 0.75;
          const alpha = baseAlpha * fadeParticles;
          if (alpha <= 0.01) continue;

          const radius = Math.max(
            0.6,
            p.size * (0.5 + depth) * (0.6 + conv * 0.9)
          );
          // Sprite di glow scelto per profondità: drawImage scalato (cheap).
          const step = Math.min(
            GLOW_STEPS - 1,
            Math.max(0, Math.round(depth * (GLOW_STEPS - 1)))
          );
          const sprite = p.hue === 0 ? glowCyan[step] : glowBlue[step];
          if (!sprite) continue;
          const d = radius * 4; // il glow è ~4× il core
          ctx.globalAlpha = alpha;
          ctx.drawImage(sprite, sx - d / 2, sy - d / 2, d, d);
        }
      }
      ctx.restore();
      ctx.globalAlpha = 1;

      /* ---- Lampo cyan secco al collasso ---- */
      if (t > T_FLASH - 0.09 && t < T_FLASH + 0.09) {
        const flash = Math.max(0, 1 - Math.abs(t - T_FLASH) / 0.09);
        if (flash > 0) {
          const g = ctx.createRadialGradient(
            cx,
            cy,
            0,
            cx,
            cy,
            Math.min(w, h) * 0.55
          );
          g.addColorStop(0, `rgba(200,240,255,${0.85 * flash})`);
          g.addColorStop(0.3, `rgba(61,156,199,${0.4 * flash})`);
          g.addColorStop(1, "rgba(61,156,199,0)");
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, w, h);
        }
      }

      /* ---- Logo DGF a fuoco (blur→nitido reale) con glow neon ---- */
      if (logoReady && t > T_LOGO_START) {
        const lt = easeExpo(clamp01((t - T_LOGO_START) / T_LOGO_IN));
        const aspect = logo.width / logo.height || 2.4;
        // Più grande (e più grande ancora su mobile) per leggere "TECH SOLUTIONS".
        const maxW = coarse ? w * 0.9 : w * 0.82;
        const targetW = Math.min(maxW, 820);
        const lw = targetW * (1.06 - 0.06 * lt); // overshoot 1.06→1
        const lh = lw / aspect;
        const lx = cx - lw / 2;
        const ly = cy - lh / 2;

        // Pad scuro pulito dietro al logo: spegne griglia/particelle nell'area
        // del marchio così "TECH SOLUTIONS" resta nitido e leggibile.
        const pad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(lw, lh) * 0.72);
        pad.addColorStop(0, `rgba(6,18,30,${0.82 * lt})`);
        pad.addColorStop(0.55, `rgba(6,18,30,${0.55 * lt})`);
        pad.addColorStop(1, "rgba(6,18,30,0)");
        ctx.fillStyle = pad;
        ctx.fillRect(0, 0, w, h);

        // Alone brand soft (additivo, contenuto) per il tocco neon.
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(lw, lh) * 0.75);
        halo.addColorStop(0, `rgba(61,156,199,${0.16 * lt})`);
        halo.addColorStop(0.6, `rgba(21,117,164,${0.06 * lt})`);
        halo.addColorStop(1, "rgba(21,117,164,0)");
        ctx.fillStyle = halo;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();

        // Glow neon leggero (logo sfocato, additivo, opacità bassa → non lava il testo).
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = 0.28 * lt;
        ctx.filter = "blur(6px)";
        ctx.drawImage(logo, lx, ly, lw, lh);
        ctx.filter = "none";
        ctx.restore();

        // Bordino BIANCO: stampo la silhouette bianca attorno al logo (8 direzioni)
        // così la scritta DGF stacca netta dallo sfondo. Solo a logo quasi a fuoco.
        if (logoWhite && lt > 0.15) {
          const bw = Math.max(2, lw * 0.0045); // spessore bordo (px display)
          const offs = [
            [-1, 0], [1, 0], [0, -1], [0, 1],
            [-1, -1], [1, -1], [-1, 1], [1, 1],
          ];
          ctx.save();
          ctx.globalAlpha = lt;
          for (const [ox, oy] of offs) {
            ctx.drawImage(logoWhite, lx + ox * bw, ly + oy * bw, lw, lh);
          }
          ctx.restore();
        }

        // Passaggio 2: logo nitido con blur→focus reale (ctx.filter).
        ctx.save();
        ctx.globalAlpha = lt;
        const focusBlur = (1 - lt) * 10; // 10px → 0px
        ctx.filter = focusBlur > 0.1 ? `blur(${focusBlur}px)` : "none";
        ctx.drawImage(logo, lx, ly, lw, lh);
        ctx.filter = "none";
        ctx.restore();
        ctx.globalAlpha = 1;
      }
    };

    const tick = (ts: number) => {
      // Tab in background: niente lavoro pesante, ma teniamo viva la catena.
      if (document.hidden) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      drawFrame(ts);
      const elapsed = startTs === 0 ? 0 : ts - startTs;
      // Si ferma quando l'animazione logica è finita: il fade dell'overlay è
      // gestito da framer-motion via CSS opacity sull'ultimo frame già dipinto.
      if (elapsed < DURATION_MS) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };

    resize();
    window.addEventListener("resize", resize);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      window.removeEventListener("resize", resize);
      logo.onload = null;
      logo.onerror = null;
    };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro-scene"
          className="fixed inset-0 z-[200] overflow-hidden"
          initial={{ opacity: 1, backgroundColor: NAVY_BG }}
          animate={{
            opacity: leaving ? 0 : 1,
            scale: leaving ? 1.02 : 1,
            // Bridge cromatico: l'Hero vive su sfondo bianco → in uscita
            // il fondo vira a bianco, niente stacco brusco scuro→chiaro.
            backgroundColor: leaving ? "#ffffff" : NAVY_BG,
          }}
          transition={{ duration: FADE_OUT_MS / 1000, ease }}
        >
          <canvas
            ref={canvasRef}
            aria-hidden
            className="absolute inset-0 h-full w-full"
          />

          {/* Skip: sempre raggiungibile da tastiera. */}
          <motion.button
            type="button"
            onClick={skip}
            aria-label="Salta l'introduzione"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: leaving ? 0 : 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: leaving ? 0 : 1.4 }}
            className="absolute bottom-6 right-6 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white/80 ring-1 ring-white/20 backdrop-blur-sm transition-colors duration-200 hover:bg-white/15 hover:text-white"
          >
            Salta intro
            <span aria-hidden>→</span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Pavimento a griglia in prospettiva: linee orizzontali che si addensano verso
 * un orizzonte alto + linee radiali che convergono al punto di fuga centrale.
 * Reagisce al collasso (`conv`): scorre più veloce e si illumina al climax.
 */
function drawPerspectiveGrid(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tSec: number,
  conv: number
) {
  const horizonY = h * 0.46;
  const vpX = w / 2;
  const bottom = h * 1.05;
  const boost = 1 + conv * 1.5; // luminosità che cresce col collasso

  ctx.save();
  ctx.lineWidth = 1;

  // Linee orizzontali (profondità). Scroll accelera verso il climax.
  const lines = 16;
  const scroll = (tSec * (0.35 + conv * 1.2)) % 1;
  for (let i = 0; i < lines; i++) {
    let f = (i + scroll) / lines;
    if (f > 1) f -= 1;
    const persp = Math.pow(f, 2.1);
    const y = horizonY + (bottom - horizonY) * persp;
    const alpha = (0.04 + persp * 0.1) * boost;
    ctx.strokeStyle = `rgba(61,156,199,${alpha})`;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Linee radiali che convergono al punto di fuga.
  const rays = 24;
  for (let i = 0; i <= rays; i++) {
    const fx = i / rays;
    const xBottom = -w * 0.5 + w * 2 * fx;
    ctx.strokeStyle = `rgba(21,117,164,${0.07 * boost})`;
    ctx.beginPath();
    ctx.moveTo(vpX, horizonY);
    ctx.lineTo(xBottom, bottom);
    ctx.stroke();
  }

  // Bagliore sull'orizzonte (punto di fuga), più intenso col collasso.
  const g = ctx.createRadialGradient(
    vpX,
    horizonY,
    0,
    vpX,
    horizonY,
    Math.min(w, h) * 0.4
  );
  g.addColorStop(0, `rgba(61,156,199,${0.12 * boost})`);
  g.addColorStop(1, "rgba(61,156,199,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  ctx.restore();
}

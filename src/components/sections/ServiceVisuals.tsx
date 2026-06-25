"use client";
import { useRef } from "react";
import { motion } from "framer-motion";

const SIZE = 360;
const STROKE = "#3d9cc7";
const STROKE_DEEP = "#1575a4";
const STROKE_FAINT = "rgba(61,156,199,0.35)";
const FILL_FAINT = "rgba(61,156,199,0.07)";
const FILL_GLOW = "rgba(21,117,164,0.18)";
const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

// REF is the reference timeline (in seconds) the absolute startAt values are written
// against. CYCLE is the actual playback duration. Lowering CYCLE compresses every
// service animation proportionally while preserving their relative phasing.
const REF = 7;
const CYCLE = 4.4;
const HOLD_UNTIL = 0.88;

function stage(startAt: number, opts?: { holdUntil?: number; fadeBy?: number }) {
  const t1 = Math.max(0.001, startAt / REF);
  const t2 = Math.min(0.99, (startAt + 0.5) / REF);
  return {
    initial: { opacity: 0 },
    animate: { opacity: [0, 0, 1, 1, 0] },
    transition: {
      duration: CYCLE,
      times: [0, t1, t2, opts?.holdUntil ?? HOLD_UNTIL, opts?.fadeBy ?? 1],
      repeat: Infinity,
      ease,
    },
  };
}

function drawWidth(startAt: number, finalWidth: number) {
  const t1 = startAt / REF;
  const t2 = (startAt + 0.65) / REF;
  return {
    initial: { width: 0, opacity: 0 },
    animate: {
      width: [0, 0, finalWidth, finalWidth, finalWidth],
      opacity: [0, 0, 1, 1, 0],
    },
    transition: {
      duration: CYCLE,
      times: [0, t1, t2, HOLD_UNTIL, 1],
      repeat: Infinity,
      ease,
    },
  };
}

function drawPath(startAt: number, drawSpan = 0.55) {
  const t1 = startAt / REF;
  const t2 = (startAt + drawSpan) / REF;
  return {
    initial: { pathLength: 0, opacity: 0 },
    animate: {
      pathLength: [0, 0, 1, 1, 1],
      opacity: [0, 0, 1, 1, 0],
    },
    transition: {
      duration: CYCLE,
      times: [0, t1, t2, HOLD_UNTIL, 1],
      repeat: Infinity,
      ease,
    },
  };
}

function Frame({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
    el.style.setProperty("--tx", `${(x - 0.5) * -10}px`);
    el.style.setProperty("--ty", `${(y - 0.5) * -10}px`);
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "50%");
    el.style.setProperty("--tx", "0px");
    el.style.setProperty("--ty", "0px");
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={
        {
          "--mx": "50%",
          "--my": "50%",
          "--tx": "0px",
          "--ty": "0px",
        } as React.CSSProperties
      }
      className="group relative aspect-square w-full max-w-[460px] overflow-hidden rounded-2xl"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(61,156,199,0.16) 0%, rgba(5,75,119,0.04) 55%, transparent 80%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(5,75,119,1) 1px, transparent 1px), linear-gradient(90deg, rgba(5,75,119,1) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-[700ms] ease-out group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(240px circle at var(--mx) var(--my), rgba(61,156,199,0.22), transparent 65%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-brand-cyan/15"
      />
      <div
        className="absolute inset-0 transition-transform duration-[700ms] ease-expo will-change-transform"
        style={{ transform: "translate3d(var(--tx), var(--ty), 0)" }}
      >
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="h-full w-full"
          fill="none"
        >
          {children}
        </svg>
      </div>
    </div>
  );
}

// 01 — Siti web: la pagina si costruisce un blocco alla volta
export function SitiVisual(): React.ReactElement {
  return (
    <Frame>
      <motion.rect
        x={50}
        y={50}
        width={260}
        height={260}
        rx={6}
        stroke={STROKE_FAINT}
        strokeWidth={1}
        fill="none"
        strokeDasharray="2 4"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0.5, 0.5, 0] }}
        transition={{
          duration: CYCLE,
          times: [0, 0.03, 0.08, HOLD_UNTIL, 1],
          repeat: Infinity,
          ease,
        }}
      />

      <motion.rect x={70} y={82} height={1.5} fill={STROKE} {...drawWidth(0.5, 220)} />

      <motion.g {...stage(1.15)}>
        <circle cx={78} cy={74} r={3.5} fill={STROKE} />
      </motion.g>
      {[0, 1, 2].map((i) => (
        <motion.g key={`nav-${i}`} {...stage(1.3 + i * 0.1)}>
          <circle cx={245 + i * 15} cy={74} r={2} fill={STROKE} opacity={0.7} />
        </motion.g>
      ))}

      <motion.rect
        x={70}
        y={120}
        height={10}
        rx={2}
        fill={STROKE_DEEP}
        fillOpacity={0.8}
        {...drawWidth(2.0, 180)}
      />
      <motion.rect
        x={70}
        y={140}
        height={8}
        rx={2}
        fill={STROKE}
        fillOpacity={0.4}
        {...drawWidth(2.4, 140)}
      />

      <motion.g {...stage(2.9)}>
        <rect
          x={70}
          y={163}
          width={64}
          height={20}
          rx={10}
          fill={STROKE}
          fillOpacity={0.15}
          stroke={STROKE}
          strokeWidth={1}
        />
        <rect x={80} y={171} width={32} height={4} rx={2} fill={STROKE} fillOpacity={0.7} />
      </motion.g>

      {[0, 1, 2].map((i) => (
        <motion.g key={`card-${i}`} {...stage(3.5 + i * 0.18)}>
          <rect
            x={70 + i * 77}
            y={205}
            width={66}
            height={66}
            rx={5}
            stroke={STROKE}
            strokeWidth={1}
            fill={FILL_FAINT}
          />
          <circle cx={70 + i * 77 + 14} cy={219} r={5} fill={STROKE} fillOpacity={0.5} />
          <rect
            x={78 + i * 77}
            y={246}
            width={32}
            height={4}
            rx={1.5}
            fill={STROKE}
            fillOpacity={0.7}
          />
          <rect
            x={78 + i * 77}
            y={256}
            width={22}
            height={3}
            rx={1.5}
            fill={STROKE}
            fillOpacity={0.35}
          />
        </motion.g>
      ))}

      <motion.rect
        x={70}
        y={290}
        height={1}
        fill={STROKE}
        fillOpacity={0.5}
        {...drawWidth(4.6, 220)}
      />
    </Frame>
  );
}

// 02 — E-commerce: 3 prodotti → selezione → carrello → checkout
export function EcommerceVisual(): React.ReactElement {
  const productX = [80, 155, 230];

  return (
    <Frame>
      {productX.map((x, i) => (
        <motion.g key={`p-${i}`} {...stage(0.5 + i * 0.25)}>
          <rect
            x={x}
            y={70}
            width={50}
            height={70}
            rx={4}
            stroke={STROKE}
            strokeWidth={1}
            fill={FILL_FAINT}
          />
          <circle cx={x + 25} cy={92} r={11} fill={STROKE} fillOpacity={0.4} />
          <rect x={x + 8} y={115} width={34} height={3} rx={1.5} fill={STROKE} fillOpacity={0.6} />
          <rect x={x + 8} y={123} width={22} height={3} rx={1.5} fill={STROKE} fillOpacity={0.35} />
          <rect
            x={x + 8}
            y={132}
            width={16}
            height={3}
            rx={1.5}
            fill={STROKE_DEEP}
            fillOpacity={0.7}
          />
        </motion.g>
      ))}

      <motion.rect
        x={153}
        y={68}
        width={54}
        height={74}
        rx={5}
        stroke={STROKE_DEEP}
        strokeWidth={1.5}
        fill="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0, 1, 1, 0, 0] }}
        transition={{
          duration: CYCLE,
          times: [0, 0.22, 0.26, 0.30, 0.48, 0.55, 1],
          repeat: Infinity,
          ease,
        }}
        style={{ filter: "drop-shadow(0 0 5px rgba(21,117,164,0.6))" }}
      />

      <motion.circle
        r={4}
        fill={STROKE_DEEP}
        initial={{ cx: 180, cy: 100, opacity: 0 }}
        animate={{
          cx: [180, 180, 180, 225, 225],
          cy: [105, 105, 105, 195, 195],
          opacity: [0, 0, 0, 1, 0],
        }}
        transition={{
          duration: CYCLE,
          times: [0, 0.45, 0.50, 0.62, 0.66],
          repeat: Infinity,
          ease,
        }}
        style={{ filter: "drop-shadow(0 0 6px rgba(21,117,164,0.8))" }}
      />

      <motion.g {...stage(2.5)}>
        <path
          d="M 200 178 L 250 178 L 245 212 L 205 212 Z"
          stroke={STROKE}
          strokeWidth={1.2}
          fill={FILL_FAINT}
        />
        <path
          d="M 195 175 L 200 175 L 202 168"
          stroke={STROKE}
          strokeWidth={1.2}
          fill="none"
        />
        <circle cx={213} cy={220} r={3} fill={STROKE} />
        <circle cx={237} cy={220} r={3} fill={STROKE} />
      </motion.g>

      <motion.circle
        cx={225}
        cy={195}
        r={26}
        stroke={STROKE_DEEP}
        strokeWidth={1}
        fill="none"
        initial={{ opacity: 0 }}
        animate={{
          r: [26, 26, 26, 26, 44, 44],
          opacity: [0, 0, 0, 0.7, 0, 0],
        }}
        transition={{
          duration: CYCLE,
          times: [0, 0.58, 0.62, 0.65, 0.78, 1],
          repeat: Infinity,
          ease,
        }}
      />

      <motion.g {...stage(3.5)}>
        <rect
          x={100}
          y={262}
          width={160}
          height={32}
          rx={16}
          stroke={STROKE_DEEP}
          strokeWidth={1}
          fill={FILL_GLOW}
        />
        <rect x={120} y={275} width={80} height={4} rx={2} fill={STROKE_DEEP} fillOpacity={0.8} />
        <path
          d="M 215 274 L 225 278 L 215 282"
          stroke={STROKE_DEEP}
          strokeWidth={1.2}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.g>

      <motion.rect
        x={100}
        y={262}
        width={160}
        height={32}
        rx={16}
        stroke={STROKE_DEEP}
        strokeWidth={1.5}
        fill="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0, 0, 0.6, 0, 0.6, 0, 0] }}
        transition={{
          duration: CYCLE,
          times: [0, 0.60, 0.63, 0.66, 0.69, 0.74, 0.77, 0.82, 1],
          repeat: Infinity,
          ease,
        }}
        style={{ filter: "drop-shadow(0 0 6px rgba(21,117,164,0.5))" }}
      />
    </Frame>
  );
}

// 03 — UI/UX: wireframe → componenti rifiniti
export function UiuxVisual(): React.ReactElement {
  return (
    <Frame>
      {[70, 190].map((x, i) => (
        <motion.rect
          key={`wire-${i}`}
          x={x}
          y={90}
          width={100}
          height={180}
          rx={6}
          stroke={STROKE}
          strokeWidth={1}
          fill="none"
          strokeDasharray="4 4"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 0.8, 0.8, 0.25, 0] }}
          transition={{
            duration: CYCLE,
            times: [0, 0.05 + i * 0.03, 0.14 + i * 0.03, 0.30, 0.42, HOLD_UNTIL],
            repeat: Infinity,
            ease,
          }}
        />
      ))}

      {[70, 190].map((x, i) => (
        <motion.rect
          key={`solid-${i}`}
          x={x}
          y={90}
          width={100}
          height={180}
          rx={6}
          stroke={STROKE}
          strokeWidth={1.2}
          fill={FILL_FAINT}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 0, 0, 1, 1, 0] }}
          transition={{
            duration: CYCLE,
            times: [0, 0.28 + i * 0.02, 0.34, 0.38, 0.44, HOLD_UNTIL, 1],
            repeat: Infinity,
            ease,
          }}
        />
      ))}

      <motion.g {...stage(3.4)}>
        <circle cx={95} cy={120} r={8} fill={STROKE} fillOpacity={0.5} />
        <rect x={110} y={117} width={50} height={3.5} rx={1.5} fill={STROKE} fillOpacity={0.7} />
        <rect x={110} y={124} width={32} height={3} rx={1.5} fill={STROKE} fillOpacity={0.4} />
      </motion.g>
      <motion.g {...stage(3.6)}>
        <rect x={82} y={148} width={76} height={3.5} rx={2} fill={STROKE} fillOpacity={0.5} />
        <rect x={82} y={158} width={60} height={3.5} rx={2} fill={STROKE} fillOpacity={0.5} />
        <rect x={82} y={168} width={68} height={3.5} rx={2} fill={STROKE} fillOpacity={0.5} />
      </motion.g>
      <motion.g {...stage(3.85)}>
        <rect
          x={82}
          y={224}
          width={76}
          height={22}
          rx={11}
          fill={STROKE_DEEP}
          fillOpacity={0.75}
        />
        <rect x={104} y={232} width={32} height={5} rx={2.5} fill="white" fillOpacity={0.8} />
      </motion.g>

      <motion.g {...stage(3.5)}>
        <rect x={205} y={110} width={70} height={4} rx={2} fill={STROKE} fillOpacity={0.65} />
        <rect x={205} y={120} width={45} height={3} rx={1.5} fill={STROKE} fillOpacity={0.35} />
      </motion.g>
      <motion.g {...stage(3.8)}>
        <rect x={205} y={150} width={12} height={36} fill={STROKE} fillOpacity={0.5} />
        <rect x={222} y={140} width={12} height={46} fill={STROKE} fillOpacity={0.75} />
        <rect x={239} y={160} width={12} height={26} fill={STROKE} fillOpacity={0.4} />
        <rect x={256} y={148} width={12} height={38} fill={STROKE} fillOpacity={0.6} />
      </motion.g>
      <motion.g {...stage(4.1)}>
        <line x1={205} y1={200} x2={275} y2={200} stroke={STROKE} strokeWidth={0.5} opacity={0.4} />
        <line x1={205} y1={228} x2={275} y2={228} stroke={STROKE} strokeWidth={0.5} opacity={0.4} />
        <rect x={205} y={240} width={28} height={3} rx={1.5} fill={STROKE} fillOpacity={0.5} />
      </motion.g>

      {[
        [70, 90],
        [170, 90],
        [70, 270],
        [170, 270],
      ].map(([x, y], i) => (
        <motion.circle
          key={`h-${i}`}
          cx={x}
          cy={y}
          r={3}
          fill="white"
          stroke={STROKE}
          strokeWidth={1}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 0.8, 0.8, 0.15, 0.15, 0] }}
          transition={{
            duration: CYCLE,
            times: [0, 0.12, 0.18, 0.32, 0.42, HOLD_UNTIL, 1],
            repeat: Infinity,
            ease,
          }}
        />
      ))}
    </Frame>
  );
}

// 04 — Software: diagramma di workflow con moduli connessi e dati che scorrono
export function SoftwareVisual(): React.ReactElement {
  const MW = 66;
  const MH = 40;
  const modules = [
    { id: "m1", x: 46,  y: 100, accent: STROKE_DEEP },
    { id: "m2", x: 148, y: 100, accent: STROKE_DEEP },
    { id: "m3", x: 250, y: 100, accent: STROKE_DEEP },
    { id: "m4", x: 148, y: 220, accent: STROKE },
    { id: "m5", x: 250, y: 220, accent: STROKE },
  ];

  // Edges between modules: from-right-edge → to-left-edge (or top edge for verticals)
  const horizontal = [
    { x1: 46 + MW,  y: 120, x2: 148,       y2: 120, delay: 2.5 }, // m1 → m2
    { x1: 148 + MW, y: 120, x2: 250,       y2: 120, delay: 2.9 }, // m2 → m3
  ];
  const vertical = [
    { x: 180, y1: 100 + MH, y2: 220, delay: 3.3 }, // m2 → m4
    { x: 282, y1: 100 + MH, y2: 220, delay: 3.7 }, // m3 → m5
  ];

  return (
    <Frame>
      {/* Connection lines (drawn first so modules sit on top) */}
      {horizontal.map((e, i) => (
        <motion.line
          key={`he-${i}`}
          x1={e.x1}
          y1={e.y}
          x2={e.x2}
          y2={e.y2}
          stroke={STROKE}
          strokeWidth={1.2}
          strokeOpacity={0.55}
          {...drawPath(1.5 + i * 0.15, 0.4)}
        />
      ))}
      {vertical.map((e, i) => (
        <motion.line
          key={`ve-${i}`}
          x1={e.x}
          y1={e.y1}
          x2={e.x}
          y2={e.y2}
          stroke={STROKE}
          strokeWidth={1.2}
          strokeOpacity={0.55}
          {...drawPath(1.8 + i * 0.15, 0.45)}
        />
      ))}

      {/* Arrowheads at end of each connection */}
      {horizontal.map((e, i) => (
        <motion.path
          key={`ha-${i}`}
          d={`M ${e.x2 - 5} ${e.y - 4} L ${e.x2} ${e.y} L ${e.x2 - 5} ${e.y + 4}`}
          stroke={STROKE}
          strokeWidth={1.2}
          strokeOpacity={0.6}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 0, 0.6, 0.6, 0] }}
          transition={{
            duration: CYCLE,
            times: [0, 0.22, 0.30, 0.34, HOLD_UNTIL, 1],
            repeat: Infinity,
            ease,
          }}
        />
      ))}
      {vertical.map((e, i) => (
        <motion.path
          key={`va-${i}`}
          d={`M ${e.x - 4} ${e.y2 - 5} L ${e.x} ${e.y2} L ${e.x + 4} ${e.y2 - 5}`}
          stroke={STROKE}
          strokeWidth={1.2}
          strokeOpacity={0.6}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 0, 0.6, 0.6, 0] }}
          transition={{
            duration: CYCLE,
            times: [0, 0.26, 0.32, 0.36, HOLD_UNTIL, 1],
            repeat: Infinity,
            ease,
          }}
        />
      ))}

      {/* Modules */}
      {modules.map((m, i) => (
        <motion.g key={m.id} {...stage(0.3 + i * 0.18)}>
          <rect
            x={m.x}
            y={m.y}
            width={MW}
            height={MH}
            rx={6}
            stroke={STROKE}
            strokeWidth={1.3}
            fill="white"
          />
          {/* Accent strip on left */}
          <rect x={m.x} y={m.y} width={4} height={MH} rx={2} fill={m.accent} fillOpacity={0.85} />
          {/* Status LED */}
          <circle cx={m.x + 12} cy={m.y + 11} r={2.5} fill={m.accent} />
          {/* Content bars */}
          <rect x={m.x + 19} y={m.y + 9} width={32} height={3.5} rx={1.5} fill={STROKE} fillOpacity={0.7} />
          <rect x={m.x + 12} y={m.y + 22} width={MW - 22} height={3} rx={1.5} fill={STROKE} fillOpacity={0.45} />
          <rect x={m.x + 12} y={m.y + 30} width={MW - 36} height={3} rx={1.5} fill={STROKE} fillOpacity={0.3} />
        </motion.g>
      ))}

      {/* Data packets flowing along edges */}
      {[...horizontal, ...horizontal.map((h) => ({ ...h, delay: h.delay + 1.9 }))].map((e, i) => {
        const start = e.delay;
        return (
          <motion.circle
            key={`hp-${i}`}
            r={3.2}
            fill={STROKE_DEEP}
            initial={{ cx: e.x1, cy: e.y, opacity: 0 }}
            animate={{
              cx: [e.x1, e.x1, e.x2, e.x2],
              cy: [e.y, e.y, e.y2, e.y2],
              opacity: [0, 0, 1, 0],
            }}
            transition={{
              duration: CYCLE,
              times: [0, start / REF, (start + 0.45) / REF, (start + 0.55) / REF],
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ filter: "drop-shadow(0 0 4px rgba(21,117,164,0.8))" }}
          />
        );
      })}
      {vertical.map((e, i) => {
        const start = e.delay;
        return (
          <motion.circle
            key={`vp-${i}`}
            r={3.2}
            fill={STROKE_DEEP}
            initial={{ cx: e.x, cy: e.y1, opacity: 0 }}
            animate={{
              cx: [e.x, e.x, e.x, e.x],
              cy: [e.y1, e.y1, e.y2, e.y2],
              opacity: [0, 0, 1, 0],
            }}
            transition={{
              duration: CYCLE,
              times: [0, start / REF, (start + 0.5) / REF, (start + 0.6) / REF],
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ filter: "drop-shadow(0 0 4px rgba(21,117,164,0.8))" }}
          />
        );
      })}
    </Frame>
  );
}

// Sparkle (4-point) — universal AI symbol
function sparklePath(cx: number, cy: number, s: number): string {
  return `M ${cx},${cy - s} Q ${cx},${cy} ${cx + s},${cy} Q ${cx},${cy} ${cx},${cy + s} Q ${cx},${cy} ${cx - s},${cy} Q ${cx},${cy} ${cx},${cy - s} Z`;
}

// 05 — AI: conversazione chat con sparkle (l'icona universale degli assistenti)
export function AiVisual(): React.ReactElement {
  const userBubble = { x: 150, y: 72, w: 140, h: 38 };
  const aiBubble = { x: 70, y: 160, w: 200, h: 110 };

  const aiLines = [
    { y: aiBubble.y + 18, len: 165 },
    { y: aiBubble.y + 34, len: 130 },
    { y: aiBubble.y + 50, len: 170 },
    { y: aiBubble.y + 66, len: 110 },
    { y: aiBubble.y + 82, len: 145 },
  ];

  const sparkles = [
    { x: 260, y: 145, size: 7, delay: 2.9 },
    { x: 56,  y: 230, size: 6, delay: 3.3 },
    { x: 282, y: 250, size: 8, delay: 3.6 },
    { x: 48,  y: 190, size: 5, delay: 3.1 },
    { x: 290, y: 195, size: 5, delay: 3.8 },
  ];

  return (
    <Frame>
      {/* User bubble (top-right, filled) */}
      <motion.g {...stage(0.4)}>
        <rect
          x={userBubble.x}
          y={userBubble.y}
          width={userBubble.w}
          height={userBubble.h}
          rx={19}
          fill={STROKE_DEEP}
          fillOpacity={0.88}
        />
        <path
          d={`M ${userBubble.x + userBubble.w - 14} ${userBubble.y + userBubble.h} L ${userBubble.x + userBubble.w + 4} ${userBubble.y + userBubble.h + 10} L ${userBubble.x + userBubble.w - 4} ${userBubble.y + userBubble.h - 4} Z`}
          fill={STROKE_DEEP}
          fillOpacity={0.88}
        />
        <rect x={userBubble.x + 16} y={userBubble.y + 14} width={88} height={4} rx={2} fill="white" fillOpacity={0.92} />
        <rect x={userBubble.x + 16} y={userBubble.y + 23} width={56} height={4} rx={2} fill="white" fillOpacity={0.65} />
      </motion.g>

      {/* Sparkle "AI" badge between bubbles */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1, 1, 0] }}
        transition={{
          duration: CYCLE,
          times: [0, 0.18, 0.26, HOLD_UNTIL, 1],
          repeat: Infinity,
          ease,
        }}
      >
        <path d={sparklePath(72, 142, 11)} fill={STROKE_DEEP} />
        <path d={sparklePath(86, 130, 5)} fill={STROKE_DEEP} fillOpacity={0.7} />
        <path d={sparklePath(58, 154, 4)} fill={STROKE_DEEP} fillOpacity={0.55} />
      </motion.g>

      {/* AI response bubble (bottom-left, outlined) */}
      <motion.g {...stage(1.05)}>
        <rect
          x={aiBubble.x}
          y={aiBubble.y}
          width={aiBubble.w}
          height={aiBubble.h}
          rx={16}
          stroke={STROKE}
          strokeWidth={1.4}
          fill="white"
        />
        <path
          d={`M ${aiBubble.x + 14} ${aiBubble.y + aiBubble.h} L ${aiBubble.x - 4} ${aiBubble.y + aiBubble.h + 10} L ${aiBubble.x + 4} ${aiBubble.y + aiBubble.h - 4} Z`}
          stroke={STROKE}
          strokeWidth={1.4}
          fill="white"
        />
      </motion.g>

      {/* AI response text lines — typing in */}
      {aiLines.map((line, i) => (
        <motion.rect
          key={`r-${i}`}
          x={aiBubble.x + 16}
          y={line.y}
          height={4}
          rx={2}
          fill={STROKE}
          fillOpacity={i === 0 ? 0.85 : 0.55}
          {...drawWidth(2.4 + i * 0.45, line.len)}
        />
      ))}

      {/* Twinkling sparkles around AI bubble */}
      {sparkles.map((s, i) => (
        <motion.path
          key={`spk-${i}`}
          d={sparklePath(s.x, s.y, s.size)}
          fill={STROKE}
          fillOpacity={0.85}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 0, 1, 0.4, 1, 0, 0] }}
          transition={{
            duration: CYCLE,
            times: [
              0,
              s.delay / REF,
              (s.delay + 0.1) / REF,
              (s.delay + 0.4) / REF,
              (s.delay + 0.7) / REF,
              (s.delay + 1.0) / REF,
              HOLD_UNTIL,
              1,
            ],
            repeat: Infinity,
            ease,
          }}
        />
      ))}
    </Frame>
  );
}

// 06 — Consulenza: caos disperso → roadmap chiara con milestone
export function ConsulenzaVisual(): React.ReactElement {
  const N = 6;
  const lineY = 210;
  const startX = 62;
  const endX = 298;
  const step = (endX - startX) / (N - 1);

  const seed = (i: number) => {
    const s = Math.sin(i * 91.31 + 1.3) * 43758.5453;
    return s - Math.floor(s);
  };

  // Each dot has its own landing time so the snap-in is sequential
  const dots = Array.from({ length: N }, (_, i) => ({
    rx: SIZE / 2 + (seed(i * 2) - 0.5) * 250,
    ry: SIZE / 2 + (seed(i * 2 + 1) - 0.5) * 210,
    tx: startX + i * step,
    ty: lineY,
    land: 0.50 + i * 0.04,   // dot 0 lands at 0.50, dot 5 at 0.70
  }));

  // Build a safe times array: clamps extras so nothing exceeds HOLD_UNTIL
  const lt = (land: number, ...extras: number[]): number[] => {
    const out: number[] = [0];
    for (const e of extras) {
      const v = Math.min(land + e, HOLD_UNTIL - 0.005 * (extras.length - extras.indexOf(e)));
      out.push(Math.max(v, out[out.length - 1] + 0.001));
    }
    out.push(1);
    return out;
  };

  return (
    <Frame>
      {/* === Chaos cloud: 30 particles, staggered entry === */}
      {Array.from({ length: 30 }, (_, i) => {
        const x = seed(i * 3 + 7) * 285 + 37;
        const y = seed(i * 3 + 8) * 285 + 37;
        const r = 1.2 + seed(i * 3 + 9) * 2.6;
        const fi = 0.04 + (i % 6) * 0.012;
        return (
          <motion.circle
            key={`bg-${i}`}
            cx={x}
            cy={y}
            r={r}
            fill={STROKE}
            fillOpacity={0.55}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 0.72, 0.72, 0, 0] }}
            transition={{
              duration: CYCLE,
              times: [0, fi, fi + 0.09, 0.30, 0.46, 1],
              repeat: Infinity,
              ease,
              delay: seed(i + 50) * 0.20,
            }}
          />
        );
      })}

      {/* === Milestone dots: scatter → snap to line with spring bounce === */}
      {dots.map((d, i) => {
        const l = d.land;
        const t = [0, 0.10, 0.28, l, l + 0.03, l + 0.08, l + 0.13, HOLD_UNTIL, 1];
        return (
          <motion.circle
            key={`m-${i}`}
            r={5.5}
            fill="white"
            stroke={STROKE_DEEP}
            strokeWidth={2}
            style={{
              filter: "drop-shadow(0 0 8px rgba(21,117,164,0.9))",
              transformBox: "fill-box",
              transformOrigin: "center",
            }}
            initial={{ cx: d.rx, cy: d.ry, opacity: 0 }}
            animate={{
              cx:      [d.rx, d.rx, d.rx, d.tx, d.tx, d.tx, d.tx, d.tx, d.tx],
              cy:      [d.ry, d.ry, d.ry, d.ty, d.ty, d.ty, d.ty, d.ty, d.ty],
              opacity: [0,    0,    0.85, 1,    1,    1,    1,    1,    0   ],
              scale:   [1,    1,    1,    1,    1.75, 0.82, 1.12, 1,    1   ],
            }}
            transition={{ duration: CYCLE, times: t, repeat: Infinity, ease }}
          />
        );
      })}

      {/* === Impact ripple: ring bursts from each dot on landing === */}
      {dots.map((d, i) => {
        const l = d.land;
        const t = [0, Math.max(l - 0.01, 0.01), l + 0.01, l + 0.13, 1];
        return (
          <motion.circle
            key={`ripple-${i}`}
            cx={d.tx}
            cy={d.ty}
            fill="none"
            stroke={STROKE}
            strokeWidth={1.2}
            initial={{ r: 5.5, opacity: 0 }}
            animate={{
              r:       [5.5, 5.5, 22,   22,   22  ],
              opacity: [0,   0,   0.85, 0,    0   ],
            }}
            transition={{ duration: CYCLE, times: t, repeat: Infinity, ease }}
          />
        );
      })}

      {/* === Timeline line — draws AFTER early dots land, glows === */}
      <motion.line
        x1={startX}
        y1={lineY}
        x2={endX}
        y2={lineY}
        stroke={STROKE_DEEP}
        strokeWidth={2}
        strokeOpacity={0.75}
        style={{ filter: "drop-shadow(0 0 6px rgba(21,117,164,0.7))" }}
        {...drawPath(4.2, 0.5)}
      />

      {/* === Milestone numbers above each dot === */}
      {dots.map((d, i) => {
        const t1 = Math.min(d.land + 0.10, HOLD_UNTIL - 0.04);
        const t2 = Math.min(t1 + 0.06, HOLD_UNTIL - 0.01);
        return (
          <motion.text
            key={`num-${i}`}
            x={d.tx}
            y={lineY - 14}
            textAnchor="middle"
            fontSize={7.5}
            fill={STROKE}
            fontFamily="monospace"
            letterSpacing="0.08em"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 0.9, 0.9, 0] }}
            transition={{
              duration: CYCLE,
              times: [0, t1, t2, HOLD_UNTIL, 1],
              repeat: Infinity,
              ease,
            }}
          >
            {`0${i + 1}`}
          </motion.text>
        );
      })}

      {/* === Tick marks below line === */}
      {dots.map((d, i) => {
        const t1 = Math.min(d.land + 0.08, HOLD_UNTIL - 0.05);
        const t2 = Math.min(t1 + 0.05, HOLD_UNTIL - 0.01);
        return (
          <motion.line
            key={`tick-${i}`}
            x1={d.tx}
            y1={lineY + 10}
            x2={d.tx}
            y2={lineY + 19}
            stroke={STROKE_DEEP}
            strokeWidth={1.5}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 0.8, 0.8, 0] }}
            transition={{
              duration: CYCLE,
              times: [0, t1, t2, HOLD_UNTIL, 1],
              repeat: Infinity,
              ease,
            }}
          />
        );
      })}

      {/* === Label bars below ticks === */}
      {dots.map((d, i) => {
        const t1 = Math.min(d.land + 0.13, HOLD_UNTIL - 0.02);
        return (
          <motion.rect
            key={`label-${i}`}
            x={d.tx - 14}
            y={lineY + 25}
            width={28}
            height={4}
            rx={2}
            fill={STROKE}
            fillOpacity={0.5}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0.7, 0] }}
            transition={{
              duration: CYCLE,
              times: [0, t1, HOLD_UNTIL, 1],
              repeat: Infinity,
              ease,
            }}
          />
        );
      })}
    </Frame>
  );
}

"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { geoOrthographic, geoPath, geoContains } from "d3-geo";
import { feature } from "topojson-client";
import worldTopology from "world-atlas/land-110m.json";
import type { Topology } from "topojson-specification";
import type { Feature, MultiPolygon } from "geojson";

const VIEW_W = 1200;
const VIEW_H = 700;
const CX = 600;
const CY = 350;
const R = 280;

// Minimalist monochrome palette
const COL_LAND_STROKE = "#cbd5e1";
const COL_MESH = "#cbd5e1";
const COL_NODE = "#5b9fc9";
const COL_PRIMARY = "#1575a4";
const COL_SIGNAL = "#3d9cc7";
const COL_MESH_SIGNAL = "#7fc0e0";
const COL_ORIGIN = "#0e3a5f";
const COL_ORIGIN_RING = "#3d9cc7";

const CANDIDATE_COUNT = 320;
const K_NEAREST = 5;
const PRIMARY_COUNT = 14;

const MESSINA_LAT = 38.19;
const MESSINA_LNG = 15.55;

const PARALLAX_Y = 0.18;
const PARALLAX_X = 0.11;
const SMOOTH = 0.06;
const ROT_SPEED = 0.025; // slow continuous spin

// PSX-style flat-shading palette (limited blues).
const PSX_PALETTE = [
  "#0a1e36",
  "#13345a",
  "#1c4d80",
  "#2768a3",
  "#3a86c2",
  "#5fa3d7",
];

function psxColor(lit: number): string {
  const idx = Math.min(
    PSX_PALETTE.length - 1,
    Math.max(0, Math.floor(lit * PSX_PALETTE.length))
  );
  return PSX_PALETTE[idx];
}

// PSX vertex jitter: pseudo-random sub-pixel wobble + integer snap.
function jitter(v: number, t: number, seed: number): number {
  const w = Math.sin(t * 7 + seed * 1.7) * 0.5;
  return Math.round(v + w);
}

const topology = worldTopology as unknown as Topology;
const landFeature = feature(
  topology,
  topology.objects.land
) as unknown as Feature<MultiPolygon>;

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

function latLngTo3D(lat: number, lng: number): Vec3 {
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;
  return {
    x: Math.cos(latRad) * Math.sin(lngRad),
    y: Math.sin(latRad),
    z: Math.cos(latRad) * Math.cos(lngRad),
  };
}

function vec3ToLatLng(v: Vec3): [number, number] {
  const lat = (Math.asin(v.y) * 180) / Math.PI;
  const lng = (Math.atan2(v.x, v.z) * 180) / Math.PI;
  return [lng, lat];
}

const LAND_NODES: Vec3[] = (() => {
  const out: Vec3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < CANDIDATE_COUNT; i++) {
    const y = 1 - (i / (CANDIDATE_COUNT - 1)) * 2;
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    const v: Vec3 = {
      x: Math.cos(theta) * radius,
      y,
      z: Math.sin(theta) * radius,
    };
    const [lng, lat] = vec3ToLatLng(v);
    if (geoContains(landFeature, [lng, lat])) out.push(v);
  }
  return out;
})();

const MESSINA_3D = latLngTo3D(MESSINA_LAT, MESSINA_LNG);
const ALL_NODES: Vec3[] = [MESSINA_3D, ...LAND_NODES];

interface MeshEdge {
  a: number;
  b: number;
}

const MESH_EDGES: MeshEdge[] = (() => {
  const edges: MeshEdge[] = [];
  const seen = new Set<string>();
  for (let i = 1; i < ALL_NODES.length; i++) {
    const node = ALL_NODES[i];
    const dists: Array<{ j: number; d: number }> = [];
    for (let j = 1; j < ALL_NODES.length; j++) {
      if (j === i) continue;
      const dx = node.x - ALL_NODES[j].x;
      const dy = node.y - ALL_NODES[j].y;
      const dz = node.z - ALL_NODES[j].z;
      dists.push({ j, d: dx * dx + dy * dy + dz * dz });
    }
    dists.sort((a, b) => a.d - b.d);
    for (let n = 0; n < K_NEAREST && n < dists.length; n++) {
      const j = dists[n].j;
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push({ a: i, b: j });
    }
  }
  return edges;
})();

// Triangulated faces from KNN edges → low-poly look.
const TRIANGLES: Array<[number, number, number]> = (() => {
  const adj = new Map<number, Set<number>>();
  for (const e of MESH_EDGES) {
    if (!adj.has(e.a)) adj.set(e.a, new Set());
    if (!adj.has(e.b)) adj.set(e.b, new Set());
    adj.get(e.a)!.add(e.b);
    adj.get(e.b)!.add(e.a);
  }
  const seen = new Set<string>();
  const tris: Array<[number, number, number]> = [];
  for (const [a, neighbors] of adj.entries()) {
    const arr = [...neighbors];
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        const b = arr[i];
        const c = arr[j];
        if (adj.get(b)?.has(c)) {
          const sorted = [a, b, c].sort((x, y) => x - y) as [number, number, number];
          const key = sorted.join("-");
          if (!seen.has(key)) {
            seen.add(key);
            tris.push(sorted);
          }
        }
      }
    }
  }
  return tris;
})();

const PRIMARY_TARGETS: number[] = (() => {
  const dists = LAND_NODES.map((n, i) => {
    const dx = n.x - MESSINA_3D.x;
    const dy = n.y - MESSINA_3D.y;
    const dz = n.z - MESSINA_3D.z;
    return { idx: i + 1, d: dx * dx + dy * dy + dz * dz };
  }).sort((a, b) => a.d - b.d);
  const step = Math.max(1, Math.floor(dists.length / PRIMARY_COUNT));
  const out: number[] = [];
  for (let i = 0; i < PRIMARY_COUNT && i * step < dists.length; i++) {
    out.push(dists[i * step].idx);
  }
  return out;
})();

interface Projected {
  x: number;
  y: number;
  z: number;
}

function project(v: Vec3, rotY: number, rotX: number): Projected {
  const cosY = Math.cos(rotY);
  const sinY = Math.sin(rotY);
  const x1 = v.x * cosY + v.z * sinY;
  const z1 = -v.x * sinY + v.z * cosY;
  const cosX = Math.cos(rotX);
  const sinX = Math.sin(rotX);
  const y2 = v.y * cosX - z1 * sinX;
  const z2 = v.y * sinX + z1 * cosX;
  // Math.cos/sin ULP differences between Node SSR and Chrome V8 leak into JSX
  // attributes and trigger hydration mismatches. Rounding to 2 decimals (sub-pixel
  // precision) eliminates the drift without any visible quality loss.
  return {
    x: Math.round((CX + x1 * R) * 100) / 100,
    y: Math.round((CY - y2 * R) * 100) / 100,
    z: z2,
  };
}

const BASE_ROT_Y = -(MESSINA_LNG * Math.PI) / 180;
const BASE_ROT_X = (MESSINA_LAT * Math.PI) / 180;
const FRONT_THRESHOLD = -0.06;

export function HeroBackground() {
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  // Tempo di animazione accumulato: persiste tra una pausa e l'altra così la
  // rotazione riprende senza scatti quando il globo rientra nel viewport.
  const elapsedRef = useRef(0);
  const [state, setState] = useState({ time: 0, mx: 0, my: 0 });
  // Parte true così SSR e primo paint disegnano già il globo (è above the fold).
  const [inView, setInView] = useState(true);

  // Sospende il loop di animazione quando la hero è fuori dallo schermo:
  // niente setState a 60fps né re-render dell'SVG mentre si guarda altro.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion || !inView) return;

    const handleMouse = (e: MouseEvent) => {
      targetRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", handleMouse);

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      elapsedRef.current += (now - last) / 1000;
      last = now;
      setState((prev) => ({
        time: elapsedRef.current,
        mx: prev.mx + (targetRef.current.x - prev.mx) * SMOOTH,
        my: prev.my + (targetRef.current.y - prev.my) * SMOOTH,
      }));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMouse);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion, inView]);

  const rotY =
    BASE_ROT_Y + state.mx * PARALLAX_Y - (reducedMotion ? 0 : state.time * ROT_SPEED);
  const rotX = BASE_ROT_X - state.my * PARALLAX_X;

  const projected = useMemo(
    () => ALL_NODES.map((n) => project(n, rotY, rotX)),
    [rotY, rotX]
  );

  const landPath = useMemo(() => {
    const proj = geoOrthographic()
      .scale(R)
      .translate([CX, CY])
      .clipAngle(90)
      .rotate([(rotY * 180) / Math.PI, -(rotX * 180) / Math.PI]);
    return geoPath(proj)(landFeature) || "";
  }, [rotY, rotX]);

  const messina = projected[0];
  const messinaVisible = messina.z > FRONT_THRESHOLD;

  const pulseA = (state.time % 3.6) / 3.6;
  const pulseB = ((state.time + 1.8) % 3.6) / 3.6;

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ backgroundColor: "#ffffff" }}
    >
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        fill="none"
      >
        <defs>
          <radialGradient id="haloGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="78%" stopColor="#9ccfe4" stopOpacity="0" />
            <stop offset="92%" stopColor="#9ccfe4" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#9ccfe4" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="specular" cx="0.32" cy="0.28" r="0.45">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
            <stop offset="55%" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="messinaBloom">
            <stop offset="0%" stopColor="#3d9cc7" stopOpacity="0.45" />
            <stop offset="55%" stopColor="#3d9cc7" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#3d9cc7" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Smooth outer atmospheric halo */}
        <circle cx={CX} cy={CY} r={R * 1.18} fill="url(#haloGlow)" />

        {/* Soft specular highlight on the sphere */}
        <circle cx={CX} cy={CY} r={R} fill="url(#specular)" />

        {/* Continents — stroke only, minimalist */}
        <path
          d={landPath}
          fill="none"
          stroke="#a8c8e8"
          strokeWidth={1.0}
          strokeOpacity={0.9}
          strokeLinejoin="round"
        />

        {/* Mesh triangles — minimal wireframe outlines */}
        {TRIANGLES.map((tri, i) => {
          const pa = projected[tri[0]];
          const pb = projected[tri[1]];
          const pc = projected[tri[2]];
          if (
            pa.z < FRONT_THRESHOLD ||
            pb.z < FRONT_THRESHOLD ||
            pc.z < FRONT_THRESHOLD
          )
            return null;
          const depth = (pa.z + pb.z + pc.z) / 3;
          const op = Math.max(0.06, 0.12 + Math.max(0, depth) * 0.12);
          return (
            <polygon
              key={`t-${i}`}
              points={`${pa.x},${pa.y} ${pb.x},${pb.y} ${pc.x},${pc.y}`}
              fill="none"
              stroke={COL_NODE}
              strokeWidth={0.5}
              strokeOpacity={op * 1.6}
              strokeLinejoin="round"
            />
          );
        })}


        {/* Primary connections from Messina */}
        {messinaVisible &&
          PRIMARY_TARGETS.map((targetIdx, i) => {
            const a = messina;
            const b = projected[targetIdx];
            if (b.z < FRONT_THRESHOLD) return null;
            const depth = (a.z + b.z) / 2;
            const op = Math.max(0.25, 0.4 + depth * 0.2);
            return (
              <line
                key={`p-${i}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={COL_PRIMARY}
                strokeWidth={0.7}
                strokeOpacity={op}
                strokeLinecap="round"
              />
            );
          })}

        {/* Sphere outline (very subtle) */}
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke={COL_LAND_STROKE}
          strokeWidth={0.5}
          strokeOpacity={0.4}
        />

        {/* Land nodes */}
        {projected.slice(1).map((p, i) => {
          if (p.z < FRONT_THRESHOLD) return null;
          const depth = (p.z + 1) / 2;
          const phase = (state.time * 0.7 + i * 0.31) % (Math.PI * 2);
          const pulse = 0.5 + 0.5 * Math.sin(phase);
          const baseR = 1.6 + pulse * 0.5;
          const baseOp = 0.7 + depth * 0.3;
          return (
            <circle
              key={`n-${i}`}
              cx={p.x}
              cy={p.y}
              r={baseR}
              fill={COL_NODE}
              fillOpacity={baseOp}
            />
          );
        })}

        {/* Signal pulses */}
        {!reducedMotion &&
          messinaVisible &&
          PRIMARY_TARGETS.map((targetIdx, i) => {
            const a = messina;
            const b = projected[targetIdx];
            if (b.z < FRONT_THRESHOLD) return null;
            const period = 5.5 + (i % 4) * 0.9;
            const offset = (i * 0.27) % 1;
            const prog = ((state.time / period) + offset) % 1;
            const fade = Math.sin(prog * Math.PI);
            if (fade < 0.05) return null;
            const sx = a.x + (b.x - a.x) * prog;
            const sy = a.y + (b.y - a.y) * prog;
            return (
              <circle
                key={`sig-${i}`}
                cx={sx}
                cy={sy}
                r={1.8}
                fill={COL_SIGNAL}
                fillOpacity={fade * 0.95}
              />
            );
          })}

        {/* Mesh signal pulses — packets between non-Messina nodes */}
        {!reducedMotion &&
          MESH_EDGES.filter((_, i) => i % 5 === 0).map((e, i) => {
            const a = projected[e.a];
            const b = projected[e.b];
            if (a.z < FRONT_THRESHOLD || b.z < FRONT_THRESHOLD) return null;
            const period = 9 + (i % 5) * 1.1;
            const offset = (i * 0.19) % 1;
            const prog = ((state.time / period) + offset) % 1;
            const fade = Math.sin(prog * Math.PI);
            if (fade < 0.05) return null;
            const sx = a.x + (b.x - a.x) * prog;
            const sy = a.y + (b.y - a.y) * prog;
            return (
              <circle
                key={`ms-${i}`}
                cx={sx}
                cy={sy}
                r={1.3}
                fill={COL_MESH_SIGNAL}
                fillOpacity={fade * 0.75}
              />
            );
          })}

        {/* Messina source — only colored accent in the otherwise monochrome globe */}
        {messinaVisible && (
          <g>
            <circle
              cx={messina.x}
              cy={messina.y}
              r={30}
              fill="url(#messinaBloom)"
            />
            {!reducedMotion && (
              <>
                <circle
                  cx={messina.x}
                  cy={messina.y}
                  r={5 + pulseA * 22}
                  fill="none"
                  stroke={COL_ORIGIN_RING}
                  strokeWidth={1.2}
                  strokeOpacity={0.8 * (1 - pulseA)}
                />
                <circle
                  cx={messina.x}
                  cy={messina.y}
                  r={5 + pulseB * 22}
                  fill="none"
                  stroke={COL_ORIGIN_RING}
                  strokeWidth={1.2}
                  strokeOpacity={0.8 * (1 - pulseB)}
                />
              </>
            )}
            <circle cx={messina.x} cy={messina.y} r={5.5} fill={COL_ORIGIN} />
            <circle cx={messina.x} cy={messina.y} r={2} fill="#ffffff" />
            {/* Leader line + label */}
            <line
              x1={messina.x + 6}
              y1={messina.y}
              x2={messina.x + 26}
              y2={messina.y}
              stroke={COL_ORIGIN}
              strokeWidth={0.8}
              strokeOpacity={0.65}
            />
            <text
              x={messina.x + 30}
              y={messina.y + 4}
              fill={COL_ORIGIN}
              fontSize={11}
              fontWeight={700}
              letterSpacing="0.18em"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
            >
              MESSINA
            </text>
          </g>
        )}
      </svg>

      {/* Soft central vignette so the centered text reads cleanly over the globe */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at center, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.35) 45%, rgba(255,255,255,0) 80%)",
        }}
      />

      <div
        className="absolute inset-x-0 bottom-0 h-32"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 75%, #ffffff 100%)",
        }}
      />
    </div>
  );
}

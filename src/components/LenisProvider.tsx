"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    // Lo smooth-scroll resta SOLO su desktop con puntatore fine (mouse/trackpad).
    // Su touch (telefoni/tablet) lo scroll nativo è più fluido e momentum-based:
    // sovrapporci Lenis causava scroll scattoso e animazioni legate allo scroll
    // fuori sincrono, soprattutto su Safari iOS. Lì usiamo lo scroll del browser.
    const isTouch =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (isTouch) return;

    const lenis = new Lenis({ duration: 1.2 });
    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [reducedMotion]);

  return <>{children}</>;
}

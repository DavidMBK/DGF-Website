"use client";

import { useEffect, useState } from "react";

/**
 * `true` quando il viewport è sotto la soglia indicata (default: < lg = 1023px).
 * Parte da `false` così l'SSR e il desktop non vengono toccati; si aggiorna dopo
 * il mount in base al matchMedia reale.
 */
export function useIsMobile(maxWidth = 1023): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${maxWidth}px)`);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [maxWidth]);

  return isMobile;
}

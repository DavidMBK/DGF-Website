"use client";

import { useEffect, useState } from "react";

export type NavTheme = "light" | "dark";

/**
 * Rileva il tema (chiaro/scuro) della sezione che scorre sotto la navbar, così
 * il menù può adattare i colori e restare sempre leggibile. Ogni sezione dichiara
 * il proprio tono con l'attributo `data-nav-theme="light" | "dark"`.
 *
 * @param probeOffset distanza in px dal bordo alto su cui campionare la sezione
 *                    (di norma il centro verticale della barra).
 */
export function useNavTheme(probeOffset = 30): NavTheme {
  const [theme, setTheme] = useState<NavTheme>("light");

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-nav-theme]"),
    );
    if (sections.length === 0) return;

    let rafId = 0;

    const compute = () => {
      rafId = 0;
      let next: NavTheme = "light";
      // Le sezioni sono in ordine di documento: la prima che attraversa il punto
      // di campionamento è quella effettivamente sotto la barra.
      for (const el of sections) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= probeOffset && rect.bottom > probeOffset) {
          next = el.dataset.navTheme === "dark" ? "dark" : "light";
          break;
        }
      }
      setTheme((prev) => (prev === next ? prev : next));
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [probeOffset]);

  return theme;
}

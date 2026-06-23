"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export function IntroAnimation() {
  // Intro solo sulla home: atterrando su una pagina interna (es. un articolo
  // da Google) il contenuto deve essere immediato, senza overlay né scroll-lock.
  const isHome = usePathname() === "/";
  const [show, setShow] = useState(isHome);
  const [shrink, setShrink] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !isHome) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShow(false);
      return;
    }

    document.body.style.overflow = "hidden";

    const shrinkTimer = window.setTimeout(() => setShrink(true), 900);
    const hideTimer = window.setTimeout(() => {
      setShow(false);
      document.body.style.overflow = "";
    }, 1400);

    return () => {
      window.clearTimeout(shrinkTimer);
      window.clearTimeout(hideTimer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-canvas"
          aria-hidden
        >
          <motion.div
            initial={{ scale: 0.45, opacity: 0 }}
            animate={
              shrink
                ? { scale: 0.15, opacity: 0 }
                : { scale: 1, opacity: 1 }
            }
            transition={{ duration: shrink ? 0.5 : 0.6, ease }}
            className="flex items-center justify-center"
          >
            <Image
              src="/logo-dgf-trasparente.png"
              alt="DGF Tech Solutions"
              width={600}
              height={180}
              priority
              className="w-auto h-[180px] sm:h-[240px] md:h-[300px] lg:h-[360px]"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

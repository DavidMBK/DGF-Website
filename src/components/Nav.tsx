"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks } from "@/lib/site";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useNavTheme } from "@/hooks/useNavTheme";

const HIDE_THRESHOLD = 60;
const SCROLL_DELTA = 2;
const ease = [0.22, 1, 0.36, 1] as const;

export function Nav() {
  const reducedMotion = usePrefersReducedMotion();
  const theme = useNavTheme();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastY = useRef(0);
  const rafId = useRef(0);

  const isDark = theme === "dark";
  // La barra mostra uno sfondo solido quando si è scrollato o col drawer aperto,
  // così resta leggibile staccandosi dal contenuto.
  const solid = scrolled || mobileOpen;

  useEffect(() => {
    const onScroll = () => {
      if (rafId.current) return;
      rafId.current = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 12);

        if (y < HIDE_THRESHOLD || mobileOpen) {
          setHidden(false);
        } else if (y > lastY.current + SCROLL_DELTA) {
          setHidden(true);
        } else if (y < lastY.current - SCROLL_DELTA) {
          setHidden(false);
        }

        lastY.current = y;
        rafId.current = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <motion.header
      role="banner"
      initial={false}
      animate={reducedMotion ? { y: 0 } : { y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.25, ease }}
      className={[
        "fixed top-0 inset-x-0 z-50 will-change-transform",
        "transition-[background-color,backdrop-filter,border-color,box-shadow] duration-300 ease-out",
        solid
          ? isDark
            ? "bg-ink/70 backdrop-blur-xl border-b border-white/10 shadow-[0_1px_0_0_rgba(0,0,0,0.25)]"
            : "bg-canvas/85 backdrop-blur-xl border-b border-hairline shadow-[0_1px_0_0_rgba(15,23,42,0.04)]"
          : "bg-transparent border-b border-transparent",
      ].join(" ")}
    >
      {/* Main bar */}
      <div
        className={[
          "max-w-[1180px] mx-auto px-5 sm:px-6 flex items-center justify-between",
          "transition-[height] duration-300 ease-out",
          scrolled ? "h-14" : "h-16",
        ].join(" ")}
      >
        <Link href="/" aria-label="DGF Tech Solutions — home" className="flex-shrink-0">
          <Image
            src="/logo-dgf-trasparente.png"
            alt="DGF Tech Solutions"
            width={140}
            height={42}
            priority
            className={[
              "w-auto transition-[height,filter] duration-300 ease-out",
              scrolled ? "h-7 sm:h-8" : "h-8 sm:h-9",
              isDark ? "brightness-0 invert" : "",
            ].join(" ")}
          />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Navigazione principale" className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={[
                "group relative text-sm font-medium transition-colors duration-300",
                isDark ? "text-white/80 hover:text-white" : "text-ink-soft hover:text-brand-navy",
              ].join(" ")}
            >
              {link.label}
              <span
                aria-hidden
                className={[
                  "pointer-events-none absolute -bottom-0.5 left-0 right-0 h-[1.5px] origin-center scale-x-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100",
                  isDark ? "bg-white" : "bg-brand-navy",
                ].join(" ")}
              />
            </Link>
          ))}
          <Link
            href="/#contatti"
            className={[
              "group relative ml-2 px-5 py-2 rounded-full text-sm font-semibold overflow-hidden transition-colors duration-300",
              isDark
                ? "bg-white text-brand-navy hover:bg-white"
                : "bg-brand-navy text-white hover:bg-brand-blue",
            ].join(" ")}
          >
            <span
              aria-hidden
              className={[
                "absolute inset-0 rounded-full origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100",
                isDark ? "bg-brand-cyan/25" : "bg-brand-blue",
              ].join(" ")}
            />
            <span className="relative z-10 inline-flex items-center gap-1.5">
              Contattaci
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-0.5"
              >
                →
              </span>
            </span>
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className={[
            "md:hidden p-2 transition-colors duration-300",
            isDark ? "text-white" : "text-ink-soft",
          ].join(" ")}
          aria-label={mobileOpen ? "Chiudi menu" : "Apri menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className={["block w-5 h-px bg-current mb-1.5 transition-transform duration-200 origin-center", mobileOpen ? "translate-y-[7px] rotate-45" : ""].join(" ")} />
          <span className={["block w-5 h-px bg-current mb-1.5 transition-opacity duration-200", mobileOpen ? "opacity-0" : ""].join(" ")} />
          <span className={["block h-px bg-current transition-all duration-200 origin-center", mobileOpen ? "w-5 -translate-y-[7px] -rotate-45" : "w-3"].join(" ")} />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-drawer"
            initial={reducedMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease }}
            className={[
              "md:hidden border-t backdrop-blur-xl",
              isDark ? "border-white/10 bg-ink/95" : "border-hairline bg-canvas/95",
            ].join(" ")}
          >
            <div className="max-w-[1180px] mx-auto px-5 sm:px-6 py-5 flex flex-col gap-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={reducedMotion ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, ease, delay: reducedMotion ? 0 : 0.05 + i * 0.04 }}
                >
                  <Link
                    href={link.href}
                    onClick={closeMobile}
                    className={[
                      "block text-left text-sm font-medium transition-colors",
                      isDark ? "text-white/80 hover:text-white" : "text-ink-soft hover:text-brand-navy",
                    ].join(" ")}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/#contatti"
                onClick={closeMobile}
                className={[
                  "mt-2 px-5 py-3 rounded-full text-sm font-semibold text-center transition-colors duration-200",
                  isDark
                    ? "bg-white text-brand-navy"
                    : "bg-brand-navy text-white hover:bg-brand-blue",
                ].join(" ")}
              >
                Contattaci
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

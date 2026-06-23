"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Reveal in entrata (fade-up) all'ingresso nel viewport. Solo transform/opacity
 * (GPU), rispetta prefers-reduced-motion. Wrapper client riutilizzabile per
 * dare vita alle pagine server senza renderle interamente client.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "article" | "section" | "aside" | "header";
}) {
  const reducedMotion = usePrefersReducedMotion();
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease, delay }}
    >
      {children}
    </MotionTag>
  );
}

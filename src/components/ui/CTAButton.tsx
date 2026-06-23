import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
}

/**
 * CTA pill con icona annidata in un cerchietto ("button-in-button") e
 * micro-fisica all'hover. Basato su next/link → funziona cross-pagina e SEO.
 */
export function CTAButton({ href, children, variant = "primary", className = "" }: Props) {
  const isPrimary = variant === "primary";
  return (
    <Link
      href={href}
      className={[
        "group inline-flex items-center gap-2.5 rounded-full py-2 pl-6 pr-2 text-sm font-semibold",
        "transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]",
        isPrimary
          ? "bg-brand-navy text-white shadow-[0_14px_30px_-12px_rgba(10,30,60,0.5)] hover:bg-brand-blue"
          : "bg-white text-brand-navy ring-1 ring-brand-blue/15 hover:ring-brand-blue/35",
        className,
      ].join(" ")}
    >
      {children}
      <span
        aria-hidden
        className={[
          "flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          "group-hover:translate-x-0.5 group-hover:-translate-y-[1px]",
          isPrimary ? "bg-white/15 text-white" : "bg-brand-blue/10 text-brand-navy",
        ].join(" ")}
      >
        <ArrowRight size={15} strokeWidth={2} />
      </span>
    </Link>
  );
}

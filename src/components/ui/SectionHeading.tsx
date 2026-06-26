import type { ReactNode } from "react";

interface Props {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
  /** "lg" ingrandisce eyebrow, titolo e intro per sezioni di maggior impatto. */
  size?: "md" | "lg";
  id?: string;
  className?: string;
}

/**
 * Intestazione di sezione/pagina: eyebrow (pill mono) + titolo display + intro.
 * Server component statico, riusato su tutte le pagine per coerenza tipografica.
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  as = "h2",
  size = "md",
  id,
  className = "",
}: Props) {
  const Heading = as;
  const center = align === "center";
  const big = size === "lg";
  // In modalità "lg" un h2 adotta la scala del titolo display (display-xl).
  const titleSize = as === "h1" || big ? "display-xl" : "heading-lg";
  return (
    <div
      className={[
        "flex flex-col",
        center ? "mx-auto max-w-3xl items-center text-center" : "items-start",
        className,
      ].join(" ")}
    >
      {eyebrow && (
        <span
          className={[
            "eyebrow inline-flex items-center",
            big ? "gap-4 !text-[0.9rem] tracking-[0.26em]" : "gap-3",
            center ? "justify-center" : "",
          ].join(" ")}
        >
          <span className={`h-px ${big ? "w-14" : "w-10"} bg-gradient-to-r from-transparent to-brand-blue/60`} />
          {eyebrow}
          {center && (
            <span className={`h-px ${big ? "w-14" : "w-10"} bg-gradient-to-l from-transparent to-brand-blue/60`} />
          )}
        </span>
      )}
      <Heading id={id} className={[big ? "mt-6" : "mt-5", "text-ink", titleSize].join(" ")}>
        {title}
      </Heading>
      {subtitle && (
        <p
          className={[
            big ? "mt-6 text-[18px]" : "mt-5 text-[17px]",
            "leading-[1.65] text-body",
            center ? "max-w-2xl" : "max-w-[60ch]",
          ].join(" ")}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

import type { ReactNode } from "react";

interface Props {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
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
  id,
  className = "",
}: Props) {
  const Heading = as;
  const center = align === "center";
  return (
    <div
      className={[
        "flex flex-col",
        center ? "mx-auto max-w-3xl items-center text-center" : "items-start",
        className,
      ].join(" ")}
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.32em] text-brand-blue">
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-brand-blue/60" />
          {eyebrow}
        </span>
      )}
      <Heading
        id={id}
        className={[
          "mt-5 font-display font-semibold tracking-[-0.03em] text-ink",
          as === "h1"
            ? "text-[clamp(2.4rem,6vw,4.4rem)] leading-[1.02]"
            : "text-[clamp(1.9rem,4.5vw,3.3rem)] leading-[1.05]",
        ].join(" ")}
      >
        {title}
      </Heading>
      {subtitle && (
        <p
          className={[
            "mt-5 text-[17px] leading-[1.65] text-body",
            center ? "max-w-2xl" : "max-w-[60ch]",
          ].join(" ")}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

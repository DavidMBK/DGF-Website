import { Reveal } from "@/components/ui/Reveal";

const GROUPS = [
  { label: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Astro"] },
  { label: "Backend", items: ["Node.js", "Python", "PostgreSQL", "Prisma", "REST & API"] },
  { label: "AI & Dati", items: ["LLM", "RAG", "Automazioni", "Vector DB"] },
  { label: "Design & Tooling", items: ["Figma", "Design System", "Vercel", "GitHub"] },
];

export function TechStack() {
  return (
    <section
      data-nav-theme="light"
      aria-labelledby="stack-heading"
      className="relative overflow-hidden bg-canvas-soft py-20 sm:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-cyan/25 to-transparent"
      />
      <div className="relative mx-auto max-w-[1180px] px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal>
            <span className="inline-flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.32em] text-brand-blue">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-brand-blue/60" />
              Stack
            </span>
            <h2
              id="stack-heading"
              className="mt-5 font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink"
            >
              Strumenti moderni, scelti per durare
            </h2>
            <p className="mt-5 max-w-[44ch] text-[16px] leading-[1.65] text-body">
              Non inseguiamo le mode: scegliamo tecnologie solide e mantenibili, quelle
              giuste per il tuo progetto e per chi dovrà farlo crescere domani.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[1.5rem] bg-hairline/60 ring-1 ring-brand-blue/10 sm:grid-cols-2">
              {GROUPS.map((g) => (
                <div key={g.label} className="bg-white p-6 sm:p-7">
                  <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-blue">
                    {g.label}
                  </div>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {g.items.map((t) => (
                      <li
                        key={t}
                        className="rounded-full bg-canvas-soft px-3 py-1.5 text-[13px] font-medium text-ink-soft ring-1 ring-hairline"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

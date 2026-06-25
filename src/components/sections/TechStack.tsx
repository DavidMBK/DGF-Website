import { Reveal } from "@/components/ui/Reveal";

const GROUPS = [
  { label: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Astro"] },
  { label: "Backend", items: ["Node.js", "Python", "PostgreSQL", "Prisma", "REST & API"] },
  { label: "AI & Dati", items: ["LLM", "RAG", "Automazioni", "Vector DB", "Embeddings"] },
  { label: "Design & Tooling", items: ["Figma", "Design System", "Vercel", "GitHub", "CI/CD"] },
];

// Sezione SCURA: si salda a Process per formare un'unica isola "metodo &
// strumenti", e fa da rampa di discesa verso le sezioni chiare successive.
export function TechStack() {
  return (
    <section
      data-nav-theme="dark"
      aria-labelledby="stack-heading"
      className="relative overflow-hidden bg-ink py-20 sm:py-28"
      style={{
        // Continua dal navy del Process verso l'ink, senza stacco.
        background: "linear-gradient(180deg, #061a2b 0%, #0a1f33 38%, #0a1f33 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-cyan/35 to-transparent"
      />
      {/* bagliore d'atmosfera */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 right-[-10%] h-[480px] w-[480px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(21,117,164,0.20) 0%, rgba(21,117,164,0) 65%)",
          filter: "blur(50px)",
        }}
      />
      <div className="relative mx-auto max-w-[1180px] px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal>
            <span className="inline-flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.24em] font-medium text-brand-cyan">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-brand-cyan/60" />
              Con cosa
            </span>
            <h2
              id="stack-heading"
              className="heading-lg mt-5 text-white"
            >
              Strumenti moderni, scelti per durare
            </h2>
            <p className="mt-5 max-w-[44ch] text-[16px] leading-[1.65] text-white/70">
              Non inseguiamo le mode: scegliamo tecnologie solide e mantenibili, quelle
              giuste per il tuo progetto e per chi dovrà farlo crescere domani.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[1.5rem] bg-white/10 ring-1 ring-white/10 sm:grid-cols-2">
              {GROUPS.map((g) => (
                <div
                  key={g.label}
                  className="group/card relative flex flex-col bg-[#0c2438] p-6 transition-colors duration-300 hover:bg-[#103050] sm:p-7"
                >
                  {/* Accento superiore che appare all'hover della card. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-brand-blue to-brand-cyan transition-transform duration-500 ease-expo group-hover/card:scale-x-100"
                  />
                  <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-cyan">
                    {g.label}
                  </div>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {g.items.map((t) => (
                      <li
                        key={t}
                        className="cursor-default rounded-full bg-white/[0.06] px-3 py-1.5 text-[13px] font-medium text-white/85 ring-1 ring-white/10 transition-all duration-200 hover:bg-white/10 hover:text-white hover:ring-brand-cyan/40"
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

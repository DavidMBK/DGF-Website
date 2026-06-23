import { Code2, ShieldCheck, Rocket, Gauge } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const REASONS = [
  {
    Icon: Code2,
    title: "Parli con chi scrive il codice",
    body: "Niente catena di intermediari né account manager di passaggio. Dal primo confronto al lancio segui sempre le stesse persone, quelle che progettano e sviluppano davvero.",
  },
  {
    Icon: ShieldCheck,
    title: "Trasparenza totale",
    body: "Tempi, costi e scelte tecniche nero su bianco, prima di iniziare. Nessuna sorpresa in corso d'opera, nessun preventivo automatico gonfiato.",
  },
  {
    Icon: Rocket,
    title: "Dall'idea al lancio",
    body: "Strategia, design, sviluppo e messa online: un unico interlocutore per tutto il percorso, con supporto continuativo anche dopo il go-live.",
  },
  {
    Icon: Gauge,
    title: "Codice che dura",
    body: "Software veloce, sicuro e manutenibile, costruito con strumenti moderni. Quello che consegniamo deve reggere nel tempo, non solo il giorno della consegna.",
  },
];

export function WhyUs() {
  return (
    <section
      data-nav-theme="light"
      aria-labelledby="why-heading"
      className="relative overflow-hidden bg-canvas py-20 sm:py-28 lg:py-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-[-10%] h-[520px] w-[520px] rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(circle at center, rgba(61,156,199,0.16) 0%, rgba(61,156,199,0) 62%)",
          filter: "blur(34px)",
        }}
      />
      <div className="relative mx-auto max-w-[1180px] px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Perché DGF"
            as="h2"
            id="why-heading"
            title={
              <>
                Non un fornitore.{" "}
                <span className="bg-gradient-to-br from-brand-blue to-brand-cyan bg-clip-text italic text-transparent">
                  Un partner tecnico.
                </span>
              </>
            }
            subtitle="Quello che ci distingue non è una lista di tecnologie, ma il modo in cui lavoriamo: vicino a te, in chiaro, e con un metro solo — che funzioni davvero."
            className="max-w-[760px]"
          />
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
          {REASONS.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.07}>
              <article className="group h-full rounded-[1.75rem] bg-white/60 p-1.5 ring-1 ring-brand-blue/10 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:ring-brand-blue/25">
                <div className="flex h-full flex-col rounded-[1.375rem] bg-white p-7 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] sm:p-9">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-navy to-brand-blue text-white ring-1 ring-white/15">
                    <r.Icon size={22} strokeWidth={1.6} />
                  </span>
                  <h3 className="mt-6 font-display text-[22px] font-semibold tracking-[-0.02em] text-ink">
                    {r.title}
                  </h3>
                  <p className="mt-3 text-[15.5px] leading-[1.65] text-body">{r.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

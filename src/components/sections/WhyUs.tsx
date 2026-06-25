import { Code2, ShieldCheck, Gauge, Compass } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

// Card-manifesto (grande): il cuore del "perché fidarsi".
const MANIFESTO = {
  Icon: Code2,
  title: "Parli con chi scrive il codice",
  body: "Niente catena di intermediari, niente account manager di passaggio. Dal primo confronto al lancio segui sempre le stesse persone: quelle che progettano e sviluppano davvero il tuo prodotto. È la differenza tra un fornitore che esegue e un partner che capisce dove vuoi arrivare.",
};

// Tre pilastri minori, distinti dalle "Garanzie" (lì stanno gli impegni concreti;
// qui il modo in cui lavoriamo).
const PILLARS = [
  {
    Icon: ShieldCheck,
    title: "Trasparenza totale",
    body: "Scelte e avanzamenti sempre in chiaro: sai cosa stiamo facendo e perché, in ogni momento.",
  },
  {
    Icon: Compass,
    title: "Decisioni spiegate",
    body: "Ogni scelta tecnica ha una ragione che ti diciamo in parole semplici. Niente tecnicismi per impressionare.",
  },
  {
    Icon: Gauge,
    title: "Costruito per durare",
    body: "Software veloce, sicuro e manutenibile, fatto con strumenti moderni: regge nel tempo, non solo alla consegna.",
  },
];

export function WhyUs() {
  return (
    <section
      data-nav-theme="light"
      aria-labelledby="why-heading"
      className="relative overflow-hidden py-20 sm:py-28 lg:py-36"
      style={{
        background:
          "linear-gradient(180deg, #eef5fb 0%, #dcebf7 48%, #c9def0 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-cyan/25 to-transparent"
      />
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
                <span className="text-gradient-brand italic">Un partner tecnico.</span>
              </>
            }
            subtitle="Quello che ci distingue non è una lista di tecnologie, ma il modo in cui lavoriamo: vicino a te, in chiaro, e con un metro solo — che funzioni davvero."
            className="max-w-[760px]"
          />
        </Reveal>

        {/* Bento: 1 manifesto grande + 3 pilastri */}
        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Card manifesto — occupa l'intera prima riga su desktop */}
          <Reveal as="article" className="lg:col-span-3">
            <article className="group relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-brand-navy to-brand-blue p-8 text-white shadow-brand ring-1 ring-white/10 sm:p-10 lg:p-12">
              {/* griglia tech tenue di sfondo */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(214,239,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(214,239,255,1) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                  maskImage:
                    "radial-gradient(120% 120% at 80% 20%, #000 20%, transparent 75%)",
                  WebkitMaskImage:
                    "radial-gradient(120% 120% at 80% 20%, #000 20%, transparent 75%)",
                }}
              />
              <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
                <span className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-white/12 text-white ring-1 ring-white/20 backdrop-blur-sm">
                  <MANIFESTO.Icon size={26} strokeWidth={1.6} />
                </span>
                <div>
                  <h3 className="font-display text-[clamp(1.5rem,2.6vw,2.1rem)] font-semibold leading-[1.12] tracking-[-0.025em]">
                    {MANIFESTO.title}
                  </h3>
                  <p className="mt-3 max-w-[64ch] text-[15.5px] leading-[1.65] text-white/85">
                    {MANIFESTO.body}
                  </p>
                </div>
              </div>
            </article>
          </Reveal>

          {/* Tre pilastri */}
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.07} as="article">
              <article className="group h-full rounded-[1.75rem] bg-white/60 p-1.5 ring-1 ring-brand-blue/10 transition-all duration-500 ease-out-soft hover:-translate-y-1 hover:ring-brand-blue/25">
                <div className="flex h-full flex-col rounded-[1.375rem] bg-white p-7 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] sm:p-8">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-blue ring-1 ring-brand-blue/10">
                    <p.Icon size={20} strokeWidth={1.7} />
                  </span>
                  <h3 className="mt-5 font-display text-[19px] font-semibold tracking-[-0.015em] text-ink">
                    {p.title}
                  </h3>
                  <p className="mt-2.5 text-[14.5px] leading-[1.6] text-body">{p.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

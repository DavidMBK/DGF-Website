import { Code2, ShieldCheck, Gauge, Compass } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

// Card-manifesto: il cuore del "perché fidarsi". Ora è il primo dei quattro
// motivi interattivi, non più un riquadro a sé.
const MANIFESTO = {
  Icon: Code2,
  title: "Parli con chi scrive il codice",
  body: "Niente catena di intermediari, niente account manager di passaggio. Dal primo confronto al lancio segui sempre le stesse persone: quelle che progettano e sviluppano davvero il tuo prodotto.",
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

// I quattro motivi mostrati come rettangoli verticali interattivi.
const CARDS = [MANIFESTO, ...PILLARS];

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
      <div className="relative mx-auto max-w-[1480px] px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Perché DGF"
            as="h2"
            align="center"
            size="lg"
            id="why-heading"
            title={
              <>
                Non un fornitore.{" "}
                <span className="text-gradient-brand italic">Un partner tecnico.</span>
              </>
            }
            subtitle="Quello che ci distingue non è una lista di tecnologie, ma il modo in cui lavoriamo: vicino a te, in chiaro, e con un metro solo — che funzioni davvero."
            className="max-w-[820px]"
          />
        </Reveal>

        {/* Quattro motivi — rettangoli verticali interattivi.
            Larghezza fissa (4 colonne uguali su desktop); su hover il riquadro
            attivo cresce in ALTEZZA e gli altri si abbassano → feedback marcato.
            A riposo sono tutti uguali (bianchi); l'attivo prende il gradiente
            brand. La griglia riserva l'altezza massima per evitare salti di
            layout; il gradiente entra in crossfade (opacity, GPU). L'effetto
            altezza è solo su desktop (riga unica); su tablet/mobile resta il
            solo cambio colore. */}
        <div className="group/pillars mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:items-center lg:gap-6 lg:min-h-[660px]">
          {CARDS.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.06} as="article" className="group/card">
              <article className="relative flex h-full flex-col overflow-hidden rounded-[2rem] bg-white p-8 shadow-[0_1px_2px_rgba(15,42,73,0.05)] ring-1 ring-brand-blue/10 transition-[height,box-shadow] duration-[450ms] ease-out-soft lg:h-[520px] lg:p-10 lg:group-hover/pillars:h-[440px] lg:group-hover/card:!h-[660px] sm:group-hover/card:shadow-brand sm:group-hover/card:ring-white/10 motion-reduce:transition-none">
                {/* livello gradiente brand: crossfade sul riquadro attivo */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-navy to-brand-blue opacity-0 transition-opacity duration-[450ms] sm:group-hover/card:opacity-100"
                />
                {/* griglia tech tenue, solo sull'attivo */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-[450ms] sm:group-hover/card:opacity-[0.09]"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(214,239,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(214,239,255,1) 1px, transparent 1px)",
                    backgroundSize: "34px 34px",
                  }}
                />
                <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-blue ring-1 ring-brand-blue/10 transition-colors duration-[450ms] sm:group-hover/card:bg-white/15 sm:group-hover/card:text-white sm:group-hover/card:ring-white/25">
                  <c.Icon size={26} strokeWidth={1.65} />
                </span>
                <div className="relative mt-auto pt-10">
                  <h3 className="font-display text-[22px] font-semibold leading-[1.16] tracking-[-0.018em] text-ink transition-colors duration-[450ms] sm:group-hover/card:text-white">
                    {c.title}
                  </h3>
                  <p className="mt-3.5 text-[16px] leading-[1.6] text-body transition-colors duration-[450ms] sm:group-hover/card:text-white/85">
                    {c.body}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

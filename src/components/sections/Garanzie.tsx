import { Code2, ScrollText, Clock, MessageSquare, LifeBuoy, MapPin } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

// Casa UNICA dei claim del sito (prima sparsi/ripetuti tra Hero, Consulenza e
// FAQ). Sono impegni verificabili, non metriche inventate: è la "prova" onesta
// che sostituisce un portfolio di clienti per chi è all'inizio.
const PLEDGES = [
  {
    Icon: Code2,
    title: "Codice di tua proprietà",
    body: "A fine progetto codice e dominio sono tuoi. Nessun lock-in, nessuna piattaforma che ti tiene prigioniero.",
  },
  {
    Icon: ScrollText,
    title: "Tempi e costi nero su bianco",
    body: "Stima chiara e motivata prima di iniziare. Nessun preventivo automatico gonfiato, nessuna sorpresa in corso d'opera.",
  },
  {
    Icon: MessageSquare,
    title: "Un solo interlocutore",
    body: "Parli sempre con chi progetta e scrive il codice, dal primo confronto al lancio. Niente catena di intermediari.",
  },
  {
    Icon: Clock,
    title: "Risposta entro 24 ore",
    body: "A ogni nuova richiesta diamo un primo riscontro entro un giorno lavorativo. Anche solo per dirti se possiamo aiutarti.",
  },
  {
    Icon: LifeBuoy,
    title: "Supporto dopo il lancio",
    body: "Il go-live è un punto di partenza: restiamo al tuo fianco con manutenzione, aggiornamenti ed evoluzioni.",
  },
  {
    Icon: MapPin,
    title: "Messina, in tutta Italia",
    body: "Base a Messina, operativi da remoto con clienti in tutta Italia. Call, condivisione e supporto funzionano ovunque.",
  },
];

export function Garanzie() {
  return (
    <section
      id="garanzie"
      data-nav-theme="light"
      aria-labelledby="garanzie-heading"
      className="relative overflow-hidden bg-canvas py-20 sm:py-28 lg:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-cyan/25 to-transparent"
      />
      <div className="relative mx-auto max-w-[1180px] px-6">
        <Reveal>
          <SectionHeading
            eyebrow="I nostri impegni"
            as="h2"
            id="garanzie-heading"
            align="center"
            title={
              <>
                La nostra parola,{" "}
                <span className="text-gradient-brand">nero su bianco.</span>
              </>
            }
            subtitle="Non abbiamo ancora un muro di loghi da mostrarti. Abbiamo qualcosa di più concreto: impegni verificabili su cui puoi tenerci."
          />
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-[1.75rem] bg-hairline/60 ring-1 ring-brand-blue/10 sm:grid-cols-2 lg:grid-cols-3">
          {PLEDGES.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.05} as="article">
              <div className="group flex h-full flex-col bg-white p-7 transition-colors duration-300 hover:bg-brand-50/50 sm:p-8">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-navy to-brand-blue text-white ring-1 ring-white/15">
                  <p.Icon size={20} strokeWidth={1.7} />
                </span>
                <h3 className="mt-5 font-display text-[19px] font-semibold tracking-[-0.015em] text-ink">
                  {p.title}
                </h3>
                <p className="mt-2.5 text-[14.5px] leading-[1.6] text-body">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Plus } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const FAQS = [
  {
    q: "Quanto costa un progetto?",
    a: "Dipende da cosa serve davvero: una vetrina curata parte da poche migliaia di euro, un e-commerce o un gestionale su misura crescono con le funzionalità. Ti diamo una stima chiara e motivata prima di iniziare — tempi e costi nero su bianco, senza sorprese.",
  },
  {
    q: "Quanto tempo serve per realizzarlo?",
    a: "Un sito vetrina richiede in genere qualche settimana; progetti più complessi (e-commerce, gestionali, AI) qualche mese. Lavoriamo a cicli brevi con aggiornamenti frequenti, così vedi i progressi in tempo reale invece di aspettare al buio.",
  },
  {
    q: "Lavorate solo a Messina o in tutta Italia?",
    a: "Abbiamo base a Messina ma lavoriamo con clienti in tutta Italia, da remoto. Call, condivisione del lavoro e supporto funzionano ovunque tu sia.",
  },
  {
    q: "Il sito e il codice sono di mia proprietà?",
    a: "Sì, sempre. Al termine del progetto codice e dominio sono tuoi: nessun lock-in, nessun vincolo a piattaforme proprietarie che ti tengono prigioniero.",
  },
  {
    q: "Offrite assistenza dopo il lancio?",
    a: "Sì. Restiamo al tuo fianco anche dopo il go-live con manutenzione, aggiornamenti ed evoluzioni. Il lancio è un punto di partenza, non la fine del rapporto.",
  },
  {
    q: "Come funziona il primo contatto?",
    a: "Ci scrivi due righe sul progetto dal form qui sotto. Entro 24 ore leggiamo la richiesta e ti proponiamo una call conoscitiva gratuita; da lì arriva una proposta chiara su tempi e costi.",
  },
];

export function Faq() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section
      data-nav-theme="light"
      aria-labelledby="faq-heading"
      className="relative bg-canvas py-20 sm:py-28"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-10 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <span className="inline-flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.32em] text-brand-blue">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-brand-blue/60" />
            Domande frequenti
          </span>
          <h2
            id="faq-heading"
            className="mt-5 font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink"
          >
            Le risposte, prima ancora di chiedere
          </h2>
          <p className="mt-5 max-w-[40ch] text-[16px] leading-[1.65] text-body">
            Hai un dubbio diverso? Scrivici: rispondiamo noi, di persona, entro 24 ore.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="divide-y divide-hairline border-y border-hairline">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-medium text-ink transition-colors hover:text-brand-blue [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue transition-transform duration-300 group-open:rotate-45">
                  <Plus size={15} strokeWidth={2} />
                </span>
              </summary>
              <p className="mt-3 max-w-[62ch] text-[15.5px] leading-[1.7] text-body">{f.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

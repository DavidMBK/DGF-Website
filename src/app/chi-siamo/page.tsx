import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { CTAButton } from "@/components/ui/CTAButton";

export const metadata: Metadata = {
  title: "Chi siamo — la software house dove parli con chi scrive il codice",
  description:
    "DGF Tech Solutions è una software house a Messina, attiva in tutta Italia. Niente intermediari: dall'idea al lancio lavori con chi progetta e sviluppa il tuo prodotto.",
  alternates: { canonical: "/chi-siamo" },
  openGraph: {
    title: "Chi siamo | DGF Tech Solutions",
    description:
      "Una software house a Messina dove parli sempre con chi progetta e scrive il codice. Dall'idea al lancio.",
    url: "/chi-siamo",
  },
};

const VALUES = [
  {
    title: "Parli con chi scrive il codice",
    body: "Niente catena di intermediari. Dal primo confronto al lancio segui sempre le stesse persone, quelle che progettano e sviluppano davvero il tuo prodotto.",
  },
  {
    title: "Trasparenza prima di tutto",
    body: "Tempi, costi e scelte tecniche nero su bianco, prima di iniziare. Nessuna sorpresa in corso d'opera, nessun preventivo automatico.",
  },
  {
    title: "Codice che dura",
    body: "Scriviamo software manutenibile, veloce e sicuro, con strumenti moderni. Quello che costruiamo deve reggere nel tempo, non solo alla consegna.",
  },
  {
    title: "Dall'idea al lancio",
    body: "Strategia, design, sviluppo e messa online: un unico interlocutore per tutto il percorso, e supporto continuativo anche dopo il go-live.",
  },
];

const TEAM = [
  { name: "Francesco Riccardo Giannetto", role: "Co-fondatore" },
  { name: "David Moonsmee", role: "Co-fondatore" },
  { name: "Giacomo Lanza", role: "Co-fondatore" },
];

// Iniziali = prima lettera del nome + prima lettera del cognome (ultimo token),
// così "Francesco Riccardo Giannetto" → "FG", non "FR".
function Monogram({ name }: { name: string }) {
  const parts = name.split(" ").filter(Boolean);
  const initials =
    parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : (parts[0]?.slice(0, 2) ?? "");
  return (
    <div
      aria-hidden
      className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-navy to-brand-blue font-display text-[20px] font-semibold text-white ring-1 ring-white/20"
    >
      {initials}
    </div>
  );
}

export default function ChiSiamoPage() {
  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1}>
        <PageHeader
          eyebrow="Chi siamo"
          title="Una software house dove non ti perdi mai per strada"
          intro="Siamo un piccolo team con base a Messina, al lavoro con clienti in tutta Italia. Costruiamo prodotti digitali su misura — siti, e-commerce, app, gestionali e soluzioni AI — restando vicini a chi li userà."
          breadcrumbs={[{ name: "Home", path: "/" }, { name: "Chi siamo" }]}
        />

        {/* Storia */}
        <section className="bg-canvas py-16 sm:py-24" aria-label="La nostra storia">
          <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <Reveal>
              <h2 className="heading-lg text-ink">
                Nati per fare le cose
                <span className="text-brand-blue"> sul serio</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1} className="space-y-5 text-[17px] leading-[1.7] text-ink-soft">
              <p>
                DGF Tech Solutions nasce dall&apos;idea che il software fatto bene non debba essere un
                privilegio delle grandi aziende. Troppe realtà si ritrovano con siti lenti, gestionali
                improvvisati e, soprattutto, nessuno a cui chiedere aiuto quando qualcosa non va.
              </p>
              <p>
                Noi facciamo il contrario: poche persone, molto coinvolte, che seguono ogni progetto dalla
                prima riga di codice fino al lancio e oltre. Niente reparti che si rimbalzano le richieste,
                niente preventivi automatici: quando ci scrivi, rispondiamo noi — le stesse persone che poi
                costruiranno il tuo prodotto.
              </p>
              <p>
                Lavoriamo con strumenti moderni e una regola semplice: ogni scelta tecnica deve avere una
                ragione che possiamo spiegarti in parole chiare. Crediamo che la tecnologia migliore sia
                quella che non ti accorgi nemmeno di usare, perché semplicemente funziona — oggi e tra
                tre anni.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Valori — zig-zag, niente 3 card uguali */}
        <section data-nav-theme="light" className="bg-canvas-soft py-16 sm:py-24" aria-label="Come lavoriamo">
          <div className="mx-auto max-w-[1180px] px-6">
            <Reveal>
              <span className="eyebrow inline-flex items-center gap-3">
                <span className="h-px w-10 bg-gradient-to-r from-transparent to-brand-blue/60" />
                Come lavoriamo
              </span>
              <h2 className="heading-lg mt-5 max-w-[18ch] text-ink">
                Quattro principi, zero compromessi
              </h2>
            </Reveal>

            <div className="mt-12 grid grid-cols-1 divide-y divide-hairline rounded-[1.75rem] bg-white ring-1 ring-brand-blue/10 md:grid-cols-2 md:divide-y-0 md:[&>*:nth-child(odd)]:border-r md:[&>*]:border-hairline">
              {VALUES.map((v, i) => (
                <Reveal key={v.title} delay={i * 0.05} className="p-8 sm:p-10">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-[13px] font-semibold text-brand-blue/70">
                      0{i + 1}
                    </span>
                    <h3 className="font-display text-[20px] font-semibold tracking-[-0.01em] text-ink">
                      {v.title}
                    </h3>
                  </div>
                  <p className="mt-3 pl-9 text-[15.5px] leading-[1.65] text-body">{v.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Per chi lavoriamo */}
        <section className="bg-canvas py-16 sm:py-24" aria-label="Per chi lavoriamo">
          <div className="mx-auto max-w-[1180px] px-6">
            <Reveal>
              <span className="eyebrow inline-flex items-center gap-3">
                <span className="h-px w-10 bg-gradient-to-r from-transparent to-brand-blue/60" />
                Per chi lavoriamo
              </span>
              <h2 className="heading-lg mt-5 max-w-[20ch] text-ink">
                Realtà diverse, lo stesso bisogno: fare sul serio
              </h2>
              <p className="mt-5 max-w-[60ch] text-[16.5px] leading-[1.7] text-body">
                Non lavoriamo solo con un tipo di cliente. Ci accomuna chi vuole uno strumento
                digitale che funzioni davvero, costruito con cura e pensato per crescere.
              </p>
            </Reveal>

            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  t: "PMI e attività locali",
                  d: "Aziende e attività che vogliono una presenza online seria — un sito veloce, un e-commerce che vende, un gestionale che mette ordine — senza perdersi in tecnicismi o costi nascosti.",
                },
                {
                  t: "Professionisti e studi",
                  d: "Chi vive di reputazione e ha bisogno di un sito curato che comunichi competenza, raccolga contatti qualificati e si trovi su Google quando i clienti cercano.",
                },
                {
                  t: "Startup e nuovi progetti",
                  d: "Chi parte da un'idea e ha bisogno di trasformarla in prodotto: prototipo, prime versioni e un'architettura solida che regge la crescita senza dover rifare tutto.",
                },
              ].map((c, i) => (
                <Reveal key={c.t} delay={i * 0.06}>
                  <div className="flex h-full flex-col rounded-[1.5rem] bg-canvas-soft p-7 ring-1 ring-brand-blue/10 transition-all duration-300 ease-out-soft hover:-translate-y-1 hover:bg-white hover:shadow-md hover:ring-brand-blue/25">
                    <h3 className="font-display text-[19px] font-semibold tracking-[-0.01em] text-ink">
                      {c.t}
                    </h3>
                    <p className="mt-3 text-[15px] leading-[1.65] text-body">{c.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="bg-canvas-soft py-16 sm:py-24" aria-label="Il team">
          <div className="mx-auto max-w-[1180px] px-6">
            <Reveal>
              <h2 className="heading-lg text-ink">
                Il team
              </h2>
              <p className="mt-4 max-w-[58ch] text-[16px] leading-[1.6] text-body">
                Tre dottori laureati in Scienze Informatiche all&apos;Università di Messina.
                Poche persone, ognuna responsabile di ciò che costruisce: sono loro a
                seguire il tuo progetto, dall&apos;idea al lancio.
              </p>
            </Reveal>
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {TEAM.map((m, i) => (
                <Reveal key={m.name} delay={i * 0.06}>
                  <div className="group flex h-full flex-col items-start rounded-[1.5rem] bg-white p-7 ring-1 ring-brand-blue/10 transition-all duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-md hover:ring-brand-blue/25">
                    <Monogram name={m.name} />
                    <h3 className="mt-5 font-display text-[18px] font-semibold tracking-[-0.01em] text-ink">
                      {m.name}
                    </h3>
                    <p className="mt-1.5 text-[14px] leading-snug text-body">{m.role}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section data-nav-theme="light" className="bg-canvas-soft py-16 sm:py-24" aria-label="Contatti">
          <div className="mx-auto max-w-[1180px] px-6">
            <Reveal className="flex flex-col items-start gap-5 rounded-[1.75rem] bg-gradient-to-br from-brand-navy to-brand-blue p-8 text-white sm:flex-row sm:items-center sm:justify-between sm:p-12">
              <div>
                <h2 className="heading-md">
                  Lavoriamo insieme?
                </h2>
                <p className="mt-2 max-w-[50ch] text-[15px] leading-[1.6] text-white/80">
                  Raccontaci la tua idea: ti rispondiamo entro 24 ore, di persona.
                </p>
              </div>
              <CTAButton href="/#contatti" variant="ghost">
                Scrivici
              </CTAButton>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { SELECT_SERVICE_EVENT } from "@/lib/scroll";
import {
  SitiVisual,
  EcommerceVisual,
  UiuxVisual,
  SoftwareVisual,
  AiVisual,
  ConsulenzaVisual,
} from "./ServiceVisuals";

const ease = [0.22, 1, 0.36, 1] as const;

type VisualComponent = () => React.ReactElement;

interface Service {
  id: string;
  title: string;
  navLabel: string;
  tagline: string;
  description: string;
  keypoints: readonly string[];
  tags: readonly string[];
  Visual: VisualComponent;
}

const SERVICES: readonly Service[] = [
  {
    id: "svc-siti",
    title: "Siti web",
    navLabel: "Siti web",
    tagline: "Presenza digitale costruita per durare",
    description:
      "Landing, siti aziendali e portali che si caricano in un istante e si posizionano su Google. Li costruiamo a blocchi modulari, testati fino al dettaglio: una vetrina veloce, accessibile e pensata per portarti contatti reali — non solo per fare bella figura.",
    keypoints: [
      "Architettura modulare a componenti",
      "Core Web Vitals nel target",
      "SEO tecnico e dati strutturati",
      "Accessibilità WCAG 2.2 AA",
    ],
    tags: ["Next.js", "Siti Custom", "Astro"],
    Visual: SitiVisual,
  },
  {
    id: "svc-ecommerce",
    title: "E-commerce",
    navLabel: "E-commerce",
    tagline: "Vendere online davvero, non solo esserci",
    description:
      "Negozi su misura o su piattaforme consolidate, disegnati attorno al percorso d'acquisto reale. Catalogo, pagamenti e checkout senza attriti per far crescere conversioni e valore medio dell'ordine — e che aggiorni in autonomia, senza dipendere da nessuno.",
    keypoints: [
      "Catalogo e schede prodotto curate",
      "Checkout a basso attrito",
      "Pagamenti avanzati e multi-provider",
      "Analytics e funnel di conversione",
    ],
    tags: ["Shopify", "Headless", "Pagamenti"],
    Visual: EcommerceVisual,
  },
  {
    id: "svc-uiux",
    title: "UI / UX Design",
    navLabel: "UI / UX",
    tagline: "Interfacce pensate per le persone",
    description:
      "Dalla ricerca al prototipo interattivo, fino al design system pronto allo sviluppo. Mettiamo ordine nei flussi e togliamo gli attriti, così chi usa il prodotto trova subito quello che cerca. Le mode passano, la chiarezza resta.",
    keypoints: [
      "User research e flussi",
      "Wireframe e prototipi interattivi",
      "Design system riusabile",
      "Handoff diretto agli sviluppatori",
    ],
    tags: ["Figma", "Design System", "Prototyping"],
    Visual: UiuxVisual,
  },
  {
    id: "svc-software",
    title: "App & Software",
    navLabel: "Software",
    tagline: "Sistemi che collegano i tuoi processi",
    description:
      "App web e mobile, dashboard, gestionali e API su misura che sostituiscono fogli di calcolo e strumenti scollegati. Un'unica fonte di verità, architetture scalabili e integrazioni con ciò che già usi: meno lavoro manuale, più controllo sui tuoi processi.",
    keypoints: [
      "Architetture scalabili",
      "API REST personalizzate",
      "Dashboard e gestionali",
      "Integrazioni con sistemi esistenti",
    ],
    tags: ["React", "Node", "Python"],
    Visual: SoftwareVisual,
  },
  {
    id: "svc-ai",
    title: "AI & Automazione",
    navLabel: "AI",
    tagline: "Intelligenza che mette ordine nei dati",
    description:
      "Assistenti conversazionali, ricerca intelligente sui tuoi documenti e automazioni che eliminano il lavoro ripetitivo. Colleghiamo i modelli ai tuoi dati reali, con attenzione a qualità, costi e privacy: l'AI che fa risparmiare ore, non quella che fa scena.",
    keypoints: [
      "Assistenti conversazionali su misura",
      "Pipeline RAG su dati aziendali",
      "Automazioni end-to-end",
      "Valutazione qualità e costi",
    ],
    tags: ["LLM", "RAG", "Automazioni"],
    Visual: AiVisual,
  },
  {
    id: "svc-consulenza",
    title: "Consulenza",
    navLabel: "Consulenza",
    tagline: "Dal caos alla strategia",
    description:
      "Audit dello stack esistente, roadmap tecnica e affiancamento al team. Trasformiamo decisioni sparse in una traiettoria chiara e sostenibile, e ti aiutiamo a scegliere le tecnologie giuste — senza vincoli, senza fuffa, con un occhio sempre ai costi.",
    keypoints: [
      "Audit tecnico dello stack",
      "Roadmap di prodotto",
      "Selezione tecnologie",
      "Affiancamento al team",
    ],
    tags: ["Strategia", "Audit", "Roadmap"],
    Visual: ConsulenzaVisual,
  },
] as const;

interface DetailViewProps {
  service: Service;
  services: readonly Service[];
  onSelect: (id: string) => void;
  reducedMotion: boolean;
}

function DetailView({
  service,
  services,
  onSelect,
  reducedMotion,
}: DetailViewProps) {
  const Visual = service.Visual;
  const tablistRef = useRef<HTMLDivElement>(null);

  // Tab pattern W3C APG: frecce per spostarsi (con wrap), Home/End agli estremi,
  // attivazione automatica della tab a fuoco.
  function onTabKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const ids = services.map((s) => s.id);
    const cur = ids.indexOf(service.id);
    let next = cur;
    if (e.key === "ArrowRight") next = (cur + 1) % ids.length;
    else if (e.key === "ArrowLeft") next = (cur - 1 + ids.length) % ids.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = ids.length - 1;
    onSelect(ids[next]);
    tablistRef.current
      ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      ?.[next]?.focus();
  }

  return (
    <div>
      <div className="border-b border-hairline">
        <div
          ref={tablistRef}
          role="tablist"
          aria-label="Naviga tra i servizi"
          onKeyDown={onTabKeyDown}
          className="-mb-px flex flex-wrap"
        >
          {services.map((s) => {
            const isActive = s.id === service.id;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                id={`tab-${s.id}`}
                aria-selected={isActive}
                aria-controls="servizi-panel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => onSelect(s.id)}
                className={[
                  "relative whitespace-nowrap px-3 py-3 text-[13px] font-medium tracking-[-0.005em] transition-colors duration-300 sm:px-4",
                  isActive
                    ? "text-brand-navy"
                    : "text-body/55 hover:text-ink-soft",
                ].join(" ")}
              >
                {s.navLabel}
                {isActive && (
                  <motion.span
                    layoutId="active-tab-underline"
                    aria-hidden
                    transition={{ duration: 0.45, ease }}
                    className="absolute inset-x-3 -bottom-px h-[2px] rounded-full bg-brand-blue"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div
        id="servizi-panel"
        role="tabpanel"
        aria-labelledby={`tab-${service.id}`}
        tabIndex={0}
        className="grid grid-cols-1 gap-6 pt-6 outline-none sm:grid-cols-2 sm:items-center sm:gap-10 sm:pt-12 lg:gap-20 lg:pt-16"
      >
        <motion.div
          key={`${service.id}-visual`}
          initial={reducedMotion ? false : { opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          className="order-1 mx-auto flex w-full max-w-[300px] items-center justify-center sm:mx-0 sm:max-w-none sm:justify-start"
          transition={{ duration: 0.5, ease }}
        >
          <Visual />
        </motion.div>

        <motion.div
          key={`${service.id}-content`}
          initial={reducedMotion ? false : { opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.06, ease }}
          className="order-2 text-center sm:text-left"
        >
          <h3 className="font-display text-[clamp(1.85rem,4vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
            {service.title}
          </h3>

          <p className="mt-2 text-[14px] italic text-brand-blue sm:mt-3 sm:text-[15px]">
            {service.tagline}
          </p>

          <p className="mt-6 hidden max-w-[520px] text-[16px] leading-[1.7] text-body sm:block">
            {service.description}
          </p>

          <ul className="mt-9 hidden space-y-3.5 sm:block" role="list">
            {service.keypoints.map((kp, i) => (
              <motion.li
                key={kp}
                initial={reducedMotion ? false : { opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.25 + i * 0.06, ease }}
                className="flex items-center gap-4 text-[14.5px] text-ink-soft"
              >
                <span
                  aria-hidden
                  className="h-px w-6 shrink-0 bg-gradient-to-r from-brand-blue/70 to-brand-cyan/30"
                />
                <span>{kp}</span>
              </motion.li>
            ))}
          </ul>

          <div className="mt-10 hidden flex-wrap gap-2 sm:flex">
            {service.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-hairline bg-canvas-soft/40 px-3 py-1 text-[11px] font-medium tracking-tight text-ink-soft/80"
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function Services() {
  const reducedMotion = usePrefersReducedMotion();
  const [activeId, setActiveId] = useState<string>(SERVICES[0].id);
  const active = SERVICES.find((s) => s.id === activeId) ?? SERVICES[0];

  // I link "Servizi" del footer attivano la tab corrispondente via evento
  // (la sezione è una vista a tab, non ci sono ancore DOM per ogni servizio).
  useEffect(() => {
    function onSelect(e: Event) {
      const id = (e as CustomEvent<string>).detail;
      if (id && SERVICES.some((s) => s.id === id)) setActiveId(id);
    }
    window.addEventListener(SELECT_SERVICE_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_SERVICE_EVENT, onSelect);
  }, []);

  return (
    <section
      id="servizi"
      aria-labelledby="servizi-heading"
      data-nav-theme="light"
      className="relative overflow-hidden py-16 sm:py-24 lg:py-40"
      style={{
        background:
          "linear-gradient(180deg, #ffffff 0%, #f6fafd 50%, #eef5fa 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-[-12%] h-[560px] w-[560px] rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(circle at center, rgba(61,156,199,0.22) 0%, rgba(61,156,199,0) 62%)",
          filter: "blur(28px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-18%] left-[-10%] h-[520px] w-[520px] rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(circle at center, rgba(21,117,164,0.18) 0%, rgba(21,117,164,0) 62%)",
          filter: "blur(32px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-cyan/15 to-transparent"
      />

      <div className="relative mx-auto max-w-[1200px] px-6">
        <motion.div
          initial={reducedMotion ? false : "hidden"}
          whileInView={reducedMotion ? undefined : "visible"}
          viewport={{ once: false, amount: 0.3, margin: "0px 0px -10% 0px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
          }}
          className="mx-auto mb-10 flex max-w-3xl flex-col items-center text-center sm:mb-16 lg:mb-24"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: -14 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6, ease }}
            className="inline-flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.32em] text-brand-blue/85"
          >
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-brand-blue/60" />
            Cosa facciamo
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-brand-blue/60" />
          </motion.div>

          <motion.h2
            id="servizi-heading"
            variants={{
              hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
              visible: { opacity: 1, y: 0, filter: "blur(0px)" },
            }}
            transition={{ duration: 0.85, ease }}
            className="mt-7 font-display text-[clamp(3rem,6.5vw,5.5rem)] font-semibold leading-[1] tracking-[-0.035em]"
          >
            <span className="bg-gradient-to-br from-brand-navy via-brand-blue to-brand-cyan bg-clip-text text-transparent">
              Servizi
            </span>
          </motion.h2>

          <motion.div
            variants={{
              hidden: { opacity: 0, scaleX: 0 },
              visible: { opacity: 1, scaleX: 1 },
            }}
            transition={{ duration: 0.7, ease }}
            aria-hidden
            className="mt-7 h-px w-16 origin-center bg-gradient-to-r from-transparent via-brand-blue/70 to-transparent"
          />

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 14 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.7, ease }}
            className="mx-auto mt-6 max-w-xl font-display text-[clamp(1.05rem,1.4vw,1.25rem)] italic leading-[1.55] text-ink-soft/85"
          >
            &ldquo;Dall&rsquo;idea al lancio, sotto lo stesso tetto.&rdquo;
          </motion.p>
        </motion.div>

        <DetailView
          service={active}
          services={SERVICES}
          onSelect={setActiveId}
          reducedMotion={reducedMotion}
        />
      </div>
    </section>
  );
}

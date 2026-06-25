"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Globe, ShoppingBag, Palette, Code2, Sparkles, Compass } from "lucide-react";
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
type IconComponent = typeof Globe;

interface Service {
  id: string;
  title: string;
  navLabel: string;
  tagline: string;
  description: string;
  keypoints: readonly string[];
  tags: readonly string[];
  Icon: IconComponent;
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
    Icon: Globe,
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
    Icon: ShoppingBag,
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
    Icon: Palette,
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
    Icon: Code2,
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
    Icon: Sparkles,
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
    Icon: Compass,
    Visual: ConsulenzaVisual,
  },
] as const;

/** Griglia panoramica = tablist accessibile (W3C APG): a colpo d'occhio i 6
 *  servizi, e funge da selettore con navigazione da frecce/Home/End. */
function ServiceOverview({
  services,
  activeId,
  onSelect,
}: {
  services: readonly Service[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const ids = services.map((s) => s.id);
    const cur = ids.indexOf(activeId);
    let next = cur;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (cur + 1) % ids.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (cur - 1 + ids.length) % ids.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = ids.length - 1;
    onSelect(ids[next]);
    listRef.current
      ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      ?.[next]?.focus();
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="I nostri servizi"
      onKeyDown={onKeyDown}
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      {services.map((s) => {
        const isActive = s.id === activeId;
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
              "group relative flex cursor-pointer items-start gap-3.5 rounded-2xl border p-4 text-left transition-all duration-300 ease-out-soft sm:p-5",
              isActive
                ? "border-brand-blue/30 bg-brand-50/70 shadow-[0_10px_24px_-14px_rgba(8,40,64,0.25)]"
                : "border-hairline bg-white hover:-translate-y-0.5 hover:border-brand-blue/20 hover:shadow-[0_10px_24px_-16px_rgba(8,40,64,0.2)]",
            ].join(" ")}
          >
            <span
              className={[
                "flex h-10 w-10 flex-none items-center justify-center rounded-xl ring-1 transition-colors duration-300",
                isActive
                  ? "bg-gradient-to-br from-brand-navy to-brand-blue text-white ring-white/15"
                  : "bg-brand-50 text-brand-blue ring-brand-blue/10",
              ].join(" ")}
            >
              <s.Icon size={18} strokeWidth={1.8} />
            </span>
            <span className="min-w-0">
              <span className="block font-display text-[15px] font-semibold tracking-[-0.01em] text-ink">
                {s.title}
              </span>
              <span className="mt-0.5 block text-[12.5px] leading-snug text-body">
                {s.tagline}
              </span>
            </span>
            {isActive && (
              <motion.span
                layoutId="svc-active-bar"
                aria-hidden
                transition={{ duration: 0.4, ease }}
                className="absolute inset-y-3 left-0 w-[3px] rounded-full bg-gradient-to-b from-brand-blue to-brand-cyan"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Pannello di dettaglio del servizio attivo — visibile anche su mobile. */
function ServicePanel({
  service,
  reducedMotion,
}: {
  service: Service;
  reducedMotion: boolean;
}) {
  const Visual = service.Visual;
  return (
    <div
      id="servizi-panel"
      role="tabpanel"
      aria-labelledby={`tab-${service.id}`}
      tabIndex={0}
      className="mt-6 grid grid-cols-1 items-center gap-8 rounded-[1.75rem] border border-hairline bg-white p-6 outline-none sm:p-9 lg:mt-8 lg:grid-cols-2 lg:gap-14 lg:p-12"
    >
      <motion.div
        key={`${service.id}-visual`}
        initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease }}
        className="order-1 mx-auto flex w-full max-w-[320px] items-center justify-center lg:max-w-none"
      >
        <Visual />
      </motion.div>

      <motion.div
        key={`${service.id}-content`}
        initial={reducedMotion ? false : { opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.05, ease }}
        className="order-2"
      >
        <h3 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-ink">
          {service.title}
        </h3>
        <p className="mt-2 text-[14px] italic text-brand-blue sm:text-[15px]">
          {service.tagline}
        </p>
        <p className="mt-5 max-w-[52ch] text-[15px] leading-[1.7] text-body sm:text-[16px]">
          {service.description}
        </p>

        <ul className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2" role="list">
          {service.keypoints.map((kp, i) => (
            <motion.li
              key={kp}
              initial={reducedMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.05, ease }}
              className="flex items-start gap-2.5 text-[14px] text-ink-soft"
            >
              <svg
                aria-hidden
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-0.5 flex-none text-brand-cyan"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <span>{kp}</span>
            </motion.li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-2">
          {service.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-hairline bg-canvas-soft/60 px-3 py-1 text-[11px] font-medium tracking-tight text-ink-soft/80"
            >
              {t}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export function Services() {
  const reducedMotion = usePrefersReducedMotion();
  const [activeId, setActiveId] = useState<string>(SERVICES[0].id);
  const active = SERVICES.find((s) => s.id === activeId) ?? SERVICES[0];

  // I link "Servizi" del footer attivano la tab corrispondente via evento.
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
      className="relative overflow-hidden bg-canvas py-20 sm:py-28 lg:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-[-12%] h-[460px] w-[460px] rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(circle at center, rgba(61,156,199,0.16) 0%, rgba(61,156,199,0) 62%)",
          filter: "blur(34px)",
        }}
      />

      <div className="relative mx-auto max-w-[1180px] px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-14">
          <span className="eyebrow inline-flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-brand-blue/60" />
            Cosa facciamo
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-brand-blue/60" />
          </span>
          <h2 id="servizi-heading" className="heading-lg mt-5 text-ink">
            Tutto quello che serve,{" "}
            <span className="text-gradient-brand">sotto lo stesso tetto.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[16px] leading-[1.65] text-body">
            Sei competenze, un solo team. Scegli un servizio per vedere come lo
            affrontiamo.
          </p>
        </div>

        <ServiceOverview services={SERVICES} activeId={activeId} onSelect={setActiveId} />
        <ServicePanel service={active} reducedMotion={reducedMotion} />
      </div>
    </section>
  );
}

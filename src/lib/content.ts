/**
 * Contenuti statici delle sezioni — italiano.
 * Centralizzato qui per modificare i testi senza toccare la UI.
 */

import {
  BrainCircuit,
  Calculator,
  Code,
  Compass,
  FileCheck2,
  LifeBuoy,
  type LucideIcon,
  PenTool,
  Rocket,
  Stamp,
  Vote,
  Wallet,
} from "lucide-react";

export interface Pillar {
  icon: LucideIcon;
  label: string;
}

export const nexiaPillars: Pillar[] = [
  { icon: Calculator, label: "Contabilità" },
  { icon: Stamp, label: "Fiscale" },
  { icon: Wallet, label: "Pagamenti" },
  { icon: Vote, label: "Assemblee" },
  { icon: FileCheck2, label: "Documentale" },
];

export interface ProcessStep {
  num: string;
  icon: LucideIcon;
  title: string;
  duration: string;
  description: string;
}

export const processSteps: ProcessStep[] = [
  {
    num: "01",
    icon: Compass,
    title: "Scopriamo",
    duration: "1 settimana",
    description:
      "Capiamo il problema, il pubblico e gli obiettivi. Nessun preventivo prima di averti ascoltato.",
  },
  {
    num: "02",
    icon: PenTool,
    title: "Disegniamo",
    duration: "1–3 settimane",
    description:
      "UX, wireframe e UI in Figma. Iteriamo finché non vedi esattamente il prodotto.",
  },
  {
    num: "03",
    icon: Code,
    title: "Sviluppiamo",
    duration: "3–10 settimane",
    description:
      "Codice scritto a mano, niente template. Demo settimanali, ambienti separati.",
  },
  {
    num: "04",
    icon: Rocket,
    title: "Lanciamo",
    duration: "Giorni",
    description:
      "Deploy su infrastruttura moderna, dominio, monitoraggio. Ti consegniamo le chiavi.",
  },
  {
    num: "05",
    icon: LifeBuoy,
    title: "Restiamo",
    duration: "Continuo",
    description:
      "Manutenzione, evoluzione, nuove feature. Il software è vivo, e noi con lui.",
  },
];

export interface TeamMember {
  initials: string;
  name: string;
  role: string;
  bio: string;
  expertise: string[];
}

export const team: TeamMember[] = [
  {
    initials: "D",
    name: "David",
    role: "Engineering Lead",
    bio: "Architettura, backend distribuiti, infrastruttura cloud. Disegna il cuore tecnico di Nexia.",
    expertise: ["TypeScript", "Next.js", "PostgreSQL", "DevOps"],
  },
  {
    initials: "G",
    name: "Giacomo",
    role: "Product & Design",
    bio: "UI/UX, prodotto, strategia. Traduce esigenze reali degli amministratori in interfacce che funzionano.",
    expertise: ["Product", "UI/UX", "Figma", "Frontend"],
  },
  {
    initials: "F",
    name: "Francesco",
    role: "AI & Automazione",
    bio: "Modelli, automazioni, integrazioni intelligenti. Porta l'AI dove crea valore reale.",
    expertise: ["AI", "RAG", "Pipelines", "Backend"],
  },
];

export interface AIService {
  icon: LucideIcon;
  label: string;
}

export const services: AIService[] = [
  { icon: Code, label: "Software custom" },
  { icon: BrainCircuit, label: "AI & automazione" },
  { icon: Wallet, label: "Ecommerce" },
  { icon: PenTool, label: "UI/UX design" },
];

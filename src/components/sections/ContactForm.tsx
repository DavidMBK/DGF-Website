"use client";
import { useState } from "react";
import Script from "next/script";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Plus } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  WEB3FORMS_ACCESS_KEY,
  HCAPTCHA_SITE_KEY,
  CONTACT_SUBJECT_PREFIX,
  CONTACT_FROM_NAME,
} from "@/lib/site-config";

const ease = [0.22, 1, 0.36, 1] as const;

type FormStatus = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const reducedMotion = usePrefersReducedMotion();
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const fd = new FormData(form);
    const get = (k: string) => ((fd.get(k) as string | null) ?? "").trim();

    // I campi del form sono in italiano: nome e cognome diventano un unico
    // "name", il resto viene mappato su chiavi leggibili nell'email.
    const name = `${get("nome")} ${get("cognome")}`.trim();
    const email = get("email");
    const phone = get("telefono");
    const company = get("azienda");
    const message = get("messaggio");
    // Token hCaptcha (campo nascosto iniettato dallo script hCaptcha).
    const hcaptchaToken = (fd.get("h-captcha-response") as string | null) ?? "";

    // Validazione lato client per un feedback immediato.
    if (!name || !email || !message) {
      setErrorMsg("Compila i campi obbligatori.");
      setStatus("error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg("Inserisci un indirizzo email valido.");
      setStatus("error");
      return;
    }
    if (HCAPTCHA_SITE_KEY && !hcaptchaToken) {
      setErrorMsg("Completa la verifica di sicurezza qui sotto.");
      setStatus("error");
      return;
    }

    // Web3Forms invia l'email al posto nostro. I campi "speciali" (access_key,
    // subject, from_name, replyto, botcheck, h-captcha-response) sono riservati;
    // gli altri compaiono nel corpo del messaggio che ricevi.
    const payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `${CONTACT_SUBJECT_PREFIX} — ${name}`,
      from_name: CONTACT_FROM_NAME,
      replyto: email, // così "Rispondi" nella mail va dritto al visitatore
      name,
      email,
      message,
      ...(phone ? { Telefono: phone } : {}),
      ...(company ? { Azienda: company } : {}),
      botcheck: get("botcheck"), // honeypot nativo Web3Forms
      "h-captcha-response": hcaptchaToken,
    };

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        message?: string;
      };
      if (!res.ok || !json.success) {
        throw new Error(json.message ?? "Errore durante l'invio");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      // Il token hCaptcha è monouso: dopo un errore lo resettiamo per il retry.
      (window as unknown as { hcaptcha?: { reset: () => void } }).hcaptcha?.reset();
      setErrorMsg(err instanceof Error ? err.message : "Errore sconosciuto");
      setStatus("error");
    }
  }

  return (
    <section
      id="contatti"
      aria-labelledby="contact-heading"
      data-nav-theme="light"
      className="relative overflow-hidden bg-canvas-soft py-20 sm:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-cyan/30 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-12%] h-[520px] w-[520px] rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(circle at center, rgba(61,156,199,0.18) 0%, rgba(61,156,199,0) 62%)",
          filter: "blur(30px)",
        }}
      />

      <div className="relative mx-auto max-w-[1140px] px-6">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 36 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease }}
          className="relative overflow-hidden rounded-[28px] border border-brand-blue/15 bg-white/90 shadow-[0_40px_90px_-55px_rgba(10,40,80,0.35)] backdrop-blur-sm"
        >
          {/* blueprint grid — linee blu appena accennate */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.55]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(61,156,199,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(61,156,199,0.07) 1px, transparent 1px)",
              backgroundSize: "46px 46px",
              maskImage:
                "radial-gradient(120% 120% at 70% 30%, #000 30%, transparent 78%)",
              WebkitMaskImage:
                "radial-gradient(120% 120% at 70% 30%, #000 30%, transparent 78%)",
            }}
          />
          {/* segni di registro blu agli angoli */}
          <Plus
            aria-hidden
            className="pointer-events-none absolute left-4 top-4 hidden h-3.5 w-3.5 text-brand-blue/35 sm:block"
            strokeWidth={1.5}
          />
          <Plus
            aria-hidden
            className="pointer-events-none absolute right-4 top-4 hidden h-3.5 w-3.5 text-brand-blue/35 sm:block"
            strokeWidth={1.5}
          />
          <Plus
            aria-hidden
            className="pointer-events-none absolute bottom-4 left-4 hidden h-3.5 w-3.5 text-brand-blue/35 sm:block"
            strokeWidth={1.5}
          />
          <Plus
            aria-hidden
            className="pointer-events-none absolute bottom-4 right-4 hidden h-3.5 w-3.5 text-brand-blue/35 sm:block"
            strokeWidth={1.5}
          />

          <div className="relative grid grid-cols-1 lg:grid-cols-[0.92fr_1.08fr]">
            {/* ── colonna sinistra: testo ── */}
            <motion.div
              initial={reducedMotion ? false : "hidden"}
              whileInView={reducedMotion ? undefined : "visible"}
              viewport={{ once: true, amount: 0.4 }}
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.14, delayChildren: 0.15 },
                },
              }}
              className="relative flex flex-col px-5 py-6 sm:px-11 sm:py-12 lg:border-r lg:border-brand-blue/12 lg:py-16"
            >
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: -12 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.6, ease }}
                className="inline-flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.32em] text-brand-blue/85"
              >
                <span className="h-px w-10 bg-gradient-to-r from-transparent to-brand-blue/60" />
                Contatti
              </motion.div>

              <motion.h2
                id="contact-heading"
                variants={{
                  hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
                  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
                }}
                transition={{ duration: 0.85, ease }}
                className="mt-4 font-display text-[clamp(1.7rem,4vw,3.4rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink sm:mt-6"
              >
                Pronto a costruire{" "}
                <span className="inline-block bg-gradient-to-br from-brand-blue to-brand-cyan bg-clip-text pb-[0.12em] pr-[0.06em] italic text-transparent">
                  qualcosa di reale?
                </span>
              </motion.h2>

              <motion.div
                variants={{
                  hidden: { opacity: 0, scaleX: 0 },
                  visible: { opacity: 1, scaleX: 1 },
                }}
                transition={{ duration: 0.7, ease }}
                aria-hidden
                className="mt-4 hidden h-px w-16 origin-left bg-gradient-to-r from-brand-blue/70 via-brand-cyan/40 to-transparent sm:mt-7 sm:block"
              />

              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.75, ease }}
                className="mt-6 max-w-[40ch] text-[16px] leading-[1.65] text-body"
              >
                Niente preventivi automatici, niente commerciali di passaggio.
                Raccontaci il progetto in due righe: ti rispondiamo noi, di persona.
              </motion.p>

              <motion.ul
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.75, ease }}
                className="mt-8 space-y-3.5 lg:mt-auto lg:pt-10"
              >
                {[
                  "Entro 24 ore leggiamo la tua richiesta",
                  "Ti proponiamo una call conoscitiva, gratuita",
                  "Da lì, una proposta chiara su tempi e costi",
                ].map((line) => (
                  <li
                    key={line}
                    className="flex items-center gap-3 text-[13.5px] text-body"
                  >
                    <ArrowRight
                      size={14}
                      strokeWidth={2}
                      className="shrink-0 text-brand-blue"
                    />
                    {line}
                  </li>
                ))}
              </motion.ul>
            </motion.div>

            {/* ── colonna destra: form ── */}
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 24 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, ease, delay: 0.18 }}
              className="relative px-5 py-5 sm:px-11 sm:py-12 lg:py-16"
            >
              {/* status bar tipo terminale */}
              <div className="mb-4 flex items-center justify-between border-b border-brand-blue/12 pb-3 sm:mb-9 sm:pb-4">
                <span className="flex items-center gap-2.5 font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink/50">
                  <span className="relative flex h-1.5 w-1.5">
                    {!reducedMotion && (
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-cyan/70" />
                    )}
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-blue" />
                  </span>
                  Nuova richiesta
                </span>
                <span className="font-mono text-[10.5px] tracking-[0.2em] text-brand-blue/55">
                  RISPOSTA · 24H
                </span>
              </div>

              {status === "success" ? (
                <div className="flex flex-col items-start border-l-2 border-brand-blue/40 py-2 pl-7">
                  <CheckCircle2
                    size={26}
                    strokeWidth={1.4}
                    className="text-brand-blue"
                  />
                  <h3 className="mt-5 font-display text-[22px] font-semibold tracking-[-0.01em] text-ink">
                    Richiesta inviata
                  </h3>
                  <p className="mt-3 max-w-sm text-[15px] leading-[1.6] text-body">
                    Grazie. Ti risponderemo entro 24 ore lavorative,
                    direttamente sulla tua email.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-3.5 sm:space-y-7">
                  {/* Honeypot anti-spam (Web3Forms controlla il campo "botcheck"):
                      fuori schermo e fuori dal tab order, invisibile agli umani. */}
                  <input
                    type="text"
                    name="botcheck"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden
                    style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
                  />
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 sm:gap-x-9 sm:gap-y-7">
                    <Field id="nome" label="Nome" required placeholder="Mario" maxLength={50} />
                    <Field id="cognome" label="Cognome" required placeholder="Rossi" maxLength={50} />
                  </div>
                  <Field id="email" label="Email" type="email" required placeholder="nome@azienda.it" maxLength={200} />
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 sm:gap-x-9 sm:gap-y-7">
                    <Field id="telefono" label="Telefono" type="tel" placeholder="opzionale" maxLength={40} />
                    <Field id="azienda" label="Azienda" placeholder="opzionale" maxLength={120} />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="messaggio"
                      className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft"
                    >
                      Il tuo progetto
                      <span className="ml-1 text-brand-blue">*</span>
                    </label>
                    <textarea
                      id="messaggio"
                      name="messaggio"
                      required
                      rows={3}
                      maxLength={5000}
                      placeholder="Due righe bastano: idee, obiettivi, scadenze…"
                      className="w-full resize-none rounded-xl border border-hairline bg-canvas-soft px-3.5 py-2.5 text-[15px] leading-[1.6] text-ink shadow-sm outline-none transition-all duration-200 placeholder:text-body focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/15"
                    />
                  </div>

                  {HCAPTCHA_SITE_KEY && (
                    <>
                      <Script
                        src="https://js.hcaptcha.com/1/api.js"
                        strategy="afterInteractive"
                      />
                      <div className="h-captcha" data-sitekey={HCAPTCHA_SITE_KEY} />
                    </>
                  )}

                  {status === "error" && (
                    <p className="text-[13px] text-red-500">
                      {errorMsg || "Qualcosa è andato storto. Riprova."}
                    </p>
                  )}

                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="group/btn inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-brand-navy px-6 py-3 text-[14px] font-semibold text-white shadow-brand transition-all duration-300 hover:bg-brand-blue disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      {status === "sending" ? "Invio in corso…" : "Invia richiesta"}
                      {status !== "sending" && (
                        <ArrowRight
                          size={16}
                          strokeWidth={2}
                          className="transition-transform duration-300 group-hover/btn:translate-x-1"
                        />
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface FieldProps {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
}

function Field({ id, label, type = "text", required, placeholder, maxLength }: FieldProps) {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft"
      >
        {label}
        {required && <span className="ml-1 text-brand-blue">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full rounded-xl border border-hairline bg-canvas-soft px-3.5 py-2.5 text-[15px] text-ink shadow-sm outline-none transition-all duration-200 placeholder:text-body focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/15"
      />
    </div>
  );
}

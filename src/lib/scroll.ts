const NAV_HEIGHT = 116; // px — main bar 64 + sub-bar 44 + 8 buffer

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
  window.scrollTo({ top, behavior: "smooth" });
}

// La sezione Servizi è una vista a tab: l'id del servizio non esiste come
// ancora nel DOM. I link "Servizi" del footer puntano a /#servizi e dispatchano
// questo evento, che la sezione Servizi ascolta per attivare la tab giusta.
export const SELECT_SERVICE_EVENT = "dgf:select-service";

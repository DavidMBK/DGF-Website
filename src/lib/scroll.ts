const NAV_HEIGHT = 116; // px — main bar 64 + sub-bar 44 + 8 buffer

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
  window.scrollTo({ top, behavior: "smooth" });
}

// La sezione Servizi è una vista a tab: l'id del servizio non esiste come
// ancora nel DOM. Per i link "Servizi" del footer notifichiamo la sezione di
// attivare la tab giusta (evento) e poi scrolliamo alla sezione #servizi.
export const SELECT_SERVICE_EVENT = "dgf:select-service";

export function selectService(id: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(SELECT_SERVICE_EVENT, { detail: id }));
  }
  scrollToSection("servizi");
}

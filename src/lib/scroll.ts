const NAV_HEIGHT = 116; // px — main bar 64 + sub-bar 44 + 8 buffer

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
  window.scrollTo({ top, behavior: "smooth" });
}

export function scrollToCard(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const top = el.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT - 24;
  window.scrollTo({ top, behavior: "smooth" });

  // Flash feedback once scroll has begun
  setTimeout(() => {
    el.classList.add("card-flash");
    el.addEventListener("animationend", () => el.classList.remove("card-flash"), {
      once: true,
    });
  }, 800);
}

import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { StyleGallery } from "@/components/sections/StyleGallery";
import { WhyUs } from "@/components/sections/WhyUs";
import { Consulenza } from "@/components/sections/Consulenza";
import { Services } from "@/components/sections/Services";
import { TechStack } from "@/components/sections/TechStack";
import { Process } from "@/components/sections/Process";
import { Faq } from "@/components/sections/Faq";
import { ContactForm } from "@/components/sections/ContactForm";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      {/* Skip-link: primo elemento focusabile, visibile solo su focus da
          tastiera. Permette di saltare nav + intro e andare al contenuto
          (WCAG 2.4.1 Bypass Blocks). */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-brand-navy focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg"
      >
        Salta al contenuto
      </a>
      <Nav />
      <main id="main" tabIndex={-1}>
        <Hero />
        <StyleGallery />
        <WhyUs />
        <Consulenza />
        <Services />
        <TechStack />
        <Process />
        <Faq />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}

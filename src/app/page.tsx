import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { StyleGallery } from "@/components/sections/StyleGallery";
import { Consulenza } from "@/components/sections/Consulenza";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { ContactForm } from "@/components/sections/ContactForm";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <StyleGallery />
        <Consulenza />
        <Services />
        <Process />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}

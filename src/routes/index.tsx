import { createFileRoute } from "@tanstack/react-router";
import { About } from "@/components/portfolio/About";
import { Blog } from "@/components/portfolio/Blog";
import { Company } from "@/components/portfolio/Company";
import { Contact } from "@/components/portfolio/Contact";
import { CursorGlow, ScrollProgress, ScrollToTop } from "@/components/portfolio/Effects";
import { Experience } from "@/components/portfolio/Experience";
import { Footer } from "@/components/portfolio/Footer";
import { Gallery } from "@/components/portfolio/Gallery";
import { Hero } from "@/components/portfolio/Hero";
import { HireMeDialog } from "@/components/portfolio/HireMeDialog";
import { Loader } from "@/components/portfolio/Loader";
import { Navbar } from "@/components/portfolio/Navbar";
import { Projects } from "@/components/portfolio/Projects";
import { RealtimeSync } from "@/components/portfolio/RealtimeSync";
import { Services } from "@/components/portfolio/Services";
import { Skills } from "@/components/portfolio/Skills";

import { Testimonials } from "@/components/portfolio/Testimonials";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <Loader />
      <RealtimeSync />

      <ScrollProgress />
      <CursorGlow />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Company />
        <Skills />
        <Services />
        <Projects />
        <Experience />
        <Gallery />
        <Testimonials />
        <Blog />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
      <HireMeDialog />
    </>
  );
}

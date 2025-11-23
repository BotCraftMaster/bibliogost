"use client";

import BibliographyFormatter from "@/components/bibliography-formatter";
import FAQSection from "@/components/faq-section";
import FeaturesSection from "@/components/features-section";
import Footer from "@/components/footer";
import HeroSection from "@/components/hero-section";
import HowItWorks from "@/components/how-it-works";
import JsonLd from "@/components/json-ld";
import SeoContent from "@/components/seo-content";

export default function Home() {
  return (
    <main className="bg-background min-h-screen">
      <JsonLd />
      <HeroSection />
      <BibliographyFormatter />
      <FeaturesSection />
      <HowItWorks />
      <FAQSection />
      <SeoContent />
      <Footer />
    </main>
  );
}

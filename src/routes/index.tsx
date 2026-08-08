// Execute esta instrucao no projeto: analise porque aconteceu uma quebra na implementação das tres imagens dos pães
import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Hero } from "@/components/home/Hero";
import { FeatureGrid } from "@/components/home/FeatureGrid";
import { ProductShowcase } from "@/components/home/ProductShowcase";
import { BrandStory } from "@/components/home/BrandStory";
import { HouseOffers } from "@/components/site/HouseOffers";
import { TemperaflixShowcase } from "@/components/site/TemperaflixShowcase";
import { FAQSection } from "@/components/home/FAQSection";
import { RecipeHighlights } from "@/components/home/RecipeHighlights";
import { SEO } from "@/components/home/SEO";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Temperanzza — Temperos Artesanais de Minas Gerais | Cozinha de Performance" },
      {
        name: "description",
        content:
          "Descubra a Temperanzza: temperos artesanais mineiros sem conservantes ou enchimentos. Blends para dietas keto, low carb e carnívora. Transforme sua cozinha com densidade nutricional e sabor real.",
      },
      { property: "og:title", content: "Temperanzza — Temperos Artesanais de Minas Gerais" },
      {
        property: "og:description",
        content:
          "Transforme sua cozinha com temperos artesanais mineiros focados em performance e saúde.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://temperanzza.com.br" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Temperanzza",
          url: "https://temperanzza.com.br",
          logo: "https://temperanzza.com.br/logo.png", // Fallback for brasão if available as file
          contactPoint: {
            "@type": "ContactPoint",
            email: "contatotemperanzza@gmail.com",
            contactType: "customer service",
          },
          sameAs: ["https://instagram.com/temperanzzacondimentos"],
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SiteLayout>
      <SEO />
      <Hero />
      <FeatureGrid />
      <HouseOffers />
      <ProductShowcase />
      <TemperaflixShowcase />
      <RecipeHighlights />
      <BrandStory />
      <FAQSection />
    </SiteLayout>
  );
}

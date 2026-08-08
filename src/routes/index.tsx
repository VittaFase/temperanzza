// Execute esta instrucao no projeto: agora reeplenete as novas imagens cada uma em sua devida receita
import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Hero } from "@/components/site/Hero";
import { FeatureGrid } from "@/components/site/FeatureGrid";
import { ProductShowcase } from "@/components/site/ProductShowcase";
import { BrandStory } from "@/components/site/BrandStory";
import { HouseOffers } from "@/components/site/HouseOffers";
import { TemperaflixShowcase } from "@/components/site/TemperaflixShowcase";
import { FAQSection } from "@/components/site/FAQSection";
import { RecipeHighlights } from "@/components/site/RecipeHighlights";
import { SEO } from "@/components/site/SEO";

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

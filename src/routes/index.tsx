import { createFileRoute } from "@tanstack/react-router";
import { SiteHero } from "@/components/site/SiteHero";
import { FeaturedProducts } from "@/components/site/FeaturedProducts";
import { HouseOffers } from "@/components/site/HouseOffers";
import { RecipeShowcase } from "@/components/site/RecipeShowcase";
import { SEO } from "@/components/site/SEO";
import { CollaborationCTA } from "@/components/site/CollaborationCTA";

const HOME_TITLE = "Temperanzza | Condimentos e Sabores de Minas Gerais";
const HOME_DESCRIPTION =
  "Conheça os condimentos e blends Temperanzza, descubra sabores para diferentes momentos à mesa e explore receitas da Cozinha Temperanzza.";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: HOME_TITLE },
      { name: "description", content: HOME_DESCRIPTION },
      { property: "og:title", content: "Temperanzza | Mais sabor para a sua cozinha" },
      { property: "og:description", content: HOME_DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://temperanzza.com.br/" }],
  }),
});

function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-paper">
      <SEO title={HOME_TITLE} description={HOME_DESCRIPTION} />

      <main className="flex-grow">
        <SiteHero />
        <FeaturedProducts />
        <RecipeShowcase />
        <CollaborationCTA />
        <HouseOffers />
      </main>
    </div>
  );
}

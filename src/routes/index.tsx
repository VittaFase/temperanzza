{/* CASA TEMPERANZZA - ESTRUTURA LIMPA */}
import { createFileRoute } from '@tanstack/react-router'
import { SiteHero } from '@/components/site/SiteHero'
import { FeaturedProducts } from '@/components/site/FeaturedProducts'
import { HouseOffers } from '@/components/site/HouseOffers'

import { RecipeShowcase } from '@/components/site/RecipeShowcase'
import { SEO } from '@/components/site/SEO'

export const Route = createFileRoute('/')({
  component: Home,
  head: () => ({
    meta: [
      { title: "Temperanzza | Temperos Artesanais de Minas Gerais" },
      { name: "description", content: "A Temperanzza traz a essência da culinária mineira em temperos artesanais puros. Sem conservantes, sem aditivos, apenas o sabor real para sua dieta e performance." },
      { property: "og:title", content: "Temperanzza | A Arte do Tempero Mineiro" },
      { property: "og:description", content: "Descubra blends exclusivos criados em Minas Gerais para transformar sua cozinha com densidade nutricional e sabor inigualável." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
})

function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-paper">
      <SEO 
        title="Temperanzza | Temperos Artesanais de Minas Gerais"
        description="Temperos artesanais puros de Minas Gerais. Sem conservantes ou aditivos. Ideal para dietas Low Carb, Keto e Performance."
      />
      
      <main className="flex-grow">
        <SiteHero />
        <FeaturedProducts />
        <RecipeShowcase />
        <HouseOffers />
        
      </main>
    </div>
  )
}

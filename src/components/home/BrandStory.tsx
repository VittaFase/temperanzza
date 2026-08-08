import { BrandSeal } from "@/components/site/BrandSeal";

export function BrandStory() {
  return (
    <section className="py-32 bg-brand-cream relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
        <BrandSeal className="w-[800px] h-[800px]" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-accent font-display uppercase tracking-[0.4em] text-xs mb-8 block">
            Nossa Essência
          </span>
          <h2 className="font-display text-5xl sm:text-6xl uppercase mb-10 text-brand-ink leading-none">
            O Toque Mineiro na<br />Cozinha de Performance
          </h2>
          <div className="space-y-6 font-serif italic text-lg sm:text-xl text-brand-ink/80 leading-relaxed">
            <p>
              A Temperanzza nasceu em Minas Gerais com um propósito claro: resgatar a densidade nutricional e o sabor real que a indústria de ultraprocessados tentou apagar.
            </p>
            <p>
              Acreditamos que tempero bom não é o que esconde o ingrediente, mas o que o eleva. Nossos blends são construídos para quem leva a saúde a sério, mas não abre mão do prazer de uma mesa autoral.
            </p>
          </div>
          <div className="mt-12 flex justify-center">
            <BrandSeal className="w-24 h-24 text-accent/20" />
          </div>
        </div>
      </div>
    </section>
  );
}

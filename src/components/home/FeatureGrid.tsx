import { BrandSeal } from "@/components/site/BrandSeal";

export function FeatureGrid() {
  const features = [
    {
      title: "Artesanal Mineiro",
      desc: "Produção em pequenos lotes no interior de Minas Gerais, preservando o frescor.",
      icon: "01"
    },
    {
      title: "Densidade Nutricional",
      desc: "Sem amido, açúcar, maltodextrina ou conservantes. Apenas especiarias puras.",
      icon: "02"
    },
    {
      title: "Performance",
      desc: "Desenvolvido para dietas Cetogênica, Low Carb e Carnívora Flexível.",
      icon: "03"
    }
  ];

  return (
    <section className="py-24 bg-brand-paper border-y border-brand-ink/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {features.map((f, i) => (
            <div key={i} className="relative group">
              <span className="font-display text-8xl text-brand-ink/5 absolute -top-10 -left-4 pointer-events-none group-hover:text-brand-mustard/10 transition-colors">
                {f.icon}
              </span>
              <h3 className="font-display text-2xl uppercase mb-4 text-brand-ink relative z-10">
                {f.title}
              </h3>
              <p className="font-serif italic text-brand-ink/70 leading-relaxed relative z-10">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

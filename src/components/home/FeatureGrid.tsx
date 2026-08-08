export function FeatureGrid() {
  return (
    <section className="py-20 bg-brand-paper">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-display uppercase text-2xl">Artesanal</h3>
            <p className="font-serif italic text-brand-ink/70">Feito em Minas Gerais com lotes pequenos.</p>
          </div>
          <div>
            <h3 className="font-display uppercase text-2xl">Puro</h3>
            <p className="font-serif italic text-brand-ink/70">Sem conservantes, açúcar ou maltodextrina.</p>
          </div>
          <div>
            <h3 className="font-display uppercase text-2xl">Saudável</h3>
            <p className="font-serif italic text-brand-ink/70">Focado em dietas keto, low carb e carnívora.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

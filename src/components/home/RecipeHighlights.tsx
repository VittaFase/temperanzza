import { Link } from "@tanstack/react-router";

export function RecipeHighlights() {
  return (
    <section className="py-20 bg-brand-ink text-brand-paper">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-display uppercase mb-8">Biblioteca Gastronômica</h2>
        <p className="mb-12 font-serif italic">Inspire-se com nossas receitas exclusivas.</p>
        <Link to="/cozinha" className="border border-brand-paper px-8 py-3 uppercase font-display">
          Acessar Cozinha
        </Link>
      </div>
    </section>
  );
}

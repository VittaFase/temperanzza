import { Link } from "@tanstack/react-router";

export function Hero() {
  return (
    <section className="relative h-[80vh] flex items-center bg-brand-ink text-brand-paper">
      <div className="container mx-auto px-4">
        <h1 className="text-6xl font-display uppercase">Temperanzza</h1>
        <p className="text-xl font-serif italic mt-4">Cozinha de Performance</p>
        <Link to="/produtos" className="inline-block mt-8 border border-brand-paper px-8 py-3 uppercase font-display">
          Ver Produtos
        </Link>
      </div>
    </section>
  );
}

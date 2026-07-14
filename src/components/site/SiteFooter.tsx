import { Link } from "@tanstack/react-router";
import { Instagram, Mail } from "lucide-react";
import { BrandSeal } from "./BrandSeal";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-foreground/15 bg-brand-ink text-brand-paper">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <BrandSeal size="lg" tone="paper" className="-ml-2" />
            <div className="mt-4 font-display text-2xl font-black uppercase tracking-wider">
              Temperanzza
            </div>
            <p className="mt-3 text-sm text-brand-paper/70 max-w-sm leading-relaxed">
              Sua marca de temperos artesanais para quem leva a cozinha a sério
              — do churrasco de domingo a seu prato autoral.
            </p>
          </div>
          <div>
            <h3 className="font-display uppercase text-sm tracking-widest text-brand-paper/60 mb-3">
              Navegar
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/produtos" className="hover:text-accent">
                  Catálogo completo
                </Link>
              </li>
              <li>
                <Link to="/cozinha" className="hover:text-accent">
                  Cozinha & Dietas
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="hover:text-accent">
                  Nossa história
                </Link>
              </li>
              <li>
                <Link to="/lojas" className="hover:text-accent">
                  Onde encontrar
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-display uppercase text-sm tracking-widest text-brand-paper/60 mb-3">
              Contato
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a
                  href="mailto:contatotemperanzza@gmail.com"
                  className="hover:text-accent"
                >
                  contatotemperanzza@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="h-4 w-4" />
                <a
                  href="https://instagram.com/temperanzzacondimentos"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-accent"
                >
                  @temperanzzacondimentos
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-brand-paper/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-brand-paper/50">
          <p>© {new Date().getFullYear()} Temperanzza. Todos os direitos reservados.</p>
          <p className="font-display uppercase tracking-widest">
            Feito com fogo, sal e tempo.
          </p>
        </div>
      </div>
    </footer>
  );
}

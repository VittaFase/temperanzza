import { Link } from "@tanstack/react-router";
import { Instagram, Mail, ArrowUpRight } from "lucide-react";
import { BrandSeal } from "./BrandSeal";

const SHOP_LINKS = [
  { to: "/produtos", label: "Todos os sabores" },
  { to: "/sua-caixa", label: "Monte sua caixa" },
  { to: "/temperaflix", label: "Temperaflix" },
] as const;

const DISCOVER_LINKS = [
  { to: "/cozinha", label: "Receitas" },
  { to: "/sobre", label: "A Casa" },
  { to: "/blog", label: "Blog" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-brand-ink/8 bg-brand-cream/55 text-brand-ink">
      <div
        className="page-shell py-14 sm:py-20"
        style={{ paddingBottom: "max(3.5rem, calc(env(safe-area-inset-bottom) + 2rem))" }}
      >
        <div className="grid gap-12 border-b border-brand-ink/10 pb-14 lg:grid-cols-[1.35fr_.65fr_.65fr] lg:gap-16">
          <div className="max-w-xl">
            <Link to="/" aria-label="Casa Temperanzza — início" className="inline-flex items-center gap-4">
              <BrandSeal size="lg" className="h-16 w-16" />
              <div>
                <p className="font-display text-4xl font-semibold leading-none tracking-[-0.03em]">Temperanzza</p>
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Casa Temperanzza · Minas Gerais</p>
              </div>
            </Link>
            <p className="mt-7 max-w-lg font-display text-3xl font-semibold leading-[1.05] sm:text-4xl">
              Mais sabor para os momentos que merecem ficar na memória.
            </p>
            <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">
              Condimentos e blends para a cozinha cotidiana, o churrasco, as receitas da família e as novas descobertas à mesa.
            </p>
          </div>

          <FooterGroup title="Comprar" links={SHOP_LINKS} />
          <FooterGroup title="Descobrir" links={DISCOVER_LINKS} />
        </div>

        <div className="grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Fale com a Casa</p>
            <a href="mailto:contatotemperanzza@gmail.com" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold hover:opacity-65">
              <Mail className="h-4 w-4" /> contatotemperanzza@gmail.com
            </a>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Acompanhe</p>
            <a href="https://instagram.com/temperanzzacondimentos" target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold hover:opacity-65">
              <Instagram className="h-4 w-4" /> @temperanzzacondimentos
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground lg:justify-end">
            <Link to="/legal/privacidade" className="hover:text-brand-ink">Privacidade</Link>
            <Link to="/legal/termos" className="hover:text-brand-ink">Termos</Link>
            <Link to="/legal/trocas" className="hover:text-brand-ink">Trocas</Link>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-brand-ink/10 pt-7 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Temperanzza. Todos os direitos reservados.</p>
          <p className="font-semibold uppercase tracking-[0.18em] text-brand-ink/55">Feito com fogo, sabor e tempo.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterGroup({ title, links }: { title: string; links: readonly { to: string; label: string }[] }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{title}</h3>
      <ul className="mt-5 space-y-1">
        {links.map((item) => (
          <li key={item.to}>
            <Link to={item.to} className="inline-flex min-h-10 items-center font-display text-xl font-semibold transition hover:translate-x-1">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

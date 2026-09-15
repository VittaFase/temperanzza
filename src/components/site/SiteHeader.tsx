import { Link } from "@tanstack/react-router";
import { CartDrawer } from "./CartDrawer";
import { BrandSeal } from "./BrandSeal";
import { Menu, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";

const LEFT_NAV = [
  { to: "/produtos", label: "Produtos" },
  { to: "/cozinha", label: "Receitas" },
  { to: "/sobre", label: "Sobre" },
] as const;

const RIGHT_NAV = [
  { to: "/sua-caixa", label: "Monte sua caixa" },
  { to: "/temperaflix", label: "Temperaflix" },
] as const;

const MOBILE_NAV = [...LEFT_NAV, ...RIGHT_NAV] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-40 w-full border-b border-brand-ink/10 bg-white/96 backdrop-blur-xl"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div
        className="page-shell grid h-[92px] grid-cols-[1fr_auto_1fr] items-center gap-5 lg:h-[112px]"
        style={{
          paddingLeft: "max(1rem, env(safe-area-inset-left))",
          paddingRight: "max(1rem, env(safe-area-inset-right))",
        }}
      >
        <nav className="hidden items-center gap-8 justify-self-start lg:flex" aria-label="Navegação principal">
          {LEFT_NAV.map((item) => (
            <Link key={item.to} to={item.to} className="relative inline-flex min-h-11 items-center text-[13px] font-semibold uppercase tracking-[0.16em] text-brand-ink/75 transition hover:text-brand-ink after:absolute after:bottom-1 after:left-0 after:h-px after:w-0 after:bg-brand-ink after:transition-all hover:after:w-full" activeProps={{ className: "text-brand-ink after:w-full", "aria-current": "page" }}>
              {item.label}
            </Link>
          ))}
        </nav>

        <Link to="/" className="flex min-h-16 items-center justify-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ink/30" aria-label="Temperanzza — início">
          <BrandSeal size="full" eager className="h-[72px] w-[170px] object-contain lg:h-[88px] lg:w-[210px]" />
        </Link>

        <div className="flex items-center justify-self-end gap-2 lg:gap-6">
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegação comercial">
            {RIGHT_NAV.map((item) => (
              <Link key={item.to} to={item.to} className="relative inline-flex min-h-11 items-center text-[13px] font-semibold uppercase tracking-[0.16em] text-brand-ink/75 transition hover:text-brand-ink after:absolute after:bottom-1 after:left-0 after:h-px after:w-0 after:bg-brand-ink after:transition-all hover:after:w-full" activeProps={{ className: "text-brand-ink after:w-full", "aria-current": "page" }}>
                {item.label}
              </Link>
            ))}
          </nav>
          <span className="hidden h-8 w-px bg-brand-ink/15 lg:block" aria-hidden="true" />
          <CartDrawer />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full border border-brand-ink/10 bg-white lg:hidden" aria-label="Abrir menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(92vw,430px)] border-l-0 bg-brand-paper p-0">
              <div className="flex h-full flex-col p-7 sm:p-9">
                <div className="flex items-center gap-3 border-b border-brand-ink/10 pb-6">
                  <BrandSeal size="full" className="h-14 w-32 object-contain" />
                  <SheetTitle className="sr-only">Menu Casa Temperanzza</SheetTitle>
                </div>
                <nav className="mt-8 flex flex-col" aria-label="Navegação mobile">
                  {MOBILE_NAV.map((item, index) => (
                    <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="group flex items-center justify-between border-b border-brand-ink/10 py-5 font-display text-3xl font-semibold leading-none text-brand-ink" activeProps={{ "aria-current": "page" }}>
                      <span><span className="mr-4 align-middle text-[10px] font-sans font-semibold text-brand-ink/35">0{index + 1}</span>{item.label}</span>
                      <ArrowUpRight className="h-5 w-5 text-brand-ink/35 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </nav>
                <p className="mt-auto max-w-xs pt-10 text-sm leading-6 text-muted-foreground">Condimentos para trazer mais sabor aos momentos que acontecem à mesa.</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

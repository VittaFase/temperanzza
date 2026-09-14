import { Link } from "@tanstack/react-router";
import { CartDrawer } from "./CartDrawer";
import { BrandSeal } from "./BrandSeal";
import { Menu, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";

const PRIMARY_NAV = [
  { to: "/produtos", label: "Sabores" },
  { to: "/cozinha", label: "Receitas" },
  { to: "/sua-caixa", label: "Monte sua caixa" },
  { to: "/sobre", label: "A Casa" },
] as const;

const SECONDARY_NAV = [
  { to: "/temperaflix", label: "Temperaflix" },
  { to: "/blog", label: "Blog" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-40 w-full border-b border-brand-ink/8 bg-brand-paper/92 backdrop-blur-xl"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div
        className="page-shell flex h-[72px] items-center justify-between gap-4"
        style={{
          paddingLeft: "max(1rem, env(safe-area-inset-left))",
          paddingRight: "max(1rem, env(safe-area-inset-right))",
        }}
      >
        <Link
          to="/"
          className="flex min-h-11 shrink-0 items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ink/30"
          aria-label="Casa Temperanzza — início"
        >
          <BrandSeal size="sm" eager className="h-10 w-10 shrink-0" />
          <div className="leading-none">
            <span className="block font-display text-[1.55rem] font-semibold tracking-[-0.03em] text-brand-ink sm:text-[1.75rem]">
              Temperanzza
            </span>
            <span className="mt-1 hidden text-[9px] font-semibold uppercase tracking-[0.22em] text-muted-foreground sm:block">
              Casa de sabores
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegação principal">
          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="relative inline-flex min-h-11 items-center text-sm font-semibold text-brand-ink/68 transition hover:text-brand-ink after:absolute after:bottom-1 after:left-0 after:h-px after:w-0 after:bg-brand-ink after:transition-all hover:after:w-full"
              activeProps={{ className: "text-brand-ink after:w-full", "aria-current": "page" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <CartDrawer />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 rounded-full border border-brand-ink/10 bg-white lg:hidden"
                aria-label="Abrir menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(92vw,430px)] border-l-0 bg-brand-paper p-0">
              <div className="flex h-full flex-col p-7 sm:p-9">
                <div className="flex items-center gap-3 border-b border-brand-ink/10 pb-6">
                  <BrandSeal size="sm" className="h-10 w-10" />
                  <SheetTitle className="font-display text-2xl font-semibold text-brand-ink">Casa Temperanzza</SheetTitle>
                </div>

                <nav className="mt-10 flex flex-col" aria-label="Navegação mobile">
                  {PRIMARY_NAV.map((item, index) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className="group flex items-center justify-between border-b border-brand-ink/10 py-5 font-display text-3xl font-semibold leading-none text-brand-ink"
                      activeProps={{ "aria-current": "page" }}
                    >
                      <span><span className="mr-4 align-middle text-[10px] font-sans font-semibold text-brand-ink/35">0{index + 1}</span>{item.label}</span>
                      <ArrowUpRight className="h-5 w-5 text-brand-ink/35 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto pt-10">
                  <div className="flex flex-wrap gap-x-5 gap-y-3">
                    {SECONDARY_NAV.map((item) => (
                      <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="text-sm font-semibold text-brand-ink/60 hover:text-brand-ink">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  <p className="mt-7 max-w-xs text-sm leading-6 text-muted-foreground">
                    Condimentos para trazer mais sabor aos momentos que acontecem à mesa.
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

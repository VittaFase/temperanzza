import { Link } from "@tanstack/react-router";
import { CartDrawer } from "./CartDrawer";
import { BrandSeal } from "./BrandSeal";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";

const NAV = [
  { to: "/", label: "Início" },
  { to: "/produtos", label: "Catálogo" },
  { to: "/blends", label: "Blends" },
  { to: "/cozinha", label: "Cozinha" },
  { to: "/temperaflix", label: "Temperaflix" },
  { to: "/sobre", label: "A Casa" },
  { to: "/blog", label: "Blog" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header
      className="sticky top-0 z-40 w-full border-b border-foreground/15 bg-background/90 backdrop-blur"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div
        className="mx-auto max-w-7xl flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6 lg:px-8 gap-4"
        style={{
          paddingLeft: "max(1rem, env(safe-area-inset-left))",
          paddingRight: "max(1rem, env(safe-area-inset-right))",
        }}
      >
        <Link
          to="/"
          className="flex min-h-11 items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background shrink-0"
          aria-label="Temperanzza — Início"
        >
          <BrandSeal size="sm" eager className="shrink-0 w-8 h-8 sm:w-10 sm:h-10" />
          <div className="flex items-baseline gap-1.5 border-l border-foreground/20 pl-3">
            <span className="font-display text-2xl sm:text-3xl font-black tracking-wider uppercase leading-none">
              Temperanzza
            </span>
            <span className="hidden sm:inline text-xs uppercase tracking-[0.25em] text-muted-foreground border-l border-foreground/30 pl-1.5">
              SPICE HOUSE
            </span>
          </div>
        </Link>
        <nav className="hidden lg:flex items-center gap-4 xl:gap-8 overflow-hidden" aria-label="Navegação principal">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm font-semibold uppercase tracking-wider text-foreground/70 hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              activeProps={{
                className: "text-accent",
                "aria-current": "page",
              }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <CartDrawer />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden rounded-none border-foreground/20 bg-transparent h-11 w-11 focus-visible:ring-2 focus-visible:ring-accent"
                aria-label="Abrir menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-background">
              <SheetTitle className="font-display text-xl uppercase">
                Menu
              </SheetTitle>
              <nav className="mt-8 flex flex-col gap-4" aria-label="Navegação principal">
                {NAV.map((n) => (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={() => setOpen(false)}
                    className="text-2xl font-display uppercase tracking-wide hover:text-accent focus-visible:outline-none focus-visible:text-accent"
                    activeProps={{
                      className: "text-accent",
                      "aria-current": "page",
                    }}
                    activeOptions={{ exact: n.to === "/" }}
                  >
                    {n.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

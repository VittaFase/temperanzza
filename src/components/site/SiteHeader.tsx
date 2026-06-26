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
  { to: "/temperaflix", label: "Temperaflix" },
  { to: "/sobre", label: "A Casa" },
  { to: "/lojas", label: "Lojas" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full border-b border-foreground/15 bg-background/90 backdrop-blur">
      <div className="mx-auto max-w-7xl flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 group" aria-label="Temperanzza — Início">
          <BrandSeal size="sm" eager className="shrink-0" />
          <span className="hidden sm:flex items-baseline gap-1.5 border-l border-foreground/20 pl-3">
            <span className="font-display text-2xl sm:text-3xl font-black tracking-wider uppercase leading-none">
              Temperanzza
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground border-l border-foreground/30 pl-1.5">
              Spice House
            </span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm font-semibold uppercase tracking-wider text-foreground/70 hover:text-accent transition-colors"
              activeProps={{ className: "text-accent" }}
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
                className="md:hidden rounded-none border-foreground/20 bg-transparent h-11 w-11"
                aria-label="Abrir menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-background">
              <SheetTitle className="font-display text-xl uppercase">
                Menu
              </SheetTitle>
              <nav className="mt-8 flex flex-col gap-4">
                {NAV.map((n) => (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={() => setOpen(false)}
                    className="text-2xl font-display uppercase tracking-wide hover:text-accent"
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

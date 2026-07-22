import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { PromoAnnouncement } from "./PromoAnnouncement";
import { useCartSync } from "@/hooks/useCartSync";
import { Toaster } from "@/components/ui/sonner";

export function SiteLayout({ children }: { children: ReactNode }) {
  useCartSync();
  return (
    <div className="min-h-screen flex flex-col bg-paper-grain">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-brand-ink focus:text-brand-paper focus:px-4 focus:py-2 focus:rounded-none focus:outline-none focus:ring-2 focus:ring-accent"
      >
        Pular para o conteúdo
      </a>
      <PromoAnnouncement />
      <SiteHeader />
      <main id="conteudo" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <SiteFooter />
      <Toaster position="top-center" />
    </div>
  );
}

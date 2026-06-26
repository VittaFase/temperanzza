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
      <PromoAnnouncement />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <Toaster position="top-center" />
    </div>
  );
}

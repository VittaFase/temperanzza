import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/legal")({
  component: LegalLayout,
});

function LegalLayout() {
  return (
    <SiteLayout>
      <div className="bg-brand-paper min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-brand-cream/30 border border-foreground/5 shadow-sm p-8 sm:p-12">
          <Outlet />
        </div>
      </div>
    </SiteLayout>
  );
}

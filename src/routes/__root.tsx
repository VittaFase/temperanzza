import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PromoAnnouncement } from "@/components/site/PromoAnnouncement";
import { Toaster } from "@/components/ui/sonner";
import appCss from "../styles.css?url";
import sealAsset from "@/assets/temperanzza-seal.png.asset.json";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <main className="bg-brand-paper px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-[2.75rem] bg-brand-cream px-6 py-16 text-center sm:px-12 sm:py-20">
        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Casa Temperanzza · 404</span>
        <h1 className="mt-5 font-display text-[clamp(3.5rem,9vw,7rem)] font-semibold leading-[.88] tracking-[-0.04em] text-brand-ink">
          Essa página não está mais à mesa.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
          O endereço pode ter mudado. Volte para a Casa Temperanzza ou explore os sabores disponíveis na loja.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link to="/" className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-ink px-6 text-sm font-semibold text-brand-paper transition hover:-translate-y-0.5 hover:opacity-90">
            Voltar ao início
          </Link>
          <Link to="/produtos" className="inline-flex min-h-12 items-center justify-center rounded-full border border-brand-ink/15 bg-white px-6 text-sm font-semibold text-brand-ink transition hover:border-brand-ink/30">
            Conhecer os sabores
          </Link>
        </div>
      </div>
    </main>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <main className="bg-brand-paper px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-[2.75rem] bg-brand-cream px-6 py-16 text-center sm:px-12 sm:py-20">
        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Casa Temperanzza</span>
        <h1 className="mt-5 font-display text-[clamp(3rem,8vw,6rem)] font-semibold leading-[.9] tracking-[-0.035em] text-brand-ink">
          Não conseguimos servir esta página agora.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
          Houve uma falha no carregamento. Você pode tentar novamente ou voltar para o início sem perder o caminho da Casa.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-ink px-6 text-sm font-semibold text-brand-paper transition hover:-translate-y-0.5 hover:opacity-90"
          >
            Tentar novamente
          </button>
          <a href="/" className="inline-flex min-h-12 items-center justify-center rounded-full border border-brand-ink/15 bg-white px-6 text-sm font-semibold text-brand-ink transition hover:border-brand-ink/30">
            Voltar ao início
          </a>
        </div>
      </div>
    </main>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Temperanzza — Casa de Temperos Artesanais" },
      { name: "description", content: "Casa de temperos artesanais de Minas Gerais." },
      { name: "author", content: "Temperanzza" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Temperanzza" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "google-site-verification", content: "7pDF9jW-6UORnGWAl-1L4FfN0aS-wyWAKLvik3gAsG8" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: sealAsset.url },
      { rel: "apple-touch-icon", href: sealAsset.url },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <PromoAnnouncement />
      <SiteHeader />
      <Outlet />
      <SiteFooter />
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}

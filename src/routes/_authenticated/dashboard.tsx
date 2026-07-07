import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { checkIsAdmin } from "@/lib/dashboardAuth.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, Package, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Temperanzza" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: DashboardHome,
  errorComponent: ({ error }) => (
    <div className="p-8 text-center text-destructive">Erro: {error.message}</div>
  ),
  notFoundComponent: () => <div className="p-8">Página não encontrada.</div>,
});

function DashboardHome() {
  const navigate = useNavigate();
  const check = useServerFn(checkIsAdmin);
  const { data, isLoading, error } = useQuery({
    queryKey: ["is-admin"],
    queryFn: () => check(),
  });

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Sessão encerrada");
    navigate({ to: "/auth" });
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <p className="text-destructive">Erro: {error.message}</p>
      </div>
    );
  }

  if (!data?.isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md text-center border-2 border-foreground/15 p-8">
          <h1 className="font-display text-2xl uppercase tracking-wide">
            Acesso restrito
          </h1>
          <p className="mt-4 text-muted-foreground">
            Sua conta está autenticada, mas ainda não tem permissão de administrador
            neste painel. Peça ao proprietário para promover seu usuário.
          </p>
          <p className="mt-3 text-xs text-muted-foreground font-mono break-all">
            ID: {data?.userId}
          </p>
          <div className="mt-6 flex gap-2 justify-center">
            <Button asChild variant="outline" className="rounded-none">
              <Link to="/">Voltar ao site</Link>
            </Button>
            <Button onClick={signOut} className="rounded-none">
              <LogOut className="h-4 w-4 mr-2" /> Sair
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-foreground/15 bg-card">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl uppercase tracking-wide">
              Temperanzza Dashboard
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Painel Administrativo
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/">Ver site</Link>
            </Button>
            <Button onClick={signOut} variant="outline" size="sm" className="rounded-none">
              <LogOut className="h-4 w-4 mr-2" /> Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="font-display text-3xl uppercase tracking-wide">
          Visão geral
        </h2>
        <p className="text-muted-foreground mt-2">
          Bem-vindo, administrador. As integrações com Shopify Admin API serão
          plugadas nos próximos passos.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card icon={<ShoppingCart />} title="Pedidos" desc="Aguardando integração Shopify Admin" />
          <Card icon={<Package />} title="Produtos" desc="Aguardando integração Shopify Admin" />
          <Card icon={<Users />} title="Clientes" desc="Aguardando integração Shopify Admin" />
          <Card icon={<TrendingUp />} title="Faturamento" desc="Aguardando integração Shopify Admin" />
        </div>

        <div className="mt-10 border-2 border-dashed border-foreground/15 p-8 text-center">
          <p className="font-display text-xl uppercase">Fase 2</p>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Próximo passo: criar as server functions que chamam a Admin API do
            Shopify usando o token SHOPIFY_ADMIN_TOKEN já salvo.
          </p>
        </div>
      </main>
    </div>
  );
}

function Card({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="border-2 border-foreground/15 bg-card p-5">
      <div className="text-accent">{icon}</div>
      <p className="mt-3 font-display text-lg uppercase tracking-wide">{title}</p>
      <p className="text-xs text-muted-foreground mt-1">{desc}</p>
    </div>
  );
}

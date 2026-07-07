import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { checkIsAdmin } from "@/lib/dashboardAuth.functions";
import { getShopifyStats, getRecentOrders } from "@/lib/shopifyAdmin.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, Package, ShoppingCart, Users, TrendingUp, AlertCircle } from "lucide-react";
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
          Dados ao vivo da Shopify Admin API — últimos 30 dias.
        </p>

        <StatsGrid />
        <RecentOrdersTable />
      </main>
    </div>
  );
}

function StatsGrid() {
  const fetchStats = useServerFn(getShopifyStats);
  const { data, isLoading, error } = useQuery({
    queryKey: ["shopify-stats"],
    queryFn: () => fetchStats(),
    refetchOnWindowFocus: true,
    staleTime: 60_000,
  });

  if (isLoading) {
    return (
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border-2 border-foreground/15 bg-card p-5 h-32 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 border-2 border-destructive/40 bg-destructive/5 p-5 flex gap-3">
        <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
        <div>
          <p className="font-display uppercase text-sm">Erro ao carregar Shopify</p>
          <p className="text-xs text-muted-foreground mt-1 font-mono break-all">{error.message}</p>
        </div>
      </div>
    );
  }

  const money = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: data?.currency || "BRL",
  });

  const errs = data?.errors;
  const hasAnyErr = errs && (errs.orders || errs.products || errs.customers);

  return (
    <>
      {hasAnyErr && (
        <div className="mt-8 border-2 border-amber-500/40 bg-amber-500/5 p-5">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
            <div className="text-sm">
              <p className="font-display uppercase">Permissões do token Shopify Admin</p>
              <p className="text-xs text-muted-foreground mt-1">
                Alguns dados não puderam ser carregados. Verifique os escopos do app no admin da Shopify
                (Settings → Apps → seu app custom): habilite <code className="font-mono">read_orders</code>,{" "}
                <code className="font-mono">read_products</code>, <code className="font-mono">read_customers</code>.
                Para pedidos/clientes, também é preciso solicitar <em>Protected customer data access</em>.
              </p>
              <ul className="mt-2 text-xs font-mono space-y-1">
                {errs?.orders && <li>• orders: {errs.orders}</li>}
                {errs?.products && <li>• products: {errs.products}</li>}
                {errs?.customers && <li>• customers: {errs.customers}</li>}
              </ul>
            </div>
          </div>
        </div>
      )}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi icon={<ShoppingCart />} label="Pedidos (30d)" value={errs?.orders ? "—" : String(data?.ordersLast30d ?? 0)} />
        <Kpi icon={<TrendingUp />} label="Faturamento (30d)" value={errs?.orders ? "—" : money.format(data?.revenueLast30d ?? 0)} />
        <Kpi icon={<Package />} label="Produtos" value={errs?.products ? "—" : String(data?.productsCount ?? 0)} />
        <Kpi icon={<Users />} label="Clientes" value={errs?.customers ? "—" : String(data?.customersCount ?? 0)} />
      </div>
    </>
  );
}


function RecentOrdersTable() {
  const fetchOrders = useServerFn(getRecentOrders);
  const { data, isLoading, error } = useQuery({
    queryKey: ["shopify-recent-orders"],
    queryFn: () => fetchOrders(),
    refetchOnWindowFocus: true,
    staleTime: 60_000,
  });

  return (
    <section className="mt-10">
      <h3 className="font-display text-xl uppercase tracking-wide">Últimos pedidos</h3>
      <div className="mt-4 border-2 border-foreground/15 bg-card overflow-x-auto">
        {isLoading ? (
          <div className="p-8 flex justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : error ? (
          <p className="p-6 text-destructive text-sm">{error.message}</p>
        ) : !data || data.length === 0 ? (
          <p className="p-6 text-muted-foreground text-sm">Nenhum pedido encontrado.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-foreground/15 text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3">Pedido</th>
                <th className="text-left px-4 py-3">Cliente</th>
                <th className="text-left px-4 py-3">Data</th>
                <th className="text-left px-4 py-3">Pagto</th>
                <th className="text-left px-4 py-3">Envio</th>
                <th className="text-right px-4 py-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.map((o) => (
                <tr key={o.id} className="border-b border-foreground/10 last:border-b-0">
                  <td className="px-4 py-3 font-mono">{o.name}</td>
                  <td className="px-4 py-3">
                    {o.customerName || "—"}
                    {o.customerEmail && (
                      <div className="text-xs text-muted-foreground">{o.customerEmail}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(o.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3 text-xs uppercase">{o.financialStatus || "—"}</td>
                  <td className="px-4 py-3 text-xs uppercase">{o.fulfillmentStatus || "—"}</td>
                  <td className="px-4 py-3 text-right font-medium">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: o.currency || "BRL",
                    }).format(o.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

function Kpi({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="border-2 border-foreground/15 bg-card p-5">
      <div className="text-accent">{icon}</div>
      <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl">{value}</p>
    </div>
  );
}

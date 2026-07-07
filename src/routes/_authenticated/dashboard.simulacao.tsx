import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  getEngineState, calcularTempero,
  previewEngineToShopify, applyEngineToShopify,
} from "@/lib/dashboardEngine.functions";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Play, Rocket, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/simulacao")({
  head: () => ({
    meta: [
      { title: "Simulação → Shopify — Temperanzza Dashboard" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: SimulacaoPage,
  errorComponent: ({ error }) => <div className="p-8 text-destructive">Erro: {error.message}</div>,
  notFoundComponent: () => <div className="p-8">Página não encontrada.</div>,
});

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function SimulacaoPage() {
  const qc = useQueryClient();
  const fetchEngine = useServerFn(getEngineState);
  const previewFn = useServerFn(previewEngineToShopify);
  const applyFn = useServerFn(applyEngineToShopify);
  const { data, isLoading } = useQuery({ queryKey: ["engine-state"], queryFn: () => fetchEngine() });
  const [target, setTarget] = useState<"cliente" | "atacado">("cliente");
  const [preview, setPreview] = useState<Awaited<ReturnType<typeof previewEngineToShopify>> | null>(null);

  const previewMut = useMutation({
    mutationFn: () => previewFn({ data: { target } }),
    onSuccess: (r) => setPreview(r),
    onError: (e) => toast.error((e as Error).message),
  });

  const applyMut = useMutation({
    mutationFn: () => applyFn({ data: { target, reason: `Push manual (${target})` } }),
    onSuccess: (r) => {
      toast.success(`${r.applied} preços atualizados na Shopify`);
      if (r.errors.length) toast.error(`${r.errors.length} falhas — veja o log`);
      setPreview(null);
      qc.invalidateQueries({ queryKey: ["pricing-history"] });
    },
    onError: (e) => toast.error((e as Error).message),
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-foreground/15 bg-card">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl uppercase tracking-wide">Simulação → Shopify</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Fórmula Manus aplicada aos 19 SKUs, com push atômico
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="ghost" size="sm"><Link to="/dashboard/produtos">Produtos</Link></Button>
            <Button asChild variant="ghost" size="sm"><Link to="/dashboard/configuracoes">Variáveis</Link></Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/dashboard"><ArrowLeft className="h-4 w-4 mr-2" /> Voltar</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {isLoading && <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin" /></div>}
        {data && (
          <>
            <section className="border-2 border-foreground/15 bg-card p-6 mb-6">
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Aplicar preço</span>
                  <div className="mt-1 flex gap-2">
                    {(["cliente", "atacado"] as const).map((t) => (
                      <Button key={t} size="sm" variant={target === t ? "default" : "outline"}
                        onClick={() => { setTarget(t); setPreview(null); }} className="rounded-none">
                        {t === "cliente" ? "Cliente (varejo)" : "Atacado"}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex-1" />
                <Button onClick={() => previewMut.mutate()} disabled={previewMut.isPending} className="rounded-none">
                  {previewMut.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
                  Prévia → Shopify
                </Button>
                <Button
                  onClick={() => { if (confirm(`Confirmar push de ${preview?.affected.length} preços na Shopify?`)) applyMut.mutate(); }}
                  disabled={!preview || preview.affected.length === 0 || applyMut.isPending}
                  variant="default"
                  className="rounded-none bg-accent hover:bg-accent/90"
                >
                  {applyMut.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Rocket className="h-4 w-4 mr-2" />}
                  Aplicar na Shopify
                </Button>
              </div>
              {preview && (
                <div className="mt-4 pt-4 border-t border-foreground/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <Meta label="Alvo" value={preview.target} />
                  <Meta label="SKUs afetados" value={String(preview.affected.length)} />
                  <Meta label="Sem match" value={String(preview.unmatched.length)} />
                  <Meta label="Δ acumulado" value={BRL.format(preview.totalDelta)} />
                </div>
              )}
            </section>

            {preview?.unmatched.length ? (
              <div className="border-2 border-amber-500/40 bg-amber-500/5 p-4 mb-6 flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                <div className="text-xs">
                  <p className="font-display uppercase mb-1">SKUs sem correspondência na Shopify</p>
                  <ul className="space-y-1 font-mono">
                    {preview.unmatched.map((u, i) => (
                      <li key={i}>• {u.nome} — {u.sku ?? "sem SKU"} — {u.reason}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}

            <div className="border-2 border-foreground/15 bg-card overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-foreground/15 text-[10px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="text-left px-3 py-3">Tempero</th>
                    <th className="text-left px-3 py-3">SKU</th>
                    <th className="text-right px-3 py-3">Custo total</th>
                    <th className="text-right px-3 py-3">Preço calculado</th>
                    <th className="text-right px-3 py-3">Preço Shopify</th>
                    <th className="text-right px-3 py-3">Δ</th>
                    <th className="text-right px-3 py-3">Margem</th>
                  </tr>
                </thead>
                <tbody>
                  {data.temperos.map((t) => {
                    const c = calcularTempero(t, data.variaveis);
                    const newPrice = target === "cliente" ? c.precoCliente : c.precoAtacado;
                    const shopifyRow = preview?.affected.find((a) => a.sku === t.sku);
                    const delta = shopifyRow ? shopifyRow.delta : null;
                    return (
                      <tr key={t.id} className="border-b border-foreground/10 last:border-b-0">
                        <td className="px-3 py-3">{t.nome}</td>
                        <td className="px-3 py-3 font-mono text-xs">{t.sku ?? <span className="text-destructive">—</span>}</td>
                        <td className="px-3 py-3 text-right">{BRL.format(c.custoTotal)}</td>
                        <td className="px-3 py-3 text-right font-medium">{BRL.format(newPrice)}</td>
                        <td className="px-3 py-3 text-right text-muted-foreground">
                          {shopifyRow ? BRL.format(shopifyRow.previousPrice) : "—"}
                        </td>
                        <td className={"px-3 py-3 text-right " + (delta == null ? "text-muted-foreground" : delta > 0 ? "text-accent" : delta < 0 ? "text-destructive" : "")}>
                          {delta == null ? "—" : (delta > 0 ? "+" : "") + BRL.format(delta)}
                        </td>
                        <td className="px-3 py-3 text-right">
                          {(target === "cliente" ? c.margemClientePct : c.margemAtacadoPct).toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="font-display text-lg">{value}</p>
    </div>
  );
}

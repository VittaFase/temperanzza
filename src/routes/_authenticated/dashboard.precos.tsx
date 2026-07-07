import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  getPricingSnapshot, previewPriceChanges, applyPricingRule,
  upsertProductCost, upsertPricingRule, getPricingHistory, revertPriceHistory,
} from "@/lib/pricing.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft, Plus, Play, Undo2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/precos")({
  head: () => ({
    meta: [
      { title: "Preços & Markup — Temperanzza Dashboard" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: PrecosPage,
  errorComponent: ({ error }) => <div className="p-8 text-destructive">Erro: {error.message}</div>,
  notFoundComponent: () => <div className="p-8">Página não encontrada.</div>,
});

type Sublinha = "core" | "premium" | "temperaflix" | "custom";

function PrecosPage() {
  const qc = useQueryClient();
  const snapFn = useServerFn(getPricingSnapshot);
  const histFn = useServerFn(getPricingHistory);
  const previewFn = useServerFn(previewPriceChanges);
  const applyFn = useServerFn(applyPricingRule);

  const snap = useQuery({ queryKey: ["pricing-snapshot"], queryFn: () => snapFn() });
  const history = useQuery({ queryKey: ["pricing-history"], queryFn: () => histFn() });

  const [previewData, setPreviewData] = useState<null | Awaited<ReturnType<typeof previewPriceChanges>>>(null);
  const [previewRuleId, setPreviewRuleId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-foreground/15 bg-card">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl uppercase tracking-wide">Preços & Markup</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Cérebro estratégico → Shopify
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-none">
            <Link to="/dashboard"><ArrowLeft className="h-4 w-4 mr-2" />Voltar</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-10">
        {snap.isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : snap.error ? (
          <p className="text-destructive">{(snap.error as Error).message}</p>
        ) : (
          <>
            <RulesSection
              rules={snap.data?.rules ?? []}
              onSaved={() => qc.invalidateQueries({ queryKey: ["pricing-snapshot"] })}
              onPreview={async (id) => {
                try {
                  const p = await previewFn({ data: { ruleId: id } });
                  setPreviewData(p); setPreviewRuleId(id);
                } catch (e) { toast.error((e as Error).message); }
              }}
            />

            <VariantsSection
              variants={snap.data?.variants ?? []}
              onSaved={() => qc.invalidateQueries({ queryKey: ["pricing-snapshot"] })}
            />

            <HistorySection
              history={history.data ?? []}
              onReverted={() => {
                qc.invalidateQueries({ queryKey: ["pricing-history"] });
                qc.invalidateQueries({ queryKey: ["pricing-snapshot"] });
              }}
            />
          </>
        )}
      </main>

      {previewData && previewRuleId && (
        <PreviewModal
          data={previewData}
          onClose={() => { setPreviewData(null); setPreviewRuleId(null); }}
          onConfirm={async () => {
            try {
              const res = await applyFn({ data: { ruleId: previewRuleId } });
              toast.success(`Aplicado em ${res.applied} SKUs`);
              setPreviewData(null); setPreviewRuleId(null);
              qc.invalidateQueries({ queryKey: ["pricing-snapshot"] });
              qc.invalidateQueries({ queryKey: ["pricing-history"] });
            } catch (e) { toast.error((e as Error).message); }
          }}
        />
      )}
    </div>
  );
}

function RulesSection({ rules, onSaved, onPreview }: {
  rules: any[]; onSaved: () => void; onPreview: (id: string) => void;
}) {
  const save = useServerFn(upsertPricingRule);
  const [name, setName] = useState(""); const [sublinha, setSublinha] = useState<Sublinha>("core");
  const [mult, setMult] = useState("2.5");

  return (
    <section>
      <h2 className="font-display text-2xl uppercase tracking-wide">Regras de markup</h2>
      <p className="text-sm text-muted-foreground mt-1">
        Cada regra multiplica o custo unitário para gerar o preço final da sublinha.
      </p>

      <div className="mt-4 border-2 border-foreground/15 bg-card">
        <div className="p-4 grid grid-cols-1 md:grid-cols-5 gap-3 border-b border-foreground/10">
          <Input placeholder="Nome (ex: Core Q1 2026)" value={name} onChange={(e) => setName(e.target.value)} />
          <select
            className="border border-input bg-background h-10 px-3 text-sm"
            value={sublinha}
            onChange={(e) => setSublinha(e.target.value as Sublinha)}
          >
            <option value="core">Core</option>
            <option value="premium">Premium Black</option>
            <option value="temperaflix">Temperaflix</option>
            <option value="custom">Todos os SKUs</option>
          </select>
          <Input type="number" step="0.01" placeholder="Multiplicador (2.5)" value={mult} onChange={(e) => setMult(e.target.value)} />
          <Button
            className="rounded-none md:col-span-2"
            onClick={async () => {
              if (!name || !mult) return toast.error("Preencha nome e multiplicador");
              try {
                await save({ data: { name, sublinha, markupMultiplier: Number(mult) } });
                toast.success("Regra salva"); setName(""); setMult("2.5"); onSaved();
              } catch (e) { toast.error((e as Error).message); }
            }}
          ><Plus className="h-4 w-4 mr-2" />Salvar regra</Button>
        </div>

        {rules.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">Nenhuma regra ativa.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-foreground/10 text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3">Nome</th>
                <th className="text-left px-4 py-3">Sublinha</th>
                <th className="text-right px-4 py-3">Multiplicador</th>
                <th className="text-right px-4 py-3">Ação</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((r) => (
                <tr key={r.id} className="border-b border-foreground/5 last:border-b-0">
                  <td className="px-4 py-3">{r.name}</td>
                  <td className="px-4 py-3 uppercase text-xs">{r.sublinha}</td>
                  <td className="px-4 py-3 text-right font-mono">{Number(r.markup_multiplier).toFixed(3)}×</td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="outline" className="rounded-none" onClick={() => onPreview(r.id)}>
                      <Play className="h-3 w-3 mr-2" />Preview
                    </Button>
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

function VariantsSection({ variants, onSaved }: { variants: any[]; onSaved: () => void }) {
  const save = useServerFn(upsertProductCost);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <section>
      <h2 className="font-display text-2xl uppercase tracking-wide">Custos por SKU</h2>
      <p className="text-sm text-muted-foreground mt-1">
        Informe o custo unitário. A margem é calculada automaticamente sobre o preço atual da Shopify.
      </p>

      <div className="mt-4 border-2 border-foreground/15 bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-foreground/10 text-[10px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Produto</th>
              <th className="text-left px-4 py-3">SKU</th>
              <th className="text-left px-4 py-3">Sublinha</th>
              <th className="text-right px-4 py-3">Preço Shopify</th>
              <th className="text-right px-4 py-3">Custo</th>
              <th className="text-right px-4 py-3">Margem</th>
              <th className="text-right px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {variants.map((v) => (
              <tr key={v.variantId} className="border-b border-foreground/5 last:border-b-0">
                <td className="px-4 py-3">{v.productTitle}</td>
                <td className="px-4 py-3 font-mono text-xs">{v.sku}</td>
                <td className="px-4 py-3 uppercase text-xs">{v.sublinha}</td>
                <td className="px-4 py-3 text-right font-mono">{money.format(v.price)}</td>
                <td className="px-4 py-3 text-right">
                  <Input
                    className="h-8 w-24 ml-auto text-right"
                    placeholder={v.cost != null ? String(v.cost) : "—"}
                    value={edits[v.sku] ?? ""}
                    onChange={(e) => setEdits({ ...edits, [v.sku]: e.target.value })}
                  />
                </td>
                <td className="px-4 py-3 text-right font-mono">
                  {v.marginPct != null ? `${v.marginPct.toFixed(1)}%` : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    size="sm" variant="outline" className="rounded-none"
                    disabled={!edits[v.sku]}
                    onClick={async () => {
                      try {
                        await save({ data: { sku: v.sku, unitCost: Number(edits[v.sku]) } });
                        toast.success(`Custo de ${v.sku} salvo`);
                        setEdits({ ...edits, [v.sku]: "" }); onSaved();
                      } catch (e) { toast.error((e as Error).message); }
                    }}
                  >Salvar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function HistorySection({ history, onReverted }: { history: any[]; onReverted: () => void }) {
  const revert = useServerFn(revertPriceHistory);
  const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <section>
      <h2 className="font-display text-2xl uppercase tracking-wide">Histórico</h2>
      <div className="mt-4 border-2 border-foreground/15 bg-card overflow-x-auto">
        {history.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">Nenhuma alteração aplicada ainda.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-foreground/10 text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3">Quando</th>
                <th className="text-left px-4 py-3">SKU</th>
                <th className="text-right px-4 py-3">De</th>
                <th className="text-right px-4 py-3">Para</th>
                <th className="text-left px-4 py-3">Motivo</th>
                <th className="text-right px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id} className="border-b border-foreground/5 last:border-b-0">
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {new Date(h.applied_at).toLocaleString("pt-BR")}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{h.sku}</td>
                  <td className="px-4 py-3 text-right font-mono">
                    {h.previous_price != null ? money.format(Number(h.previous_price)) : "—"}
                  </td>
                  <td className="px-4 py-3 text-right font-mono">{money.format(Number(h.new_price))}</td>
                  <td className="px-4 py-3 text-xs">{h.reason ?? "—"}</td>
                  <td className="px-4 py-3 text-right">
                    {h.reverted ? (
                      <span className="text-xs text-muted-foreground uppercase">Revertido</span>
                    ) : (
                      <Button
                        size="sm" variant="outline" className="rounded-none"
                        onClick={async () => {
                          try { await revert({ data: { historyId: h.id } }); toast.success("Revertido"); onReverted(); }
                          catch (e) { toast.error((e as Error).message); }
                        }}
                      ><Undo2 className="h-3 w-3 mr-2" />Reverter</Button>
                    )}
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

function PreviewModal({ data, onClose, onConfirm }: {
  data: Awaited<ReturnType<typeof previewPriceChanges>>;
  onClose: () => void; onConfirm: () => void;
}) {
  const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-card border-2 border-foreground/20 max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-foreground/10">
          <h3 className="font-display text-2xl uppercase">Preview de aplicação</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {data.affectedCount} SKUs serão atualizados na Shopify. Delta total:{" "}
            <strong className={data.totalDelta >= 0 ? "text-emerald-600" : "text-destructive"}>
              {data.totalDelta >= 0 ? "+" : ""}{money.format(data.totalDelta)}
            </strong>
          </p>
        </div>
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-sm">
            <thead className="border-b border-foreground/10 text-[10px] uppercase tracking-wider text-muted-foreground sticky top-0 bg-card">
              <tr>
                <th className="text-left px-4 py-3">SKU</th>
                <th className="text-left px-4 py-3">Produto</th>
                <th className="text-right px-4 py-3">De</th>
                <th className="text-right px-4 py-3">Para</th>
                <th className="text-right px-4 py-3">Δ</th>
                <th className="text-right px-4 py-3">Margem</th>
              </tr>
            </thead>
            <tbody>
              {data.affected.map((a) => (
                <tr key={a.variantId} className="border-b border-foreground/5">
                  <td className="px-4 py-2 font-mono text-xs">{a.sku}</td>
                  <td className="px-4 py-2">{a.productTitle}</td>
                  <td className="px-4 py-2 text-right font-mono">{money.format(a.previousPrice)}</td>
                  <td className="px-4 py-2 text-right font-mono">{money.format(a.newPrice)}</td>
                  <td className={`px-4 py-2 text-right font-mono ${a.delta >= 0 ? "text-emerald-600" : "text-destructive"}`}>
                    {a.delta >= 0 ? "+" : ""}{money.format(a.delta)}
                  </td>
                  <td className="px-4 py-2 text-right font-mono">
                    {a.newMarginPct != null ? `${a.newMarginPct.toFixed(1)}%` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-foreground/10 flex justify-end gap-2">
          <Button variant="outline" className="rounded-none" onClick={onClose}>Cancelar</Button>
          <Button className="rounded-none" onClick={onConfirm} disabled={data.affectedCount === 0}>
            Aplicar {data.affectedCount} preços
          </Button>
        </div>
      </div>
    </div>
  );
}

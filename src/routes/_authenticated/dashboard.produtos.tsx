import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import {
  getEngineState, upsertTempero, deleteTempero,
  calcularTempero, autoMatchShopifySkus, type Tempero,
} from "@/lib/dashboardEngine.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, Plus, Save, Trash2, X, Link2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/produtos")({
  head: () => ({
    meta: [
      { title: "Produtos & SKUs — Temperanzza Dashboard" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ProdutosPage,
  errorComponent: ({ error }) => <div className="p-8 text-destructive">Erro: {error.message}</div>,
  notFoundComponent: () => <div className="p-8">Página não encontrada.</div>,
});

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function ProdutosPage() {
  const qc = useQueryClient();
  const fetchEngine = useServerFn(getEngineState);
  const saveFn = useServerFn(upsertTempero);
  const delFn = useServerFn(deleteTempero);
  const matchFn = useServerFn(autoMatchShopifySkus);
  const [matching, setMatching] = useState(false);

  const { data, isLoading, error } = useQuery({ queryKey: ["engine-state"], queryFn: () => fetchEngine() });
  const [editing, setEditing] = useState<Partial<Tempero> | null>(null);

  async function save() {
    if (!editing) return;
    try {
      await saveFn({
        data: {
          id: editing.id, nome: editing.nome ?? "",
          sku: editing.sku ?? null, ean: editing.ean ?? null,
          precoKg: Number(editing.precoKg ?? 0), gramasPote: Number(editing.gramasPote ?? 0),
          estoqueAtual: Number(editing.estoqueAtual ?? 0), estoqueMinimo: Number(editing.estoqueMinimo ?? 0),
          ordem: Number(editing.ordem ?? 0),
          fotoPath: editing.fotoPath ?? null, ativo: editing.ativo ?? true,
          custosFixosOverride: editing.custosFixosOverride ?? null,
        },
      });
      toast.success("Tempero salvo");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["engine-state"] });
    } catch (e) { toast.error((e as Error).message); }
  }

  async function del(id: string) {
    if (!confirm("Remover este tempero do catálogo?")) return;
    try {
      await delFn({ data: { id } });
      toast.success("Removido");
      qc.invalidateQueries({ queryKey: ["engine-state"] });
    } catch (e) { toast.error((e as Error).message); }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-foreground/15 bg-card">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl uppercase tracking-wide">Produtos & SKUs</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Catálogo mestre — 19 temperos, custos e overrides
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="ghost" size="sm"><Link to="/dashboard/simulacao">Simulação</Link></Button>
            <Button asChild variant="ghost" size="sm"><Link to="/dashboard/configuracoes">Variáveis</Link></Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/dashboard"><ArrowLeft className="h-4 w-4 mr-2" /> Voltar</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {isLoading && <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin" /></div>}
        {error && <p className="text-destructive">{error.message}</p>}
        {data && (
          <>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">{data.temperos.length} temperos no catálogo</p>
              <Button
                onClick={() => setEditing({ nome: "", precoKg: 0, gramasPote: 30, ordem: data.temperos.length + 1, ativo: true })}
                className="rounded-none"
              >
                <Plus className="h-4 w-4 mr-2" /> Novo tempero
              </Button>
            </div>

            <div className="border-2 border-foreground/15 bg-card overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-foreground/15 text-[10px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="text-left px-3 py-3">#</th>
                    <th className="text-left px-3 py-3">Nome</th>
                    <th className="text-left px-3 py-3">SKU</th>
                    <th className="text-right px-3 py-3">R$/kg</th>
                    <th className="text-right px-3 py-3">g/pote</th>
                    <th className="text-right px-3 py-3">Custo total</th>
                    <th className="text-right px-3 py-3">Preço Cliente</th>
                    <th className="text-right px-3 py-3">Margem %</th>
                    <th className="text-right px-3 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {data.temperos.map((t) => {
                    const c = calcularTempero(t, data.variaveis);
                    return (
                      <tr key={t.id} className="border-b border-foreground/10 last:border-b-0">
                        <td className="px-3 py-3 font-mono">{t.ordem}</td>
                        <td className="px-3 py-3">{t.nome}</td>
                        <td className="px-3 py-3 font-mono text-xs">{t.sku ?? <span className="text-destructive">—</span>}</td>
                        <td className="px-3 py-3 text-right">{BRL.format(t.precoKg)}</td>
                        <td className="px-3 py-3 text-right">{t.gramasPote}</td>
                        <td className="px-3 py-3 text-right">{BRL.format(c.custoTotal)}</td>
                        <td className="px-3 py-3 text-right font-medium">{BRL.format(c.precoCliente)}</td>
                        <td className="px-3 py-3 text-right">{c.margemClientePct.toFixed(1)}%</td>
                        <td className="px-3 py-3 text-right">
                          <Button size="sm" variant="ghost" onClick={() => setEditing(t)}>Editar</Button>
                          <Button size="sm" variant="ghost" onClick={() => del(t.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
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

      {editing && data && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur flex items-center justify-center p-4 z-50">
          <div className="bg-card border-2 border-foreground/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b border-foreground/15 p-4 flex justify-between items-center">
              <h2 className="font-display uppercase">{editing.id ? "Editar" : "Novo"} tempero</h2>
              <Button variant="ghost" size="sm" onClick={() => setEditing(null)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Nome"><Input value={editing.nome ?? ""} onChange={(e) => setEditing({ ...editing, nome: e.target.value })} className="rounded-none" /></Field>
                <Field label="Ordem"><Input type="number" value={editing.ordem ?? 0} onChange={(e) => setEditing({ ...editing, ordem: Number(e.target.value) })} className="rounded-none" /></Field>
                <Field label="SKU (deve casar com Shopify)"><Input value={editing.sku ?? ""} onChange={(e) => setEditing({ ...editing, sku: e.target.value })} className="rounded-none font-mono" /></Field>
                <Field label="EAN"><Input value={editing.ean ?? ""} onChange={(e) => setEditing({ ...editing, ean: e.target.value })} className="rounded-none font-mono" /></Field>
                <Field label="Preço matéria-prima (R$/kg)"><Input type="number" step="0.01" value={editing.precoKg ?? 0} onChange={(e) => setEditing({ ...editing, precoKg: Number(e.target.value) })} className="rounded-none" /></Field>
                <Field label="Gramas por pote"><Input type="number" step="1" value={editing.gramasPote ?? 0} onChange={(e) => setEditing({ ...editing, gramasPote: Number(e.target.value) })} className="rounded-none" /></Field>
                <Field label="Estoque atual"><Input type="number" value={editing.estoqueAtual ?? 0} onChange={(e) => setEditing({ ...editing, estoqueAtual: Number(e.target.value) })} className="rounded-none" /></Field>
                <Field label="Estoque mínimo"><Input type="number" value={editing.estoqueMinimo ?? 0} onChange={(e) => setEditing({ ...editing, estoqueMinimo: Number(e.target.value) })} className="rounded-none" /></Field>
              </div>
              <PreviewBox tempero={editing} variaveis={data.variaveis} />
            </div>
            <div className="border-t border-foreground/15 p-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditing(null)} className="rounded-none">Cancelar</Button>
              <Button onClick={save} className="rounded-none"><Save className="h-4 w-4 mr-2" />Salvar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function PreviewBox({ tempero, variaveis }: { tempero: Partial<Tempero>; variaveis: any }) {
  const calc = useMemo(() => calcularTempero({
    precoKg: Number(tempero.precoKg ?? 0),
    gramasPote: Number(tempero.gramasPote ?? 0),
    custosFixosOverride: tempero.custosFixosOverride ?? null,
  }, variaveis), [tempero, variaveis]);
  return (
    <div className="border-2 border-accent/30 bg-accent/5 p-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
      <Stat label="Matéria-prima" value={BRL.format(calc.custoMateriaPrima)} />
      <Stat label="Fixos" value={BRL.format(calc.custosFixos)} />
      <Stat label="Custo total" value={BRL.format(calc.custoTotal)} />
      <Stat label="Margem cliente" value={calc.margemClientePct.toFixed(1) + "%"} />
      <Stat label="Preço Atacado" value={BRL.format(calc.precoAtacado)} big />
      <Stat label="Preço Cliente" value={BRL.format(calc.precoCliente)} big />
    </div>
  );
}

function Stat({ label, value, big }: { label: string; value: string; big?: boolean }) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className={big ? "font-display text-lg" : "font-medium"}>{value}</p>
    </div>
  );
}

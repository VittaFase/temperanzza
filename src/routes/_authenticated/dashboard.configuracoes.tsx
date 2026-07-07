import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { getEngineState, updateVariaveis, type Variaveis } from "@/lib/dashboardEngine.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações — Temperanzza Dashboard" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ConfiguracoesPage,
  errorComponent: ({ error }) => <div className="p-8 text-destructive">Erro: {error.message}</div>,
  notFoundComponent: () => <div className="p-8">Página não encontrada.</div>,
});

const FIELDS: Array<{ key: keyof Variaveis; label: string; suffix?: string; group: string }> = [
  { key: "pote", label: "Pote", suffix: "R$", group: "Embalagem (por unidade)" },
  { key: "lacre", label: "Lacre", suffix: "R$", group: "Embalagem (por unidade)" },
  { key: "rotulo", label: "Rótulo", suffix: "R$", group: "Embalagem (por unidade)" },
  { key: "caixa", label: "Caixa", suffix: "R$", group: "Embalagem (por unidade)" },
  { key: "termoencolhivel", label: "Termoencolhível", suffix: "R$", group: "Embalagem (por unidade)" },
  { key: "simplesNacional", label: "Simples Nacional", suffix: "%", group: "Impostos e comissões" },
  { key: "comissao", label: "Comissão", suffix: "%", group: "Impostos e comissões" },
  { key: "transporte", label: "Transporte", suffix: "%", group: "Impostos e comissões" },
  { key: "custoFabril", label: "Custo fabril", suffix: "%", group: "Fabril" },
  { key: "markupAtacado", label: "Markup Atacado", suffix: "×", group: "Markups" },
  { key: "markupCliente", label: "Markup Cliente", suffix: "×", group: "Markups" },
  { key: "contabilidadeMensal", label: "Contabilidade mensal", suffix: "R$", group: "Rateio contábil" },
  { key: "producaoEstimada", label: "Produção estimada (potes/mês)", suffix: "un", group: "Rateio contábil" },
];

function ConfiguracoesPage() {
  const qc = useQueryClient();
  const fetchEngine = useServerFn(getEngineState);
  const saveFn = useServerFn(updateVariaveis);
  const { data, isLoading, error } = useQuery({ queryKey: ["engine-state"], queryFn: () => fetchEngine() });

  const [v, setV] = useState<Variaveis | null>(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (data?.variaveis) setV(data.variaveis); }, [data?.variaveis]);

  async function save() {
    if (!v || !data?.variaveisId) return;
    setSaving(true);
    try {
      await saveFn({ data: { id: data.variaveisId, variaveis: v } });
      toast.success("Variáveis atualizadas — toda estrutura recalculada");
      qc.invalidateQueries({ queryKey: ["engine-state"] });
    } catch (e) {
      toast.error((e as Error).message);
    } finally { setSaving(false); }
  }

  const groups = Array.from(new Set(FIELDS.map((f) => f.group)));

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-foreground/15 bg-card">
        <div className="mx-auto max-w-5xl px-6 h-16 flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl uppercase tracking-wide">Configurações Estratégicas</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Variáveis operacionais → orquestra toda precificação
            </p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/dashboard"><ArrowLeft className="h-4 w-4 mr-2" /> Voltar</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        {isLoading && <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin" /></div>}
        {error && <p className="text-destructive">{error.message}</p>}
        {v && (
          <div className="space-y-8">
            {groups.map((g) => (
              <section key={g} className="border-2 border-foreground/15 bg-card p-6">
                <h2 className="font-display uppercase tracking-wide text-lg mb-4">{g}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {FIELDS.filter((f) => f.group === g).map((f) => (
                    <label key={f.key} className="block">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{f.label}</span>
                      <div className="mt-1 flex items-center gap-2">
                        <Input
                          type="number"
                          step="0.01"
                          value={v[f.key]}
                          onChange={(e) => setV({ ...v, [f.key]: Number(e.target.value) })}
                          className="rounded-none"
                        />
                        {f.suffix && <span className="text-xs text-muted-foreground w-8">{f.suffix}</span>}
                      </div>
                    </label>
                  ))}
                </div>
              </section>
            ))}
            <div className="flex justify-end">
              <Button onClick={save} disabled={saving} className="rounded-none">
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Salvar variáveis
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

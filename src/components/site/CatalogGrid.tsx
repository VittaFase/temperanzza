import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  storefrontApiRequest,
  STOREFRONT_QUERY,
  type ShopifyProduct,
} from "@/lib/shopify";
import { ProductCard } from "./ProductCard";
import { Loader2, Search, X } from "lucide-react";
import { getProductDiet } from "@/lib/dietCompatibility";
import { DIETS, type DietKey } from "@/lib/diets";

type LinhaKey = "todas" | "temperaflix";

const LINHAS: Array<{ key: LinhaKey; label: string; hint: string }> = [
  { key: "todas", label: "Toda a Casa", hint: "19 potes" },
  { key: "temperaflix", label: "Temperaflix", hint: "shakers" },
];

function isTemperaflix(handle: string): boolean {
  return handle.startsWith("temperaflix-");
}

interface CatalogGridProps {
  /** Pré-filtragem via Storefront query (mantém compatibilidade com /produtos) */
  query?: string | null;
  excludeHandles?: string[];
}

export function CatalogGrid({ query = null, excludeHandles }: CatalogGridProps) {
  const [term, setTerm] = useState("");
  const [linha, setLinha] = useState<LinhaKey>("todas");
  const [diet, setDiet] = useState<DietKey | "todas">("todas");

  const { data, isLoading, error } = useQuery({
    queryKey: ["catalog-grid", query, excludeHandles?.join(",") ?? ""],
    queryFn: async () => {
      const res = await storefrontApiRequest(STOREFRONT_QUERY, {
        first: 50,
        query,
      });
      let edges = (res?.data?.products?.edges ?? []) as ShopifyProduct[];
      if (excludeHandles?.length) {
        const ex = new Set(excludeHandles);
        edges = edges.filter((e) => !ex.has(e.node.handle));
      }
      return edges;
    },
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    const t = term.trim().toLowerCase();
    return data.filter((p) => {
      const handle = p.node.handle;
      const title = p.node.title.toLowerCase();
      if (t && !title.includes(t) && !handle.includes(t)) return false;
      if (linha === "temperaflix" && !isTemperaflix(handle)) return false;
      if (diet !== "todas") {
        const pd = getProductDiet(handle);
        const verdict = pd?.verdicts[diet]?.verdict;
        if (verdict === "no" || !verdict) return false;
      }
      return true;
    });
  }, [data, term, linha, diet]);

  const activeFilters =
    (term ? 1 : 0) + (linha !== "todas" ? 1 : 0) + (diet !== "todas" ? 1 : 0);

  const clearAll = () => {
    setTerm("");
    setLinha("todas");
    setDiet("todas");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Não foi possível carregar o catálogo agora.
      </div>
    );
  }

  return (
    <div>
      {/* Barra de controle — busca + filtros */}
      <div className="mb-10 space-y-5">
        {/* Busca */}
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40"
            aria-hidden
          />
          <input
            type="search"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Buscar tempero por nome…"
            aria-label="Buscar tempero pelo nome"
            className="w-full h-12 pl-11 pr-11 bg-background border border-foreground/20 rounded-none font-serif italic text-base placeholder:text-foreground/40 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
          {term && (
            <button
              onClick={() => setTerm("")}
              aria-label="Limpar busca"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-foreground/50 hover:text-accent"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filtros por linha */}
        <div>
          <p className="text-[10px] font-display uppercase tracking-[0.3em] text-foreground/50 mb-2">
            Linha
          </p>
          <div className="flex flex-wrap gap-2">
            {LINHAS.map((l) => {
              const active = linha === l.key;
              return (
                <button
                  key={l.key}
                  onClick={() => setLinha(l.key)}
                  aria-pressed={active}
                  className={`inline-flex items-baseline gap-2 px-3 py-2 border font-display uppercase tracking-wider text-[11px] transition-colors ${
                    active
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-foreground/20 hover:border-foreground hover:bg-foreground hover:text-background"
                  }`}
                >
                  <span className="font-black">{l.label}</span>
                  <span
                    className={`text-[9px] tracking-widest ${
                      active ? "opacity-80" : "text-foreground/50"
                    }`}
                  >
                    {l.hint}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filtros por dieta */}
        <div>
          <p className="text-[10px] font-display uppercase tracking-[0.3em] text-foreground/50 mb-2">
            Compatibilidade dietética
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setDiet("todas")}
              aria-pressed={diet === "todas"}
              className={`px-3 py-2 border font-display uppercase tracking-wider text-[11px] font-black transition-colors ${
                diet === "todas"
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-foreground/20 hover:border-foreground hover:bg-foreground hover:text-background"
              }`}
            >
              Todas
            </button>
            {DIETS.map((d) => {
              const active = diet === d.key;
              return (
                <button
                  key={d.key}
                  onClick={() => setDiet(d.key)}
                  aria-pressed={active}
                  className={`px-3 py-2 border font-display uppercase tracking-wider text-[11px] font-black transition-colors ${
                    active
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-foreground/20 hover:border-foreground hover:bg-foreground hover:text-background"
                  }`}
                >
                  {d.short}
                </button>
              );
            })}
          </div>
        </div>

        {/* Resumo + limpar */}
        {(activeFilters > 0 || data) && (
          <div className="flex items-center justify-between border-t border-foreground/10 pt-4 text-xs">
            <span className="font-display uppercase tracking-widest text-foreground/60">
              {filtered.length}{" "}
              {filtered.length === 1 ? "tempero" : "temperos"}
              {activeFilters > 0 && " no filtro atual"}
            </span>
            {activeFilters > 0 && (
              <button
                onClick={clearAll}
                className="inline-flex items-center gap-1 font-display uppercase tracking-widest text-accent hover:underline underline-offset-4"
              >
                Limpar filtros
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="border-2 border-dashed border-foreground/15 py-16 px-6 text-center">
          <p className="font-display text-xl uppercase tracking-wide">
            Nenhum tempero corresponde ao filtro
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Ajuste a busca ou remova algum filtro para ver mais opções.
          </p>
          {activeFilters > 0 && (
            <button
              onClick={clearAll}
              className="mt-4 inline-flex items-center gap-2 border border-foreground/25 px-4 py-2 font-display uppercase text-xs tracking-widest hover:bg-foreground hover:text-background"
            >
              Limpar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filtered.map((p) => (
            <ProductCard key={p.node.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

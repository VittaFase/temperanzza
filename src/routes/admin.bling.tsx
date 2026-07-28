import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

interface StatusResponse {
  connected: boolean;
  expires_at: string | null;
  scope: string | null;
  updated_at: string | null;
  products_mapped: number;
  orders_processed: number;
  logs: Array<{
    id: string;
    kind: string;
    status: string;
    message: string | null;
    details: Record<string, unknown> | null;
    created_at: string;
  }>;
}

export const Route = createFileRoute("/admin/bling")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    key: typeof s.key === "string" ? s.key : "",
  }),
  head: () => ({
    meta: [
      { title: "Admin — Integração Bling | Temperanzza" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: BlingAdminPage,
});

function BlingAdminPage() {
  const { key } = useSearch({ from: "/admin/bling" });
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [syncResult, setSyncResult] = useState<unknown>(null);

  async function loadStatus() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`/api/public/bling/status?key=${encodeURIComponent(key)}`);
      if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
      setStatus(await res.json());
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (key) void loadStatus();
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  async function runSync() {
    setBusy("sync");
    setSyncResult(null);
    try {
      const res = await fetch(`/api/public/bling/sync?key=${encodeURIComponent(key)}`, {
        method: "POST",
      });
      setSyncResult(await res.json());
      await loadStatus();
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  }

  async function disconnect() {
    if (!confirm("Desconectar do Bling? Vai apagar o token guardado.")) return;
    setBusy("disc");
    try {
      await fetch(`/api/public/bling/disconnect?key=${encodeURIComponent(key)}`, {
        method: "POST",
      });
      await loadStatus();
    } finally {
      setBusy(null);
    }
  }

  if (!key) {
    return (
      <div className="mx-auto max-w-xl p-8 font-sans">
        <h1 className="text-2xl font-bold">Admin — Bling</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Acesso restrito. Adicione <code>?key=SEU_TOKEN</code> na URL.
        </p>
        <p className="mt-2 text-xs">
          O token está guardado como secret <code>BLING_ADMIN_TOKEN</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-8 font-sans">
      <h1 className="mb-6 text-3xl font-bold">Integração Bling</h1>

      {loading && <p>Carregando…</p>}
      {err && (
        <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          Erro: {err}
        </div>
      )}

      {status && (
        <>
          <section className="mb-6 rounded-lg border p-4">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Status</h2>
              <span
                className={
                  status.connected
                    ? "rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
                    : "rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800"
                }
              >
                {status.connected ? "Conectado" : "Desconectado"}
              </span>
            </div>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-muted-foreground">Token expira em</dt>
              <dd>{status.expires_at ? new Date(status.expires_at).toLocaleString("pt-BR") : "—"}</dd>
              <dt className="text-muted-foreground">Produtos mapeados</dt>
              <dd>{status.products_mapped}</dd>
              <dt className="text-muted-foreground">Pedidos processados</dt>
              <dd>{status.orders_processed}</dd>
            </dl>
          </section>

          <section className="mb-6 flex flex-wrap gap-3">
            {!status.connected ? (
              <a
                href={`/api/public/bling/connect?key=${encodeURIComponent(key)}`}
                className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Conectar ao Bling
              </a>
            ) : (
              <>
                <button
                  onClick={runSync}
                  disabled={busy === "sync"}
                  className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  {busy === "sync" ? "Sincronizando…" : "Sincronizar agora (Bling → Shopify)"}
                </button>
                <button
                  onClick={disconnect}
                  disabled={busy === "disc"}
                  className="rounded border border-red-500 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  Desconectar
                </button>
              </>
            )}
          </section>

          {syncResult != null && (
            <section className="mb-6 rounded border bg-gray-50 p-3 text-xs">
              <div className="mb-2 font-semibold">Resultado do último sync</div>
              <pre className="overflow-auto">{JSON.stringify(syncResult, null, 2)}</pre>
            </section>
          )}

          <section>
            <h2 className="mb-2 text-lg font-semibold">Últimos eventos</h2>
            {status.logs.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum evento ainda.</p>
            )}
            <ul className="space-y-2 text-sm">
              {status.logs.map((l) => (
                <li key={l.id} className="rounded border p-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs">{l.kind}</span>
                    <span
                      className={
                        l.status === "success"
                          ? "text-green-700"
                          : l.status === "error"
                            ? "text-red-700"
                            : "text-gray-600"
                      }
                    >
                      {l.status}
                    </span>
                  </div>
                  <div>{l.message}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(l.created_at).toLocaleString("pt-BR")}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}

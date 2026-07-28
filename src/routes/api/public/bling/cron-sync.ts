import { createFileRoute } from "@tanstack/react-router";
import { logSync } from "@/lib/bling/client.server";
import { runBlingToShopifySync } from "@/lib/bling/sync.server";

/**
 * Endpoint chamado pelo agendador (pg_cron) para sincronizar
 * preços e estoque do Bling para o Shopify automaticamente.
 * Autenticado pelo header `apikey` (chave publicável do backend).
 */
export const Route = createFileRoute("/api/public/bling/cron-sync")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = process.env.SUPABASE_PUBLISHABLE_KEY;
        const provided =
          request.headers.get("apikey") ??
          request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

        if (!expected || provided !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }

        try {
          const result = await runBlingToShopifySync();
          await logSync(
            "product_sync",
            "success",
            "Sync automático concluído",
            result as never,
          );
          return Response.json({ ok: true, result });
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          await logSync("product_sync", "error", "Sync automático falhou", {
            error: msg,
          });
          return Response.json({ ok: false, error: msg }, { status: 500 });
        }
      },
    },
  },
});

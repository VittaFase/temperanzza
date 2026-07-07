import { createFileRoute } from "@tanstack/react-router";
import { requireAdminToken, logSync } from "@/lib/bling/client.server";
import { runBlingToShopifySync } from "@/lib/bling/sync.server";

export const Route = createFileRoute("/api/public/bling/sync")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!requireAdminToken(request)) {
          return new Response("Unauthorized", { status: 401 });
        }
        try {
          const result = await runBlingToShopifySync();
          return Response.json({ ok: true, result });
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          await logSync("product_sync", "error", "Sync falhou", { error: msg });
          return Response.json({ ok: false, error: msg }, { status: 500 });
        }
      },
      GET: async ({ request }) => {
        // convenience: allow GET too
        if (!requireAdminToken(request)) {
          return new Response("Unauthorized", { status: 401 });
        }
        try {
          const result = await runBlingToShopifySync();
          return Response.json({ ok: true, result });
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          return Response.json({ ok: false, error: msg }, { status: 500 });
        }
      },
    },
  },
});

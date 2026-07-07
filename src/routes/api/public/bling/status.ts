import { createFileRoute } from "@tanstack/react-router";
import { getServiceClient, requireAdminToken } from "@/lib/bling/client.server";

export const Route = createFileRoute("/api/public/bling/status")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!requireAdminToken(request)) {
          return new Response("Unauthorized", { status: 401 });
        }
        const sb = getServiceClient();
        const { data: tok } = await sb
          .from("bling_tokens")
          .select("expires_at, scope, updated_at")
          .eq("id", true)
          .maybeSingle();
        const { data: logs } = await sb
          .from("bling_sync_log")
          .select("id, kind, status, message, created_at")
          .order("created_at", { ascending: false })
          .limit(30);
        const { count: mapped } = await sb
          .from("bling_product_map")
          .select("*", { count: "exact", head: true });
        const { count: orders } = await sb
          .from("bling_order_map")
          .select("*", { count: "exact", head: true });

        return Response.json({
          connected: !!tok,
          expires_at: tok?.expires_at ?? null,
          scope: tok?.scope ?? null,
          updated_at: tok?.updated_at ?? null,
          products_mapped: mapped ?? 0,
          orders_processed: orders ?? 0,
          logs: logs ?? [],
        });
      },
    },
  },
});

import { createFileRoute } from "@tanstack/react-router";
import { getServiceClient, requireAdminToken, logSync } from "@/lib/bling/client.server";

export const Route = createFileRoute("/api/public/bling/disconnect")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!requireAdminToken(request)) {
          return new Response("Unauthorized", { status: 401 });
        }
        const sb = getServiceClient();
        await sb.from("bling_tokens").delete().eq("id", true);
        await logSync("oauth", "info", "Bling desconectado");
        return Response.json({ ok: true });
      },
    },
  },
});

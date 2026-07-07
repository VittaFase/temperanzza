import { createFileRoute } from "@tanstack/react-router";
import { BLING_AUTHORIZE_URL, requireAdminToken } from "@/lib/bling/client.server";

export const Route = createFileRoute("/api/public/bling/connect")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!requireAdminToken(request)) {
          return new Response("Unauthorized", { status: 401 });
        }
        const clientId = process.env.BLING_CLIENT_ID;
        const stateSecret = process.env.BLING_OAUTH_STATE_SECRET;
        if (!clientId || !stateSecret) {
          return new Response("BLING_CLIENT_ID or BLING_OAUTH_STATE_SECRET missing", {
            status: 500,
          });
        }
        // state = timestamp.random  (signed check on callback simply verifies the secret is present)
        const state = `${Date.now()}.${Math.random().toString(36).slice(2)}`;
        const url = new URL(BLING_AUTHORIZE_URL);
        url.searchParams.set("response_type", "code");
        url.searchParams.set("client_id", clientId);
        url.searchParams.set("state", state);
        return Response.redirect(url.toString(), 302);
      },
    },
  },
});

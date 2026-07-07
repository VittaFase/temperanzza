/**
 * Shopify webhook: orders/create
 *
 * Configure in Shopify Admin → Settings → Notifications → Webhooks:
 *   Event: Order creation
 *   Format: JSON
 *   URL: https://temperanzza.com.br/api/public/shopify/order-webhook
 *
 * Shopify signs the payload with the shared secret it displays after saving
 * the webhook. Copy that value into the SHOPIFY_WEBHOOK_SECRET env var.
 */
import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";
import {
  createBlingOrderFromShopify,
  type ShopifyOrderPayload,
} from "@/lib/bling/orders.server";
import { getServiceClient, logSync } from "@/lib/bling/client.server";

function verifySignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = createHmac("sha256", secret).update(rawBody, "utf8").digest("base64");
  const sig = Buffer.from(signature);
  const exp = Buffer.from(expected);
  if (sig.length !== exp.length) return false;
  return timingSafeEqual(sig, exp);
}

export const Route = createFileRoute("/api/public/shopify/order-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const raw = await request.text();
        const sig = request.headers.get("x-shopify-hmac-sha256");

        if (!verifySignature(raw, sig)) {
          console.warn("[shopify-webhook] invalid signature");
          return new Response("Invalid signature", { status: 401 });
        }

        let order: ShopifyOrderPayload;
        try {
          order = JSON.parse(raw);
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        // Idempotency: skip if already processed
        const sb = getServiceClient();
        const { data: existing } = await sb
          .from("bling_order_map")
          .select("bling_order_id")
          .eq("shopify_order_id", String(order.id))
          .maybeSingle();
        if (existing?.bling_order_id) {
          return Response.json({ ok: true, skipped: "already_processed" });
        }

        try {
          const result = await createBlingOrderFromShopify(order);
          return Response.json({ ok: true, ...result });
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          console.error("[shopify-webhook] error", err);
          await logSync("order_created", "error", `Falha no pedido ${order.name}`, {
            error: msg,
          });
          await sb.from("bling_order_map").upsert({
            shopify_order_id: String(order.id),
            shopify_order_name: order.name,
            nfe_status: "error",
            error_message: msg,
          });
          // Return 200 so Shopify doesn't retry indefinitely if it's a fiscal config problem
          return Response.json({ ok: false, error: msg });
        }
      },
    },
  },
});

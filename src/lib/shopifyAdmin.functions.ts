import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SHOPIFY_DOMAIN = "temperanzza-spice-emporium-dy1i0.myshopify.com";
const API_VERSION = "2024-01";

async function adminGraphQL<T = unknown>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const token = process.env.SHOPIFY_ADMIN_TOKEN;
  if (!token) throw new Error("SHOPIFY_ADMIN_TOKEN não configurado no backend");

  const res = await fetch(`https://${SHOPIFY_DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shopify Admin ${res.status}: ${text.slice(0, 200)}`);
  }

  const json = (await res.json()) as { data?: T; errors?: Array<{ message: string }> };
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join("; "));
  return json.data as T;
}

async function ensureAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Acesso restrito: apenas administradores");
}

/** KPIs consolidados: pedidos 30d, receita 30d, contagem de produtos e clientes. */
export const getShopifyStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context);

    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const query = `
      query Stats($ordersQuery: String!) {
        orders(first: 250, query: $ordersQuery) {
          edges {
            node {
              id
              currentTotalPriceSet { shopMoney { amount currencyCode } }
              displayFinancialStatus
            }
          }
        }
        productsCount { count }
        customersCount { count }
      }
    `;

    type Resp = {
      orders: { edges: Array<{ node: { currentTotalPriceSet: { shopMoney: { amount: string; currencyCode: string } } } }> };
      productsCount: { count: number };
      customersCount: { count: number };
    };

    const data = await adminGraphQL<Resp>(query, {
      ordersQuery: `created_at:>=${since}`,
    });

    let revenue = 0;
    let currency = "BRL";
    for (const edge of data.orders.edges) {
      const m = edge.node.currentTotalPriceSet.shopMoney;
      revenue += Number(m.amount) || 0;
      currency = m.currencyCode || currency;
    }

    return {
      ordersLast30d: data.orders.edges.length,
      revenueLast30d: revenue,
      currency,
      productsCount: data.productsCount.count,
      customersCount: data.customersCount.count,
    };
  });

/** Últimos 10 pedidos com cliente, valor e status. */
export const getRecentOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context);

    const query = `
      query RecentOrders {
        orders(first: 10, reverse: true, sortKey: CREATED_AT) {
          edges {
            node {
              id
              name
              createdAt
              displayFinancialStatus
              displayFulfillmentStatus
              currentTotalPriceSet { shopMoney { amount currencyCode } }
              customer { displayName email }
            }
          }
        }
      }
    `;

    type Resp = {
      orders: {
        edges: Array<{
          node: {
            id: string;
            name: string;
            createdAt: string;
            displayFinancialStatus: string | null;
            displayFulfillmentStatus: string | null;
            currentTotalPriceSet: { shopMoney: { amount: string; currencyCode: string } };
            customer: { displayName: string | null; email: string | null } | null;
          };
        }>;
      };
    };

    const data = await adminGraphQL<Resp>(query);
    return data.orders.edges.map(({ node }) => ({
      id: node.id,
      name: node.name,
      createdAt: node.createdAt,
      financialStatus: node.displayFinancialStatus,
      fulfillmentStatus: node.displayFulfillmentStatus,
      total: Number(node.currentTotalPriceSet.shopMoney.amount) || 0,
      currency: node.currentTotalPriceSet.shopMoney.currencyCode,
      customerName: node.customer?.displayName ?? null,
      customerEmail: node.customer?.email ?? null,
    }));
  });

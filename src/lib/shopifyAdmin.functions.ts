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

/** KPIs consolidados: pedidos 30d, receita 30d, contagem de produtos e clientes.
 *  Cada bloco é isolado — se o token não tiver `read_orders`, produtos/clientes ainda carregam. */
export const getShopifyStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context);

    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // Pedidos (pode falhar por falta de escopo read_orders)
    let ordersLast30d = 0;
    let revenueLast30d = 0;
    let currency = "BRL";
    let ordersError: string | null = null;
    try {
      type OrdersResp = {
        orders: { edges: Array<{ node: { currentTotalPriceSet: { shopMoney: { amount: string; currencyCode: string } } } }> };
      };
      const data = await adminGraphQL<OrdersResp>(
        `query($q: String!) { orders(first: 250, query: $q) { edges { node { currentTotalPriceSet { shopMoney { amount currencyCode } } } } } }`,
        { q: `created_at:>=${since}` },
      );
      ordersLast30d = data.orders.edges.length;
      for (const edge of data.orders.edges) {
        const m = edge.node.currentTotalPriceSet.shopMoney;
        revenueLast30d += Number(m.amount) || 0;
        currency = m.currencyCode || currency;
      }
    } catch (e) {
      ordersError = e instanceof Error ? e.message : String(e);
    }

    // Produtos
    let productsCount = 0;
    let productsError: string | null = null;
    try {
      const data = await adminGraphQL<{ productsCount: { count: number } }>(`{ productsCount { count } }`);
      productsCount = data.productsCount.count;
    } catch (e) {
      productsError = e instanceof Error ? e.message : String(e);
    }

    // Clientes
    let customersCount = 0;
    let customersError: string | null = null;
    try {
      const data = await adminGraphQL<{ customersCount: { count: number } }>(`{ customersCount { count } }`);
      customersCount = data.customersCount.count;
    } catch (e) {
      customersError = e instanceof Error ? e.message : String(e);
    }

    return {
      ordersLast30d,
      revenueLast30d,
      currency,
      productsCount,
      customersCount,
      errors: { orders: ordersError, products: productsError, customers: customersError },
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

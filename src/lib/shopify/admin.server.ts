/**
 * Shopify Admin API (server-only) — used by Bling sync to update
 * product prices and inventory levels.
 */

const SHOP_DOMAIN = "temperanzza-spice-emporium-dy1i0.myshopify.com";
const API_VERSION = "2025-07";
const ADMIN_GRAPHQL_URL = `https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/graphql.json`;

function getOnlineAccessToken(): string | undefined {
  // The connector stores the online token as a JSON blob keyed by user id.
  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith("SHOPIFY_ONLINE_ACCESS_TOKEN:") && value) {
      try {
        const parsed = JSON.parse(value);
        if (parsed.access_token) return parsed.access_token as string;
      } catch {
        // not JSON, ignore
      }
    }
  }
  return undefined;
}

/** All admin tokens configured, in preference order (online first, then offline). */
function adminTokenCandidates(): string[] {
  const list = [
    getOnlineAccessToken(),
    process.env.SHOPIFY_ACCESS_TOKEN,
    process.env.SHOPIFY_ADMIN_TOKEN,
  ].filter((t): t is string => !!t);
  // dedupe, preserving order
  return Array.from(new Set(list));
}

/** Token that last authenticated successfully (per server instance). */
let workingToken: string | undefined;

export class ShopifyAdminAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ShopifyAdminAuthError";
  }
}

async function adminGraphql<T = unknown>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const candidates = adminTokenCandidates();
  if (candidates.length === 0) {
    throw new ShopifyAdminAuthError(
      "Nenhum token admin da Shopify configurado (SHOPIFY_ONLINE_ACCESS_TOKEN, SHOPIFY_ACCESS_TOKEN ou SHOPIFY_ADMIN_TOKEN).",
    );
  }
  const ordered = workingToken
    ? [workingToken, ...candidates.filter((t) => t !== workingToken)]
    : candidates;

  let lastAuthError = "";
  for (const token of ordered) {
    const res = await fetch(ADMIN_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": token,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });
    const text = await res.text();

    if (res.status === 401 || res.status === 403) {
      lastAuthError = `${res.status}: ${text}`;
      if (workingToken === token) workingToken = undefined;
      continue; // try next token
    }
    if (!res.ok) {
      throw new Error(`Shopify admin ${res.status}: ${text}`);
    }
    const json = JSON.parse(text);
    if (json.errors) {
      throw new Error(`Shopify GraphQL errors: ${JSON.stringify(json.errors)}`);
    }
    workingToken = token;
    return json.data as T;
  }

  throw new ShopifyAdminAuthError(
    `Token admin da Shopify inválido ou expirado (${ordered.length} token(s) testado(s)). Último erro — ${lastAuthError}. Reconecte a conta Shopify para renovar o acesso.`,
  );
}


export interface ShopifyVariantBySku {
  variantId: string;
  productId: string;
  inventoryItemId: string;
  price: string;
  sku: string;
  locationId: string | null;
}

/** Look up a variant by SKU. Uses productVariants query. */
export async function findVariantBySku(sku: string): Promise<ShopifyVariantBySku | null> {
  const data = await adminGraphql<{
    productVariants: {
      edges: Array<{
        node: {
          id: string;
          sku: string | null;
          price: string;
          product: { id: string };
          inventoryItem: {
            id: string;
            inventoryLevels: {
              edges: Array<{ node: { location: { id: string } } }>;
            };
          };
        };
      }>;
    };
  }>(
    `query($q: String!) {
      productVariants(first: 5, query: $q) {
        edges { node {
          id sku price
          product { id }
          inventoryItem {
            id
            inventoryLevels(first: 1) { edges { node { location { id } } } }
          }
        } }
      }
    }`,
    { q: `sku:${sku}` },
  );
  const edge = data.productVariants.edges.find((e) => e.node.sku === sku);
  if (!edge) return null;
  const n = edge.node;
  return {
    variantId: n.id,
    productId: n.product.id,
    inventoryItemId: n.inventoryItem.id,
    price: n.price,
    sku: n.sku ?? sku,
    locationId: n.inventoryItem.inventoryLevels.edges[0]?.node.location.id ?? null,
  };
}

/** Update a variant's price using productVariantsBulkUpdate (2025-07). */
export async function updateVariantPrice(
  productId: string,
  variantId: string,
  price: string,
): Promise<void> {
  const data = await adminGraphql<{
    productVariantsBulkUpdate: {
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }>(
    `mutation($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        userErrors { field message }
      }
    }`,
    { productId, variants: [{ id: variantId, price }] },
  );
  const errs = data.productVariantsBulkUpdate.userErrors;
  if (errs.length) throw new Error(`Shopify price update: ${JSON.stringify(errs)}`);
}

/** Set absolute inventory level at a location. */
export async function setInventoryLevel(
  inventoryItemId: string,
  locationId: string,
  quantity: number,
): Promise<void> {
  const data = await adminGraphql<{
    inventorySetQuantities: {
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }>(
    `mutation($input: InventorySetQuantitiesInput!) {
      inventorySetQuantities(input: $input) {
        userErrors { field message }
      }
    }`,
    {
      input: {
        name: "available",
        reason: "correction",
        ignoreCompareQuantity: true,
        quantities: [
          { inventoryItemId, locationId, quantity },
        ],
      },
    },
  );
  const errs = data.inventorySetQuantities.userErrors;
  if (errs.length) throw new Error(`Shopify inventory set: ${JSON.stringify(errs)}`);
}

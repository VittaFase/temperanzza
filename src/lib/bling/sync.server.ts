/**
 * Bling -> Shopify product sync.
 * Pulls products from Bling and updates matching Shopify variants (by SKU).
 */
import { blingFetch, getServiceClient, logSync } from "./client.server";
import {
  findVariantBySku,
  setInventoryLevel,
  updateVariantPrice,
} from "../shopify/admin.server";

interface BlingProduct {
  id: number;
  codigo?: string; // SKU
  nome?: string;
  preco?: number;
  estoque?: {
    saldoVirtualTotal?: number;
    saldoFisicoTotal?: number;
  };
  situacao?: string;
}

interface BlingListResponse {
  data: BlingProduct[];
}

interface BlingSingleResponse {
  data: BlingProduct;
}

async function fetchAllBlingProducts(maxPages = 20): Promise<BlingProduct[]> {
  const collected: BlingProduct[] = [];
  for (let page = 1; page <= maxPages; page++) {
    const res = await blingFetch<BlingListResponse>(
      `/produtos?pagina=${page}&limite=100&criterio=2`, // criterio=2: active
    );
    const items = res?.data ?? [];
    if (!items.length) break;
    collected.push(...items);
    if (items.length < 100) break;
  }
  return collected;
}

export interface SyncResult {
  scanned: number;
  matched: number;
  updated: number;
  skipped: number;
  errors: Array<{ sku: string; error: string }>;
}

export async function runBlingToShopifySync(): Promise<SyncResult> {
  const result: SyncResult = {
    scanned: 0,
    matched: 0,
    updated: 0,
    skipped: 0,
    errors: [],
  };
  const sb = getServiceClient();

  const summaries = await fetchAllBlingProducts();
  result.scanned = summaries.length;

  for (const summary of summaries) {
    const sku = summary.codigo?.trim();
    if (!sku) {
      result.skipped++;
      continue;
    }

    try {
      // Fetch full product detail for accurate stock
      const detail = await blingFetch<BlingSingleResponse>(`/produtos/${summary.id}`);
      const p = detail?.data ?? summary;
      const price = p.preco ?? 0;
      const stock =
        p.estoque?.saldoVirtualTotal ??
        p.estoque?.saldoFisicoTotal ??
        0;

      const variant = await findVariantBySku(sku);
      if (!variant) {
        result.skipped++;
        continue;
      }
      result.matched++;

      // Update price (Shopify wants string)
      if (price > 0) {
        await updateVariantPrice(variant.productId, variant.variantId, price.toFixed(2));
      }
      // Update stock
      if (variant.locationId) {
        await setInventoryLevel(
          variant.inventoryItemId,
          variant.locationId,
          Math.max(0, Math.floor(stock)),
        );
      }

      await sb.from("bling_product_map").upsert({
        sku,
        bling_product_id: String(p.id),
        shopify_variant_id: variant.variantId,
        shopify_inventory_item_id: variant.inventoryItemId,
        last_synced_at: new Date().toISOString(),
        last_price: price,
        last_stock: Math.floor(stock),
      });
      result.updated++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      result.errors.push({ sku, error: msg });
    }
  }

  await logSync(
    "product_sync",
    result.errors.length ? "error" : "success",
    `Sync: ${result.updated}/${result.matched} atualizados (${result.scanned} escaneados, ${result.skipped} pulados, ${result.errors.length} erros)`,
    result,
  );
  return result;
}

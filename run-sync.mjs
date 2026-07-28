import { runBlingToShopifySync } from "./src/lib/bling/sync.server.ts";

try {
  const result = await runBlingToShopifySync();
  console.log(JSON.stringify(result, null, 2));
} catch (err) {
  console.error("Sync failed:", err.message);
  process.exit(1);
}

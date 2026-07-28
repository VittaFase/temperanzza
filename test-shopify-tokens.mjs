const SHOP_DOMAIN = "temperanzza-spice-emporium-dy1i0.myshopify.com";
const API_VERSION = "2025-07";
const ADMIN_GRAPHQL_URL = `https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/graphql.json`;

async function testToken(name, token) {
  if (!token) { console.log(`${name}: MISSING`); return; }
  const res = await fetch(ADMIN_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "X-Shopify-Access-Token": token,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query: "{ shop { name } }" }),
  });
  const text = await res.text();
  console.log(`${name}: HTTP ${res.status}`);
  if (res.ok) {
    try {
      const json = JSON.parse(text);
      console.log(`  shop: ${json.data?.shop?.name ?? "no name"}`);
    } catch { console.log("  parse error"); }
  }
}

await testToken("SHOPIFY_ADMIN_TOKEN", process.env.SHOPIFY_ADMIN_TOKEN);
await testToken("SHOPIFY_ACCESS_TOKEN", process.env.SHOPIFY_ACCESS_TOKEN);
await testToken("SHOPIFY_ONLINE_ACCESS_TOKEN", Object.values(process.env).find(v => v && v.includes("shpat_")));
await testToken("SHOPIFY_STOREFRONT_ACCESS_TOKEN", process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN);

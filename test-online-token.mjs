const SHOP_DOMAIN = "temperanzza-spice-emporium-dy1i0.myshopify.com";
const API_VERSION = "2025-07";
const ADMIN_GRAPHQL_URL = `https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/graphql.json`;

const raw = process.env["SHOPIFY_ONLINE_ACCESS_TOKEN:user:zexCJqJZH8buiE3BtA9rW8fAHDM2"];
if (!raw) { console.log("online token missing"); process.exit(1); }

const parsed = JSON.parse(raw);
const token = parsed.access_token || parsed.token;
console.log("online token present, type:", parsed.token_type, "length:", token?.length);

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
console.log("HTTP", res.status);
console.log(text.slice(0, 200));

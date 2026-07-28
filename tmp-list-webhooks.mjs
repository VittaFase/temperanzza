const raw = process.env["SHOPIFY_ONLINE_ACCESS_TOKEN:user:zexCJqJZH8buiE3BtA9rW8fAHDM2"];
const token = JSON.parse(raw).access_token;
const res = await fetch("https://temperanzza-spice-emporium-dy1i0.myshopify.com/admin/api/2025-07/webhooks.json", {
  headers: { "X-Shopify-Access-Token": token, Accept: "application/json" }
});
const text = await res.text();
console.log("status", res.status);
console.log(text);

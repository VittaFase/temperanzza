import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error("Missing env"); process.exit(1); }

const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const { data, error } = await sb.from("bling_tokens").select("refresh_token, expires_at").eq("id", true).maybeSingle();
if (error) { console.error("DB error", error); process.exit(1); }
if (!data || !data.refresh_token) { console.log("No token"); process.exit(1); }

console.log("expires_at:", data.expires_at);

const id = process.env.BLING_CLIENT_ID;
const secret = process.env.BLING_CLIENT_SECRET;
if (!id || !secret) { console.error("Missing Bling client credentials"); process.exit(1); }

const basic = "Basic " + Buffer.from(`${id}:${secret}`).toString("base64");
const res = await fetch("https://www.bling.com.br/Api/v3/oauth/token", {
  method: "POST",
  headers: {
    Authorization: basic,
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json",
  },
  body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: data.refresh_token }),
});
const text = await res.text();
console.log("refresh status:", res.status);
if (!res.ok) { console.error("refresh failed:", text); process.exit(1); }

const tokens = JSON.parse(text);
const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();
const { error: upsertError } = await sb.from("bling_tokens").upsert({
  id: true,
  access_token: tokens.access_token,
  refresh_token: tokens.refresh_token,
  expires_at: expiresAt,
  scope: tokens.scope ?? null,
});
if (upsertError) { console.error("Upsert error", upsertError); process.exit(1); }
console.log("Bling token refreshed. Expires:", expiresAt);

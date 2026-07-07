/**
 * Bling API v3 client with automatic token refresh.
 * Server-only.
 */
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export const BLING_API_BASE = "https://www.bling.com.br/Api/v3";
export const BLING_AUTHORIZE_URL = `${BLING_API_BASE}/oauth/authorize`;
export const BLING_TOKEN_URL = `${BLING_API_BASE}/oauth/token`;

export function getBlingRedirectUri() {
  // Public callback route
  const base = process.env.PUBLIC_SITE_URL ?? "https://temperanzza.com.br";
  return `${base}/api/public/bling/callback`;
}

export function getServiceClient() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function requireAdminToken(request: Request): boolean {
  const expected = process.env.BLING_ADMIN_TOKEN;
  if (!expected) return false;
  const url = new URL(request.url);
  const queryToken = url.searchParams.get("key");
  const headerToken =
    request.headers.get("x-admin-token") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return queryToken === expected || headerToken === expected;
}

export async function logSync(
  kind: string,
  status: "success" | "error" | "info",
  message: string,
  details?: unknown,
) {
  try {
    const sb = getServiceClient();
    await sb.from("bling_sync_log").insert({
      kind,
      status,
      message,
      details: details ? (details as never) : null,
    });
  } catch (err) {
    console.error("[bling] logSync failed", err);
  }
}

interface BlingTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope?: string;
  token_type: string;
}

function basicAuthHeader() {
  const id = process.env.BLING_CLIENT_ID!;
  const secret = process.env.BLING_CLIENT_SECRET!;
  return "Basic " + Buffer.from(`${id}:${secret}`).toString("base64");
}

export async function exchangeCodeForToken(code: string): Promise<BlingTokenResponse> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
  });
  const res = await fetch(BLING_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: basicAuthHeader(),
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body,
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Bling token exchange failed [${res.status}]: ${text}`);
  }
  return JSON.parse(text);
}

export async function refreshAccessToken(refreshToken: string): Promise<BlingTokenResponse> {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });
  const res = await fetch(BLING_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: basicAuthHeader(),
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body,
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Bling token refresh failed [${res.status}]: ${text}`);
  }
  return JSON.parse(text);
}

export async function saveTokens(tokens: BlingTokenResponse) {
  const sb = getServiceClient();
  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();
  const { error } = await sb.from("bling_tokens").upsert({
    id: true,
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at: expiresAt,
    scope: tokens.scope ?? null,
  });
  if (error) throw error;
}

export async function getValidAccessToken(): Promise<string> {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("bling_tokens")
    .select("access_token, refresh_token, expires_at")
    .eq("id", true)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Bling not connected. Visit /admin/bling to connect.");

  const expires = new Date(data.expires_at).getTime();
  // refresh if within 60s of expiry
  if (expires - Date.now() < 60_000) {
    const fresh = await refreshAccessToken(data.refresh_token);
    await saveTokens(fresh);
    return fresh.access_token;
  }
  return data.access_token;
}

export async function blingFetch<T = unknown>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = await getValidAccessToken();
  const url = path.startsWith("http") ? path : `${BLING_API_BASE}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Bling API ${path} [${res.status}]: ${text}`);
  }
  return text ? (JSON.parse(text) as T) : (null as T);
}

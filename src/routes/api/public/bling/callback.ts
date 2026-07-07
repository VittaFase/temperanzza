import { createFileRoute } from "@tanstack/react-router";
import {
  exchangeCodeForToken,
  logSync,
  saveTokens,
} from "@/lib/bling/client.server";

export const Route = createFileRoute("/api/public/bling/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const code = url.searchParams.get("code");
        const error = url.searchParams.get("error");
        if (error) {
          return htmlResponse(
            `<h1>Erro na autorização do Bling</h1><p>${escapeHtml(error)}</p>`,
            400,
          );
        }
        if (!code) {
          return htmlResponse("<h1>Código ausente</h1>", 400);
        }
        try {
          const tokens = await exchangeCodeForToken(code);
          await saveTokens(tokens);
          await logSync("oauth", "success", "Bling conectado com sucesso");
          return htmlResponse(
            `<!doctype html><meta charset="utf-8"><title>Bling conectado</title>
             <div style="font-family:system-ui;max-width:520px;margin:80px auto;padding:24px;border:1px solid #eee;border-radius:12px;">
             <h1 style="margin:0 0 12px">✅ Bling conectado</h1>
             <p>Access token guardado e será renovado automaticamente.</p>
             <p><a href="/admin/bling?key=${escapeHtml(url.searchParams.get("state") ?? "")}">Voltar ao painel</a></p>
             </div>`,
          );
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          await logSync("oauth", "error", "Falha ao trocar código por token", { error: msg });
          return htmlResponse(
            `<h1>Falha ao conectar Bling</h1><pre>${escapeHtml(msg)}</pre>`,
            500,
          );
        }
      },
    },
  },
});

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}
function htmlResponse(html: string, status = 200) {
  return new Response(html, {
    status,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

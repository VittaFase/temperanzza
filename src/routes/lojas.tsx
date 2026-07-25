import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * /lojas foi substituída pelo Blog Temperanzza.
 * A rota permanece apenas como redirecionamento permanente para preservar
 * o sinal de indexação e evitar 404 em links já publicados.
 */
export const Route = createFileRoute("/lojas")({
  beforeLoad: () => {
    throw redirect({ to: "/blog", statusCode: 301 });
  },
});

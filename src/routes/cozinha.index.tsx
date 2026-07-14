import { createFileRoute } from "@tanstack/react-router";

/**
 * Rota índice de /cozinha.
 * O layout (cozinha.tsx) já renderiza a Biblioteca inteira.
 * Este arquivo existe apenas para que /cozinha seja um match válido
 * quando não há slug — o <Outlet /> do layout renderiza null.
 */
export const Route = createFileRoute("/cozinha/")({
  component: () => null,
});

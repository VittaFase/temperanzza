/**
 * SEO — Componente utilitário para metadados de página.
 * O TanStack Start gerencia isso via head(), mas este componente
 * pode ser usado para injeção de JSON-LD ou metadados específicos.
 */
export function SEO({ title, description }: { title?: string; description?: string }) {
  // O TanStack Start já injeta via head() no index.tsx
  // Este componente pode servir para injetar JSON-LD se necessário.
  return null;
}

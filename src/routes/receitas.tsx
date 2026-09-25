import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/receitas")({
  beforeLoad: () => {
    throw redirect({
      to: "/cozinha",
      search: { refeicao: "", proteina: "", lifestyle: "", autor: "" },
      statusCode: 301,
    });
  },
});
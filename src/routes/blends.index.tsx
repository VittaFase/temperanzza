import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/blends/")({
  beforeLoad: () => { throw redirect({ to: "/sua-caixa", statusCode: 301 }); },
});

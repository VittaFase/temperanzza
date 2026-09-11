import { createFileRoute, redirect, notFound } from "@tanstack/react-router";
export const Route = createFileRoute("/blends/$slug")({
  beforeLoad: ({ params }) => {
    if (params.slug === "chefe") throw redirect({ to: "/sua-caixa/chefe", statusCode: 301 });
    if (["brasil", "churrasco", "essenza", "gourmet", "supremo", "temperaflix"].includes(params.slug))
      throw redirect({ to: "/sua-caixa", statusCode: 301 });
    throw notFound();
  },
});

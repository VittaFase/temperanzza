import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/sua-caixa")({
  component: () => <Outlet />,
});

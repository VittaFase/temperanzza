import { createFileRoute } from "@tanstack/react-router";
import { getRobots } from "@/lib/seo.server";

export const Route = createFileRoute("/robots/txt")({
  loader: async () => {
    const res = await getRobots();
    throw res;
  },
});

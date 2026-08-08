import { createFileRoute } from "@tanstack/react-router";
import { getSitemap } from "@/lib/sitemap.server";

export const Route = createFileRoute("/sitemap.xml")({
  loader: async () => {
    const res = await getSitemap();
    throw res;
  },
});

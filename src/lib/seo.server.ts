import { createServerFn } from "@tanstack/react-start";

export const getRobots = createServerFn({ method: "GET" }).handler(async () => {
  return new Response(
    `User-agent: *
Allow: /
Sitemap: https://temperanzza.com.br/sitemap.xml`,
    {
      headers: {
        "Content-Type": "text/plain",
      },
    }
  );
});

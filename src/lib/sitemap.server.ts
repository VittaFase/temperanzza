import { createServerFn } from "@tanstack/react-start";
import { RECIPES } from "./recipes";
import { BLOG_POSTS } from "./blog";

export const getSitemap = createServerFn({ method: "GET" }).handler(async () => {
  const baseUrl = "https://temperanzza.com.br";
  const staticPages = ["", "/sobre", "/produtos", "/blends", "/cozinha", "/blog", "/privacidade", "/termos", "/trocas-e-devolucoes"];
  
  const recipePages = RECIPES.map((r) => `/cozinha/${r.slug}`);
  const blogPages = BLOG_POSTS.map((p) => `/blog/${p.slug}`);
  // Products are fetched from Shopify, so we'd ideally fetch handles here too.
  // For now, let's include the main ones or a hardcoded list of the 19 if possible.
  // Given the complexity of fetching Shopify products here, we'll start with these.
  
  const allPages = [...staticPages, ...recipePages, ...blogPages];
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (path) => `  <url>
    <loc>${baseUrl}${path}</loc>
    <changefreq>weekly</changefreq>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
});

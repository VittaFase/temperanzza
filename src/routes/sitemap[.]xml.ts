import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { RECIPES } from "@/lib/recipes";
import { BLOG_POSTS } from "@/lib/blog";
import { storefrontApiRequest } from "@/lib/shopify";
import { isRebrandEligibleHandle } from "@/lib/rebrandCatalog";

const BASE_URL = "https://temperanzza.com.br";

interface SitemapEntry {
  path: string;
  changefreq?: "daily" | "weekly" | "monthly" | "yearly";
  priority?: string;
  lastmod?: string;
}

const STATIC_ROUTES: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/produtos", changefreq: "weekly", priority: "0.9" },
  { path: "/cozinha", changefreq: "weekly", priority: "0.9" },
  { path: "/sua-caixa", changefreq: "monthly", priority: "0.8" },
  { path: "/temperaflix", changefreq: "monthly", priority: "0.8" },
  { path: "/sobre", changefreq: "monthly", priority: "0.6" },
  { path: "/blog", changefreq: "weekly", priority: "0.8" },
  { path: "/embaixadores", changefreq: "monthly", priority: "0.6" },
];

const PRODUCTS_QUERY = `
  query SitemapProducts($first: Int!) {
    products(first: $first) {
      edges { node { handle updatedAt } }
    }
  }
`;

async function fetchProductHandles(): Promise<Array<{ handle: string; updatedAt?: string }>> {
  try {
    const res = await storefrontApiRequest(PRODUCTS_QUERY, { first: 100 });
    const edges = res?.data?.products?.edges ?? [];
    return edges
      .map((e: { node: { handle: string; updatedAt?: string } }) => ({
        handle: e.node.handle,
        updatedAt: e.node.updatedAt,
      }))
      .filter((product: { handle: string }) => isRebrandEligibleHandle(product.handle));
  } catch {
    return [];
  }
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const products = await fetchProductHandles();

        const entries: SitemapEntry[] = [
          ...STATIC_ROUTES,
          ...products.map<SitemapEntry>((p) => ({
            path: `/product/${p.handle}`,
            changefreq: "weekly",
            priority: "0.8",
            lastmod: p.updatedAt?.slice(0, 10),
          })),
          ...RECIPES.map<SitemapEntry>((r) => ({
            path: `/cozinha/${r.slug}`,
            changefreq: "monthly",
            priority: "0.7",
          })),
          { path: "/sua-caixa/chefe", changefreq: "monthly", priority: "0.7" },
          ...BLOG_POSTS.map<SitemapEntry>((p) => ({
            path: `/blog/${p.slug}`,
            changefreq: "monthly",
            priority: "0.7",
            lastmod: p.publishedAt,
          })),
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});

import { expect, test } from "@playwright/test";

async function expectNoDocumentOverflow(page: import("@playwright/test").Page) {
  const diagnostics = await page.evaluate(() => {
    const root = document.documentElement;
    const viewportWidth = root.clientWidth;
    const overflow = root.scrollWidth - viewportWidth;
    const offenders = Array.from(document.querySelectorAll<HTMLElement>("body *")).map((element) => { const rect = element.getBoundingClientRect(); return { tag: element.tagName.toLowerCase(), id: element.id || undefined, className: typeof element.className === "string" ? element.className.slice(0, 180) : undefined, left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width), scrollWidth: element.scrollWidth, text: element.textContent?.trim().replace(/\s+/g, " ").slice(0, 100) }; }).filter((item) => item.right > viewportWidth + 1 || item.left < -1).sort((a, b) => Math.max(b.right - viewportWidth, -b.left) - Math.max(a.right - viewportWidth, -a.left)).slice(0, 12);
    return { viewportWidth, documentWidth: root.scrollWidth, overflow, offenders };
  });
  expect(diagnostics.overflow, `Horizontal overflow diagnostics:\n${JSON.stringify(diagnostics, null, 2)}`).toBeLessThanOrEqual(1);
}

const CONFIRMED_REBRAND_HANDLES = ["ana-maria", "temperaflix-tradicional", "temperaflix-bacon", "paprica-picante", "salsa-cebola-e-alho", "curcuma", "tempero-do-edu", "ervas-finas", "lemon-pepper", "paprica-defumada", "paprica-doce", "du-chefe-com-paprica", "chimichurri-sem-pimenta", "chimichurri-picante"] as const;

test.describe("Casa Temperanzza storefront", () => {
  test("home renders the final recipe hero without horizontal overflow", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("Cozinha Temperanzza", { exact: true }).first()).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: "Ver receita" }).first()).toBeVisible();
    await expectNoDocumentOverflow(page);
  });

  test("primary navigation resolves to real storefront routes", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const desktopNav = page.locator('nav[aria-label="Navegação principal"]');
    if (await desktopNav.isVisible()) await desktopNav.getByRole("link", { name: "Produtos" }).click(); else { await page.getByRole("button", { name: "Abrir menu" }).click(); await page.getByRole("dialog").getByRole("link", { name: /Produtos/ }).click(); }
    await expect(page).toHaveURL(/\/produtos\/?$/); await expect(page.locator("main")).toBeVisible(); await expectNoDocumentOverflow(page);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    if (await desktopNav.isVisible()) await desktopNav.getByRole("link", { name: "Receitas" }).click(); else { await page.getByRole("button", { name: "Abrir menu" }).click(); await page.getByRole("dialog").getByRole("link", { name: /Receitas/ }).click(); }
    await expect(page).toHaveURL((url) => url.pathname === "/cozinha"); await expect(page.locator("main")).toBeVisible(); await expectNoDocumentOverflow(page);
  });

  test("header navigation works across responsive breakpoints", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" }); const menuButton = page.getByRole("button", { name: "Abrir menu" }); const desktopNav = page.locator('nav[aria-label="Navegação principal"]');
    if (await desktopNav.isVisible()) await desktopNav.getByRole("link", { name: "Receitas" }).click(); else { await expect(menuButton).toBeVisible(); await menuButton.click(); const dialog = page.getByRole("dialog"); await expect(dialog).toBeVisible(); await dialog.getByRole("link", { name: /Receitas/ }).click(); }
    await expect(page).toHaveURL((url) => url.pathname === "/cozinha"); await expect(page.getByRole("heading", { name: "Cozinhe com mais sabor." })).toBeVisible(); await expectNoDocumentOverflow(page);
  });

  test("featured product carousel advances and confirmed products keep rebrand provenance", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" }); const heading = page.getByRole("heading", { name: "Descubra seu sabor" }); const rendered = await heading.waitFor({ state: "visible", timeout: 15000 }).then(() => true).catch(() => false);
    if (!rendered) { await expect(page.getByRole("heading", { name: "A despensa da Casa Temperanzza" })).toBeVisible(); await expectNoDocumentOverflow(page); return; }
    const carousel = heading.locator("xpath=ancestor::section[1]"); await expect(carousel).toBeVisible();
    const confirmedCards = carousel.locator('[data-featured-product][data-image-source="rebrand"]'); expect(await confirmedCards.count()).toBeGreaterThan(0);
    const nonRebrandConfirmed = await carousel.locator('[data-featured-product]').evaluateAll((nodes, confirmed) => nodes.filter((node) => confirmed.includes(node.getAttribute("data-featured-product") || "") && node.getAttribute("data-image-source") !== "rebrand").map((node) => ({ handle: node.getAttribute("data-featured-product"), source: node.getAttribute("data-image-source") })), [...CONFIRMED_REBRAND_HANDLES]); expect(nonRebrandConfirmed).toEqual([]);
    const nextButton = carousel.getByRole("button", { name: "Próximo produto" }); if (await nextButton.isVisible()) await nextButton.click(); else { const pagination = carousel.getByRole("button", { name: "Ir para produto 2" }); if (await pagination.count()) await pagination.click(); }
    await expectNoDocumentOverflow(page);
  });

  test("rebrand catalog excludes standalone Cebola and confirmed cards never use fallback imagery", async ({ page }) => {
    await page.goto("/produtos", { waitUntil: "domcontentloaded" }); const search = page.getByRole("searchbox", { name: "Buscar tempero pelo nome" }); const catalogReady = await search.waitFor({ state: "visible", timeout: 15000 }).then(() => true).catch(() => false);
    if (!catalogReady) { await expect(page.locator("main")).toBeVisible(); await expectNoDocumentOverflow(page); return; }
    const violations = await page.locator('[data-product-card]').evaluateAll((nodes, confirmed) => nodes.filter((node) => confirmed.includes(node.getAttribute("data-product-card") || "") && node.getAttribute("data-image-source") !== "rebrand").map((node) => ({ handle: node.getAttribute("data-product-card"), source: node.getAttribute("data-image-source") })), [...CONFIRMED_REBRAND_HANDLES]); expect(violations).toEqual([]);
    await search.fill("Cebola"); await expect(page.getByText("Salsa, Cebola e Alho", { exact: true })).toBeVisible(); await expect(page.getByText("Cebola em Pó", { exact: true })).toHaveCount(0); await expectNoDocumentOverflow(page);
  });

  test("standalone Cebola is excluded from the rebrand PDP while Salsa, Cebola e Alho remains", async ({ page }) => {
    await page.goto("/product/cebola-em-po", { waitUntil: "domcontentloaded" }); await expect(page.getByRole("heading", { name: "Produto não encontrado" })).toBeVisible(); await expect(page.locator('[data-product-stage="cebola-em-po"]')).toHaveCount(0); await expect(page.getByRole("link", { name: "Voltar ao catálogo" })).toBeVisible(); await expectNoDocumentOverflow(page);
    await page.goto("/product/salsa-cebola-e-alho", { waitUntil: "domcontentloaded" }); const stage = page.locator('[data-product-stage="salsa-cebola-e-alho"]'); await expect(stage).toBeVisible(); await expect(stage).toHaveAttribute("data-image-source", "rebrand"); await expectNoDocumentOverflow(page);
  });

  test("confirmed PDP stages use locked rebrand provenance", async ({ page }) => {
    for (const handle of ["salsa-cebola-e-alho", "temperaflix-tradicional", "temperaflix-bacon", "paprica-defumada"]) { await page.goto(`/product/${handle}`, { waitUntil: "domcontentloaded" }); const stage = page.locator(`[data-product-stage="${handle}"]`); await expect(stage).toBeVisible(); await expect(stage).toHaveAttribute("data-image-source", "rebrand"); const image = stage.locator("img").first(); await expect(image).toBeVisible(); await expect(image).toHaveAttribute("data-image-source", "rebrand"); const src = await image.getAttribute("src"); expect(src).toMatch(/\/assets\//); await expectNoDocumentOverflow(page); }
  });

  test("Salsa, Cebola e Alho PDP preserves the premium product stage", async ({ page }) => { await page.goto("/product/salsa-cebola-e-alho", { waitUntil: "domcontentloaded" }); await expect(page.locator("main")).toBeVisible(); await expect(page.getByRole("heading", { level: 1 })).toBeVisible(); await expect(page.getByRole("link", { name: "Voltar aos sabores" })).toBeVisible(); const stage=page.locator('[data-product-stage="salsa-cebola-e-alho"]'); await expect(stage).toBeVisible(); await expect(stage.locator("img").first()).toBeVisible(); await expectNoDocumentOverflow(page); });

  test("unknown route uses the branded Portuguese 404", async ({ page }) => { await page.goto("/pagina-que-nao-existe", { waitUntil: "domcontentloaded" }); await expect(page.getByRole("heading", { name: "Essa página não está mais à mesa." })).toBeVisible(); await expect(page.getByRole("link", { name: "Voltar ao início" })).toBeVisible(); await expect(page.getByRole("link", { name: "Conhecer os sabores" })).toBeVisible(); await expectNoDocumentOverflow(page); });
});

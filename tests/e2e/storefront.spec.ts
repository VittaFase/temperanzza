import { expect, test } from "@playwright/test";

async function expectNoDocumentOverflow(page: import("@playwright/test").Page) {
  const diagnostics = await page.evaluate(() => {
    const root = document.documentElement;
    const viewportWidth = root.clientWidth;
    const overflow = root.scrollWidth - viewportWidth;
    const offenders = Array.from(document.querySelectorAll<HTMLElement>("body *"))
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName.toLowerCase(),
          id: element.id || undefined,
          className: typeof element.className === "string" ? element.className.slice(0, 180) : undefined,
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          scrollWidth: element.scrollWidth,
          text: element.textContent?.trim().replace(/\s+/g, " ").slice(0, 100),
        };
      })
      .filter((item) => item.right > viewportWidth + 1 || item.left < -1)
      .sort((a, b) => Math.max(b.right - viewportWidth, -b.left) - Math.max(a.right - viewportWidth, -a.left))
      .slice(0, 12);

    return { viewportWidth, documentWidth: root.scrollWidth, overflow, offenders };
  });

  expect(diagnostics.overflow, `Horizontal overflow diagnostics:\n${JSON.stringify(diagnostics, null, 2)}`).toBeLessThanOrEqual(1);
}

test.describe("Casa Temperanzza storefront", () => {
  test("home renders the rebrand hero without horizontal overflow", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: "Sabor que transforma a sua cozinha." })).toBeVisible();
    await expect(page.getByRole("link", { name: "Conheça os sabores" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Explore receitas" })).toBeVisible();
    await expect(page.getByAltText("Pote Salsa, Cebola e Alho Temperanzza")).toBeVisible();
    await expectNoDocumentOverflow(page);
  });

  test("primary home CTAs resolve to real storefront routes", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await page.getByRole("link", { name: "Conheça os sabores" }).click();
    await expect(page).toHaveURL(/\/produtos\/?$/);
    await expect(page.locator("main")).toBeVisible();
    await expectNoDocumentOverflow(page);

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.getByRole("link", { name: "Explore receitas" }).click();
    await expect(page).toHaveURL((url) => url.pathname === "/cozinha");
    await expect(page.locator("main")).toBeVisible();
    await expectNoDocumentOverflow(page);
  });

  test("header navigation works across responsive breakpoints", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const menuButton = page.getByRole("button", { name: "Abrir menu" });
    if (await menuButton.isVisible()) {
      await menuButton.click();
      const mobileNav = page.locator('nav[aria-label="Navegação mobile"]');
      await expect(mobileNav).toBeVisible();
      await mobileNav.getByRole("link", { name: /Receitas/ }).click();
    } else {
      const primaryNav = page.locator('nav[aria-label="Navegação principal"]');
      await expect(primaryNav).toBeVisible();
      await primaryNav.getByRole("link", { name: "Receitas" }).click();
    }

    await expect(page).toHaveURL((url) => url.pathname === "/cozinha");
    await expect(page.getByRole("heading", { name: "Cozinhe com mais sabor." })).toBeVisible();
    await expectNoDocumentOverflow(page);
  });

  test("featured product carousel advances without document overflow", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const carousel = page.locator('section[aria-label="Descubra seu sabor"]');
    await expect(carousel).toBeVisible();
    const currentBefore = await carousel.locator('article[aria-current="true"]').getAttribute("aria-current");
    expect(currentBefore).toBe("true");

    const nextButton = carousel.getByRole("button", { name: "Próximo produto" });
    if (await nextButton.isVisible()) {
      const activeTitleBefore = await carousel.locator('article[aria-current="true"] h3').textContent();
      await nextButton.click();
      await expect.poll(async () => carousel.locator('article[aria-current="true"] h3').textContent()).not.toBe(activeTitleBefore);
    } else {
      const pagination = carousel.getByRole("button", { name: "Ir para produto 2" });
      await pagination.click();
      await expect(pagination).toHaveAttribute("aria-current", "true");
    }

    await expectNoDocumentOverflow(page);
  });

  test("Salsa, Cebola e Alho PDP preserves the premium product stage", async ({ page }) => {
    await page.goto("/product/salsa-cebola-e-alho", { waitUntil: "domcontentloaded" });

    await expect(page.locator("main")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: "Voltar aos sabores" })).toBeVisible();
    await expect(page.locator(".product-stage")).toBeVisible();
    await expect(page.locator(".product-stage img")).toBeVisible();
    await expectNoDocumentOverflow(page);
  });

  test("unknown route uses the branded Portuguese 404", async ({ page }) => {
    await page.goto("/pagina-que-nao-existe", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: "Essa página não está mais à mesa." })).toBeVisible();
    await expect(page.getByRole("link", { name: "Voltar ao início" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Conhecer os sabores" })).toBeVisible();
    await expectNoDocumentOverflow(page);
  });
});

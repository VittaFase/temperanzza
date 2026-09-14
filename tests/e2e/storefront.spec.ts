import { expect, test } from "@playwright/test";

async function expectNoDocumentOverflow(page: import("@playwright/test").Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
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
    await expect(page).toHaveURL(/\/cozinha\/?$/);
    await expect(page.locator("main")).toBeVisible();
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

import { expect, test } from "@playwright/test";

test("home page renders the landing", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Подготви се за матурата." }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Литература" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Български език" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "@dttdrv" }),
  ).toBeVisible();
  await expect(page.locator("[data-card]")).toHaveCount(await page.locator("[data-card]").count());
  expect(await page.locator("[data-card]").count()).toBeGreaterThanOrEqual(12);
});

test("literature theme filter works", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Любов" }).click();

  await expect(page.locator('[data-section="literature"] [data-card]:not([hidden])')).toHaveCount(3);
});

test("grammar section works", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Български език" }).click();

  await expect(page.locator(".gram-item")).toHaveCount(9);
  await expect(page.locator("[data-filters]")).toBeHidden();
});

test("literature detail page", async ({ page }) => {
  await page.goto("/literatura/vyara/");

  await expect(
    page.getByRole("heading", { name: "Вяра" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Обратно" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Прочети в/ }),
  ).toBeVisible();
});

test("grammar detail page", async ({ page }) => {
  await page.goto("/bulgarski/morfologiya/");

  await expect(
    page.getByRole("heading", { name: "Морфология" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Обратно" }),
  ).toBeVisible();
});

import { expect, test } from "@playwright/test";

test("home page renders the landing", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Подготовка за ДЗИ по БЕЛ" }),
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

  await page.locator('select[data-filter-type="theme"]').selectOption("Любовта");

  await expect(page.locator('[data-section="literature"] [data-card]:not([hidden])')).toHaveCount(3);
});

test("grammar section works", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Български език" }).click();

  const gramItems = page.locator(".gram-item");
  await expect(gramItems).toHaveCount(9);
  await expect(page.locator("[data-filters]")).toBeHidden();
});

test("literature detail page", async ({ page }) => {
  await page.goto("/literatura/vyara/");

  await expect(page.locator(".lit-hero-title")).toBeVisible();
  await expect(page.locator(".float-back")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Прочети в Читанка ↗" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Заглавие, въпрос, жанр" }),
  ).toBeVisible();
});

test("grammar detail page", async ({ page }) => {
  await page.goto("/bulgarski/morfologiya/");

  await expect(page.locator(".gram-main-title")).toBeVisible();
  await expect(page.locator(".float-back")).toBeVisible();
  await expect(page.locator(".gram-toc")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Тест върху раздела" }),
  ).toBeVisible();
});

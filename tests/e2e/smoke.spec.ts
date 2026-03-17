import { expect, test } from "@playwright/test";

test("home page renders the main study entry points", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "Подреди материала. Намери правилния текст. Влез по-спокоен в изпита.",
    }),
  ).toBeVisible();
  await expect(
    page.getByPlaceholder("Например: Вапцаров, любов, запетая"),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Отвори литературата" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Отвори българския език" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "създадено от @dttdrv" })).toBeVisible();
});

test("literature catalog filters down to a single visible work", async ({ page }) => {
  await page.goto("/literatura/");

  await page
    .getByPlaceholder("Например: Вапцаров, любов, избор")
    .fill("Вапцаров");

  await expect(page.locator("[data-summary]")).toHaveText("1 произведение");
  await expect(page.locator("[data-card]:not([hidden])")).toHaveCount(1);
  await expect(page.locator("[data-card]:not([hidden]) [data-card-title]")).toHaveText("Вяра");
});

test("grammar catalog filters down to a single visible module", async ({ page }) => {
  await page.goto("/bulgarski/");

  await page
    .getByRole("searchbox", { name: "Търси по правило, термин или ключова дума" })
    .fill("запетая");

  await expect(page.locator("[data-summary]")).toHaveText("1 модул");
  await expect(page.locator("[data-card]:not([hidden])")).toHaveCount(1);
  await expect(page.locator("[data-card]:not([hidden]) [data-card-title]")).toHaveText("Синтаксис");
});

test("literature detail page exposes the external reading link", async ({ page }) => {
  await page.goto("/literatura/vyara/");

  await expect(page.getByRole("heading", { name: "Вяра" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Чети произведението в Читанка/ }).first(),
  ).toBeVisible();
});

const { test, expect } = require("@playwright/test");

test("home page has correct title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("MemeBro");
});

test("home page shows the brand name", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".home-topbar__brand")).toBeVisible();
});

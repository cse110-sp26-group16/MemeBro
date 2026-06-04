const { test, expect } = require("@playwright/test");

test.describe("Library gallery", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
  });

  test("library home renders the browse grid with at least one template card", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    const grid = page.locator(".home-template-grid");
    await expect(grid).toBeVisible();

    const cards = grid.locator(".home-template-card");
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test("library home exposes a Search tab in the bottom nav", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    const searchTab = page.locator(".home-bottom-nav__item", {
      hasText: "Search",
    });
    await expect(searchTab).toBeVisible();
  });
});

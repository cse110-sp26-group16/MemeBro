const { test, expect } = require("@playwright/test");

test("home page has correct title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("MemeBro");
});

test("home page shows the brand name", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/");
  await expect(page.locator(".home-topbar__brand")).toBeVisible();
});

test("home page renders persisted recent templates", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "memebro:recent-templates",
      JSON.stringify([
        {
          id: "recent-a",
          name: "Recent A",
          imageUrl: "https://example.com/recent-a.jpg",
          width: 500,
          height: 500,
        },
        {
          id: "recent-b",
          name: "Recent B",
          imageUrl: "https://example.com/recent-b.jpg",
          width: 500,
          height: 500,
        },
      ])
    );
  });

  await page.goto("/");

  await expect(page.locator(".home-recent")).toBeVisible();
  await expect(page.locator("[data-recent-count]")).toHaveText("2");
  await expect(page.locator("#recent-template-strip .home-thumb")).toHaveCount(2);
  await expect(page.locator("#recent-template-strip .home-thumb").first()).toHaveText("Recent A");
  await expect(
    page.locator('#recent-template-strip a[href="pages/editor.html?templateId=recent-a"]')
  ).toBeVisible();
});

const { test, expect } = require("@playwright/test");

// A 1x1 PNG as a data URI. Using it as the template image keeps the editor's
// html2canvas export fully offline and CORS-clean, so the whole spec runs with
// zero real network calls (an acceptance criterion of #66).
const PIXEL_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

// One template shared by both mocks. The search result links to
// editor.html?templateId=<id>, and the editor independently resolves that id
// against the imgflip list, so the two mocks must agree on the id.
const TEMPLATE = {
  id: "100",
  name: "Test Template",
  width: 600,
  height: 600,
};

test.describe("Quick flow: Library to Search to Editor to download", () => {
  test.beforeEach(async ({ page }) => {
    // Mock ImgFlip get_memes (powers the home gallery and the editor's
    // resolveTemplate). Shape matches js/api/imgflip-api.js getMemes().
    await page.route("**/api.imgflip.com/get_memes**", (route) =>
      route.fulfill({
        json: {
          success: true,
          data: {
            memes: [
              {
                id: TEMPLATE.id,
                name: TEMPLATE.name,
                url: PIXEL_PNG,
                width: TEMPLATE.width,
                height: TEMPLATE.height,
              },
            ],
          },
        },
      })
    );

    // Mock the AI search endpoint. Shape is { results: RankedTemplate[] } per
    // docs/interface-contract.md, with the same id as the imgflip mock.
    // Match the endpoint precisely (a "?" right after "search") so this does NOT
    // also intercept the component's own source file, js/api/search-api.js.
    await page.route(/\/api\/search(\?|$)/, (route) =>
      route.fulfill({
        json: {
          results: [
            {
              id: TEMPLATE.id,
              name: TEMPLATE.name,
              imageUrl: PIXEL_PNG,
              width: TEMPLATE.width,
              height: TEMPLATE.height,
              score: 0.99,
              reason: "Exact title match",
            },
          ],
        },
      })
    );

    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
  });

  test("user searches a template, captions it, and downloads a PNG", async ({ page }) => {
    // 1. Library home renders the browse grid with at least one template card.
    const cards = page.locator("memebro-template-gallery .template-card");
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThan(0);

    // 2. Navigate to the Search screen via the bottom tab bar.
    await page.locator(".home-bottom-nav__item", { hasText: "Search" }).click();
    await page.waitForURL((url) => url.pathname.endsWith("/pages/search.html"));

    // 3. Type a query; the mocked /api/search drives the results.
    await page.locator("#search-input").fill("Test");
    const results = page.locator(".result-card");
    await expect(results.first()).toBeVisible();
    expect(await results.count()).toBeGreaterThan(0);

    // 4. Click a result; the URL becomes pages/editor.html?templateId=<id>.
    await results.first().click();
    await page.waitForURL(
      (url) =>
        url.pathname.endsWith("/pages/editor.html") &&
        url.searchParams.get("templateId") === TEMPLATE.id
    );

    // 5. Type a top caption; the rendered overlay updates in real time.
    await page.locator('.input-panels-input[data-panel-index="0"]').fill("HELLO WORLD");
    await expect(page.locator('.meme-canvas-caption[data-caption-index="0"]')).toHaveText(
      "HELLO WORLD"
    );

    // 6. Download the meme and assert the slice completes.
    //    The editor fires `memebro:meme-downloaded` { meme, format: "png" } with
    //    bubbles + composed: true, so it escapes the shadow root to `document`.
    //    Install the listener BEFORE clicking Download, then assert the contract
    //    shape. Capturing meme.templateId confirms the template we searched for
    //    and selected flowed all the way through to the exported meme.
    await page.evaluate(() => {
      window.__memeDownloaded = null;
      document.addEventListener("memebro:meme-downloaded", (event) => {
        window.__memeDownloaded = {
          format: event.detail.format,
          templateId: event.detail.meme?.templateId ?? null,
        };
      });
    });

    await page.locator(".download-button").click();

    // html2canvas rasterization is async and not instant in headless CI.
    await expect
      .poll(() => page.evaluate(() => window.__memeDownloaded), {
        timeout: 15000,
      })
      .toEqual({ format: "png", templateId: TEMPLATE.id });
  });
});

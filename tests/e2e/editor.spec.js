const { test, expect } = require("@playwright/test");

const EDITOR_URL = "/pages/editor.html?templateId=181913649";

test("editor page loads with template image and download button", async ({ page }) => {
  await page.goto(EDITOR_URL);

  const editor = page.locator("memebro-editor");

  await expect(editor).toBeVisible();
  await expect(editor.locator(".meme-canvas-img")).toBeVisible();
  await expect(editor.locator(".download-button")).toBeVisible();
});

test("editor updates top and bottom captions", async ({ page }) => {
  await page.goto(EDITOR_URL);

  const editor = page.locator("memebro-editor");

  const topInput = editor.locator('input[aria-label="Top caption"]');
  const bottomInput = editor.locator('input[aria-label="Bottom caption"]');

  await topInput.fill("HELLO");
  await bottomInput.fill("MEMEBRO");

  await expect(topInput).toHaveValue("HELLO");
  await expect(bottomInput).toHaveValue("MEMEBRO");

  await expect(editor.locator('[data-caption-index="0"]')).toContainText("HELLO");
  await expect(editor.locator('[data-caption-index="1"]')).toContainText("MEMEBRO");
});

test("editor switches caption style", async ({ page }) => {
  await page.goto(EDITOR_URL);

  const editor = page.locator("memebro-editor");

  const glitchChip = editor.locator('button[data-style="glitch"]');
  await glitchChip.click();

  await expect(glitchChip).toHaveAttribute("aria-pressed", "true");
  await expect(editor.locator('[data-caption-index="0"]')).toHaveClass(/caption-style--glitch/);
  await expect(editor.locator('[data-caption-index="1"]')).toHaveClass(/caption-style--glitch/);
});

test("editor download button dispatches meme downloaded event", async ({ page }) => {
  await page.goto(EDITOR_URL);

  await page.evaluate(() => {
    window.__memeDownloaded = false;
    document.addEventListener("memebro:meme-downloaded", () => {
      window.__memeDownloaded = true;
    });
  });

  const editor = page.locator("memebro-editor");

  await editor.locator('input[aria-label="Top caption"]').fill("DOWNLOAD");
  await editor.locator('input[aria-label="Bottom caption"]').fill("TEST");

  await editor.locator(".download-button").click();

  await expect
    .poll(() => page.evaluate(() => window.__memeDownloaded), {
      timeout: 10000,
    })
    .toBe(true);
});

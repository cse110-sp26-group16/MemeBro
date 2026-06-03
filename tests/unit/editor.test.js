import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// html2canvas can't rasterize in jsdom (no layout/canvas engine), so we mock the
// vendored module and assert the download *contract* rather than pixel output.
vi.mock("../../js/vendor/html2canvas.esm.js", () => ({
  default: vi.fn(async () => ({
    toBlob: (callback) => callback(new Blob(["fake-png-bytes"], { type: "image/png" })),
  })),
}));

// Editor resolves its template from the popular list on mount; pin it to a fixture.
vi.mock("../../js/api/imgflip-api.js", () => ({
  getPopularTemplates: vi.fn(async () => [
    {
      id: "test-id",
      name: "Test template",
      imageUrl: "https://i.imgflip.com/test.jpg",
      width: 500,
      height: 500,
    },
  ]),
}));

import html2canvas from "../../js/vendor/html2canvas.esm.js";
import "../../js/components/editor.js";

/**
 * Mounts a fresh editor and waits for its async connectedCallback to render.
 * @returns {Promise<HTMLElement>} The connected memebro-editor element.
 */
async function mountEditor() {
  const editor = document.createElement("memebro-editor");
  document.body.appendChild(editor);
  await vi.waitFor(() => {
    if (!editor.shadowRoot.querySelector(".meme-canvas-img")) {
      throw new Error("editor not rendered yet");
    }
  });
  return editor;
}

describe("Memebro editor screen", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    window.history.replaceState({}, "", "/editor.html?templateId=test-id");
    // jsdom doesn't implement these; the download path needs them.
    URL.createObjectURL = vi.fn(() => "blob:fake");
    URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("mounts and renders the resolved template image", async () => {
    const editor = await mountEditor();
    const img = editor.shadowRoot.querySelector(".meme-canvas-img");
    expect(img).not.toBeNull();
    expect(img.getAttribute("src")).toContain("test.jpg");
  });

  it("binds the top caption input to the overlay text", async () => {
    const editor = await mountEditor();
    const input = editor.shadowRoot.querySelector('.input-panels-input[data-panel-index="0"]');
    input.value = "when the code compiles";
    input.dispatchEvent(new Event("input", { bubbles: true }));

    const overlay = editor.shadowRoot.querySelector('.meme-canvas-caption[data-caption-index="0"]');
    expect(overlay.textContent).toBe("when the code compiles");
  });

  it("fires memebro:meme-downloaded with the meme and format on download", async () => {
    const editor = await mountEditor();

    const downloadButton = editor.shadowRoot.querySelector(".download-button");
    expect(downloadButton).not.toBeNull();

    const downloaded = new Promise((resolve) => {
      document.addEventListener("memebro:meme-downloaded", (event) => resolve(event), {
        once: true,
      });
    });

    downloadButton.click();
    const event = await downloaded;

    expect(event.bubbles).toBe(true);
    expect(event.composed).toBe(true);
    expect(event.detail.format).toBe("png");
    expect(event.detail.meme.templateId).toBe("test-id");
    expect(URL.createObjectURL).toHaveBeenCalled();
  });

  it("shows an error popup and fires no event when rasterizing fails", async () => {
    html2canvas.mockRejectedValueOnce(new Error("rasterize boom"));

    const editor = await mountEditor();
    let fired = false;
    document.addEventListener(
      "memebro:meme-downloaded",
      () => {
        fired = true;
      },
      { once: true }
    );

    editor.shadowRoot.querySelector(".download-button").click();

    await vi.waitFor(() => {
      if (!editor.shadowRoot.querySelector(".editor-error")) {
        throw new Error("error popup not shown yet");
      }
    });
    expect(editor.shadowRoot.querySelector(".editor-error")).not.toBeNull();
    expect(fired).toBe(false);
  });
});

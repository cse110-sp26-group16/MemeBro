import { describe, it, expect } from "vitest";
import { buildAIPrompt } from "../../js/api/ai-api.js";

describe("buildAIPrompt", () => {
  it("returns a valid JSON string with system and user keys", () => {
    const result = buildAIPrompt({ concept: "me when the wifi cuts out mid-Zoom" });
    const parsed = JSON.parse(result);

    expect(typeof parsed.system).toBe("string");
    expect(parsed.system.length).toBeGreaterThan(0);
    expect(typeof parsed.user).toBe("string");
    expect(parsed.user.length).toBeGreaterThan(0);
  });

  it("includes concept, style, and layout in user message", () => {
    const result = buildAIPrompt({
      concept: "finals week energy",
      style: "cartoon",
      layout: "2-panel",
    });
    const { user } = JSON.parse(result);

    expect(user).toContain("finals week energy");
    expect(user).toContain("cartoon");
    expect(user).toContain("2-panel");
  });

  it("includes meme format when provided", () => {
    const result = buildAIPrompt({
      concept: "choosing between sleep and studying",
      memeFormat: "Drake Hotline Bling",
    });
    const { user } = JSON.parse(result);

    expect(user).toContain("Drake Hotline Bling");
  });

  it("omits format line and uses suggested_format schema when memeFormat is not provided", () => {
    const result = buildAIPrompt({ concept: "procrastinating on a deadline" });
    const { user } = JSON.parse(result);

    expect(user).not.toContain("Format:");
    expect(user).toContain("suggested_format");
  });

  it("includes reference image when provided", () => {
    const fakeImage = "data:image/png;base64,abc123";
    const result = buildAIPrompt({
      concept: "my cat judging me",
      referenceImage: fakeImage,
    });
    const { user } = JSON.parse(result);

    expect(user).toContain(fakeImage);
  });

  it("defaults style to photo and layout to 1-panel when omitted", () => {
    const result = buildAIPrompt({ concept: "monday morning" });
    const { user } = JSON.parse(result);

    expect(user).toContain("photo");
    expect(user).toContain("1-panel");
  });

  it("is a pure function, same inputs produce identical output", () => {
    const inputs = { concept: "same input twice", style: "retro", layout: "4-panel" };
    expect(buildAIPrompt(inputs)).toBe(buildAIPrompt(inputs));
  });

  it("throws when concept is missing", () => {
    expect(() => buildAIPrompt({})).toThrow(/concept is required/);
  });

  it("throws when concept is an empty string", () => {
    expect(() => buildAIPrompt({ concept: "   " })).toThrow(/concept is required/);
  });

  it("throws when inputs is null", () => {
    expect(() => buildAIPrompt(null)).toThrow(/concept is required/);
  });
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { buildAIPrompt } from "../js/api/ai-api.js";

test("returns a valid JSON string with system and user keys", () => {
  const result = buildAIPrompt({ concept: "me when the wifi cuts out mid-Zoom" });
  const parsed = JSON.parse(result);

  assert.ok(
    typeof parsed.system === "string" && parsed.system.length > 0,
    "system prompt must be a non-empty string"
  );
  assert.ok(
    typeof parsed.user === "string" && parsed.user.length > 0,
    "user message must be a non-empty string"
  );
});

test("includes concept, style, and layout in user message", () => {
  const result = buildAIPrompt({
    concept: "finals week energy",
    style: "cartoon",
    layout: "2-panel",
  });
  const { user } = JSON.parse(result);

  assert.ok(user.includes("finals week energy"), "user message must contain the concept");
  assert.ok(user.includes("cartoon"), "user message must contain the style");
  assert.ok(user.includes("2-panel"), "user message must contain the layout");
});

test("includes meme format when provided", () => {
  const result = buildAIPrompt({
    concept: "choosing between sleep and studying",
    memeFormat: "Drake Hotline Bling",
  });
  const { user } = JSON.parse(result);

  assert.ok(user.includes("Drake Hotline Bling"), "user message must include the meme format");
});

test("omits format line and uses suggested_format schema when memeFormat is not provided", () => {
  const result = buildAIPrompt({ concept: "procrastinating on a deadline" });
  const { user } = JSON.parse(result);

  assert.ok(
    !user.includes("Format:"),
    "user message must not include Format: when memeFormat is omitted"
  );
  assert.ok(
    user.includes("suggested_format"),
    "output schema must include suggested_format when no format is given"
  );
});

test("includes reference image when provided", () => {
  const fakeImage = "data:image/png;base64,abc123";
  const result = buildAIPrompt({
    concept: "my cat judging me",
    referenceImage: fakeImage,
  });
  const { user } = JSON.parse(result);

  assert.ok(user.includes(fakeImage), "user message must include the reference image data URL");
});

test("defaults style to photo and layout to 1-panel when omitted", () => {
  const result = buildAIPrompt({ concept: "monday morning" });
  const { user } = JSON.parse(result);

  assert.ok(user.includes("photo"), "default style must be photo");
  assert.ok(user.includes("1-panel"), "default layout must be 1-panel");
});

test("is a pure function — same inputs produce identical output", () => {
  const inputs = { concept: "same input twice", style: "retro", layout: "4-panel" };
  assert.equal(buildAIPrompt(inputs), buildAIPrompt(inputs));
});

test("throws when concept is missing", () => {
  assert.throws(() => buildAIPrompt({}), /concept is required/);
});

test("throws when concept is an empty string", () => {
  assert.throws(() => buildAIPrompt({ concept: "   " }), /concept is required/);
});

test("throws when inputs is null", () => {
  assert.throws(() => buildAIPrompt(null), /concept is required/);
});

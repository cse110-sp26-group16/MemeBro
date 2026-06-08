import {
  env,
  createExecutionContext,
  waitOnExecutionContext,
  SELF,
  fetchMock,
} from "cloudflare:test";
import { describe, it, expect, beforeAll, afterEach } from "vitest";
import worker from "../src";

/**
 * Three ImgFlip-shaped templates for the ranking tests. Mirrors the upstream
 * get_memes payload (data.memes[]) that getPopularTemplates() consumes.
 */
const IMGFLIP_MEMES = [
  {
    id: "1",
    name: "Drake Hotline Bling",
    url: "https://i.imgflip.com/30b1gx.jpg",
    width: 1200,
    height: 1200,
  },
  {
    id: "2",
    name: "Two Buttons",
    url: "https://i.imgflip.com/1g8my4.jpg",
    width: 600,
    height: 908,
  },
  {
    id: "3",
    name: "Distracted Boyfriend",
    url: "https://i.imgflip.com/1ur9b0.jpg",
    width: 1200,
    height: 800,
  },
];

/**
 * Toy 2-D "embedding": "Two Buttons" and any query mentioning it point one way,
 * everything else the orthogonal way. Lets cosine ranking be asserted exactly.
 * @param {string} text - Title or query to embed.
 * @returns {number[]} A unit-ish vector.
 */
function vectorFor(text) {
  return text.toLowerCase().includes("two buttons") ? [1, 0] : [0, 1];
}

/** A fake Workers AI binding that embeds with vectorFor(). */
const fakeAI = {
  async run(_model, inputs) {
    return { shape: [inputs.text.length, 2], data: inputs.text.map(vectorFor) };
  },
};

/**
 * Intercepts the next ImgFlip get_memes call with the given status and body.
 * @param {number} status - HTTP status to reply with.
 * @param {object|string} body - Response body (object is sent as JSON).
 */
function mockImgflip(status, body) {
  fetchMock
    .get("https://api.imgflip.com")
    .intercept({ path: "/get_memes?type=image", method: "GET" })
    .reply(status, body);
}

describe("memebro-api worker", () => {
  it("returns a healthy status payload from GET /api/status (unit style)", async () => {
    const request = new Request("http://example.com/api/status");
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(200);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");

    const body = await response.json();
    expect(body.status).toBe("ok");
    expect(typeof body.timestamp).toBe("string");
    expect(Number.isNaN(Date.parse(body.timestamp))).toBe(false);
  });

  it("returns a healthy status payload from GET /api/status (integration style)", async () => {
    const response = await SELF.fetch("http://example.com/api/status");

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.status).toBe("ok");
  });

  it("returns 404 Not Found for unknown routes", async () => {
    const response = await SELF.fetch("http://example.com/does-not-exist");

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("Not Found");
  });

  it("handles CORS preflight OPTIONS with 204 and CORS headers", async () => {
    const response = await SELF.fetch("http://example.com/api/status", {
      method: "OPTIONS",
    });

    expect(response.status).toBe(204);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(response.headers.get("Access-Control-Allow-Methods")).toContain("GET");
  });
});

describe("GET /api/search", () => {
  beforeAll(() => {
    fetchMock.activate();
    fetchMock.disableNetConnect();
  });

  afterEach(() => {
    fetchMock.assertNoPendingInterceptors();
  });

  it("returns ranked templates from fixtures on the happy path", async () => {
    const request = new Request("http://example.com/api/search?q=drake");
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, { ...env, USE_FIXTURE: "true" }, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(200);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");

    const body = await response.json();
    expect(Array.isArray(body.results)).toBe(true);
    expect(body.results.length).toBeGreaterThan(0);

    const [first] = body.results;
    expect(typeof first.id).toBe("string");
    expect(typeof first.name).toBe("string");
    expect(typeof first.imageUrl).toBe("string");
    expect(typeof first.width).toBe("number");
    expect(typeof first.height).toBe("number");
    expect(typeof first.score).toBe("number");

    // Fixture data is pre-ranked by descending score.
    const scores = body.results.map((r) => r.score);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
  });

  it("returns 400 with { error: 'missing query' } when q is absent", async () => {
    const request = new Request("http://example.com/api/search");
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, { ...env, USE_FIXTURE: "true" }, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(400);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(await response.json()).toEqual({ error: "missing query" });
  });

  it("returns 400 with { error: 'missing query' } when q is blank", async () => {
    const request = new Request("http://example.com/api/search?q=%20%20");
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, { ...env, USE_FIXTURE: "true" }, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "missing query" });
  });

  it("ranks templates by Workers AI embedding similarity, best match first", async () => {
    mockImgflip(200, { success: true, data: { memes: IMGFLIP_MEMES } });

    const request = new Request("http://example.com/api/search?q=two%20buttons");
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, { ...env, USE_FIXTURE: "false", AI: fakeAI }, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(200);
    const { results } = await response.json();

    // "Two Buttons" embeds parallel to the query, so it ranks first.
    expect(results[0].id).toBe("2");
    expect(results[0].score).toBeGreaterThan(results[1].score);
    expect(results[0].reason).toBe("Strong semantic match");
    expect(results.every((r) => typeof r.score === "number")).toBe(true);

    const scores = results.map((r) => r.score);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
  });

  it("degrades to lexical ranking when the Workers AI call fails", async () => {
    mockImgflip(200, { success: true, data: { memes: IMGFLIP_MEMES } });

    const brokenAI = {
      run: async () => {
        throw new Error("Workers AI unavailable");
      },
    };

    const request = new Request("http://example.com/api/search?q=drake");
    const ctx = createExecutionContext();
    const response = await worker.fetch(
      request,
      { ...env, USE_FIXTURE: "false", AI: brokenAI },
      ctx
    );
    await waitOnExecutionContext(ctx);

    // Lexical fallback (not a 502): substring match on the title only.
    expect(response.status).toBe(200);
    const { results } = await response.json();
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("Drake Hotline Bling");
    expect(results[0].reason).toBe("Partial title match");
  });

  it("degrades to lexical ranking when no AI binding is present", async () => {
    mockImgflip(200, { success: true, data: { memes: IMGFLIP_MEMES } });

    const envWithoutAI = { ...env };
    delete envWithoutAI.AI;

    const request = new Request("http://example.com/api/search?q=two%20buttons");
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, { ...envWithoutAI, USE_FIXTURE: "false" }, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(200);
    const { results } = await response.json();
    expect(results[0].name).toBe("Two Buttons");
    expect(results[0].reason).toBe("Exact title match");
  });

  it("returns 502 { error: 'ranking failed' } when templates cannot be fetched", async () => {
    mockImgflip(500, "imgflip down");

    const request = new Request("http://example.com/api/search?q=drake");
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, { ...env, USE_FIXTURE: "false", AI: fakeAI }, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(502);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(await response.json()).toEqual({ error: "ranking failed" });
  });

  it("handles CORS preflight OPTIONS for /api/search with 204", async () => {
    const response = await SELF.fetch("http://example.com/api/search?q=drake", {
      method: "OPTIONS",
    });

    expect(response.status).toBe(204);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(response.headers.get("Access-Control-Allow-Methods")).toContain("GET");
  });
});

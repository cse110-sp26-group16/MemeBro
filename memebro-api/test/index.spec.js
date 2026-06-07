import { env, createExecutionContext, waitOnExecutionContext, SELF } from "cloudflare:test";
import { describe, it, expect } from "vitest";
import worker from "../src";

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

  it("returns 502 with { error: 'ranking failed' } when the ranker throws", async () => {
    const request = new Request("http://example.com/api/search?q=drake");
    const ctx = createExecutionContext();
    // No USE_FIXTURE flag, so the route calls the AI ranker, which throws (#77).
    const response = await worker.fetch(request, { ...env, USE_FIXTURE: "false" }, ctx);
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

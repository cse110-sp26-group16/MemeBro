import {
	env,
	createExecutionContext,
	waitOnExecutionContext,
	SELF,
} from "cloudflare:test";
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
		expect(response.headers.get("Access-Control-Allow-Methods")).toContain(
			"GET",
		);
	});
});

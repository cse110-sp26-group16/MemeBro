const CORS_HEADERS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
	"Access-Control-Max-Age": "86400",
};

function withCors(response) {
	const headers = new Headers(response.headers);
	for (const [key, value] of Object.entries(CORS_HEADERS)) {
		headers.set(key, value);
	}
	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers,
	});
}

async function handleRequest(request, env, ctx) {
	const url = new URL(request.url);

	if (url.pathname === "/api/status" && request.method === "GET") {
		return Response.json({
			status: "ok",
			timestamp: new Date().toISOString(),
		});
	}

	return new Response("Not Found", { status: 404 });
}

export default {
	async fetch(request, env, ctx) {
		if (request.method === "OPTIONS") {
			return new Response(null, { status: 204, headers: CORS_HEADERS });
		}

		const response = await handleRequest(request, env, ctx);
		return withCors(response);
	},
};

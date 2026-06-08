import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";

export default defineWorkersConfig({
  test: {
    poolOptions: {
      workers: {
        wrangler: { configPath: "./wrangler.jsonc" },
        // The wrangler config declares an `ai` binding (ADR-0011). Workers AI
        // has no local simulation, so the pool would otherwise start a remote
        // proxy session that requires `wrangler login`. Tests inject their own
        // fake AI binding instead, so keep the run fully local and offline.
        remoteBindings: false,
      },
    },
  },
});

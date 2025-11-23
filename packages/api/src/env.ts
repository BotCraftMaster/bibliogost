import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/v4";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here.
   * This way you can ensure the app isn't built with invalid env vars.
   */
  server: {
    GROBID_URL: z
      .string()
      .url()
      .default("https://kermitt2-grobid.hf.space")
      .describe(
        "GROBID server URL for citation parsing. Default: HuggingFace demo server with DL models",
      ),
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },

  /**
   * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
   */
  runtimeEnv: process.env,

  /**
   * Skip validation in CI or during linting
   */
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});

import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    BETTER_AUTH_SECRET: z
      .string()
      .min(16, "BETTER_AUTH_SECRET must be at least 16 characters long"),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    DATABASE_URL: z.string(),
    REDIS_KV_REST_API_URL: z.string().url("REDIS_KV_URL is not a valid URL"),
    REDIS_KV_REST_API_TOKEN: z.string().optional(),
    VERCEL_TOKEN: z.string(),
    VERCEL_TEAM_ID: z.string(),
  },

  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  clientPrefix: "NEXT_PUBLIC_",

  client: {
    NEXT_PUBLIC_ALLOW_USER_SIGNUPS: z
      .string()
      .transform((arg) => arg === "true"),
    NEXT_PUBLIC_AUTH_URL: z.string().optional()
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: {
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    REDIS_KV_REST_API_URL: process.env.REDIS_KV_REST_API_URL,
    REDIS_KV_REST_API_TOKEN: process.env.REDIS_KV_REST_API_TOKEN,

    NEXT_PUBLIC_ALLOW_USER_SIGNUPS: process.env.NEXT_PUBLIC_ALLOW_USER_SIGNUPS,
    NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
    VERCEL_TOKEN: process.env.VERCEL_TOKEN,
    VERCEL_TEAM_ID: process.env.VERCEL_TEAM_ID,
  },

  // @ts-expect-error - This is a workaround to allow the runtimeEnv to be used in the client
  experimental__runtimeEnv: {
    NEXT_PUBLIC_ALLOW_USER_SIGNUPS: process.env.NEXT_PUBLIC_ALLOW_USER_SIGNUPS,
    NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
  },

  emptyStringAsUndefined: true,
});

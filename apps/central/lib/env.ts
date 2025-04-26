import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    BETTER_AUTH_SECRET: z
      .string()
      .min(16, "BETTER_AUTH_SECRET must be at least 16 characters long"),
    AUTH_UNION_SECRET: z
      .string()
      .min(16, "AUTH_UNION_SECRET must be at least 16 characters long"),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    DATABASE_URL: z.string(),
    REDIS_KV_URL: z.string().url("REDIS_KV_URL is not a valid URL"),
    REDIS_KV_TOKEN: z.string().optional(),
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
    NEXT_PUBLIC_ROOT_DOMAIN: z.string(),
    NEXT_PUBLIC_PROD_DOMAIN: z.string().optional(),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: {
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    AUTH_UNION_SECRET: process.env.AUTH_UNION_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    REDIS_KV_URL: process.env.REDIS_KV_URL,
    REDIS_KV_TOKEN: process.env.REDIS_KV_TOKEN,
    NEXT_PUBLIC_ROOT_DOMAIN: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
    NEXT_PUBLIC_ALLOW_USER_SIGNUPS: process.env.NEXT_PUBLIC_ALLOW_USER_SIGNUPS,
    NEXT_PUBLIC_PROD_DOMAIN: process.env.NEXT_PUBLIC_PROD_DOMAIN,
  },

  // @ts-expect-error - This is a workaround to allow the runtimeEnv to be used in the client
  experimental__runtimeEnv: {
    NEXT_PUBLIC_ROOT_DOMAIN: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
    NEXT_PUBLIC_ALLOW_USER_SIGNUPS: process.env.NEXT_PUBLIC_ALLOW_USER_SIGNUPS,
    NEXT_PUBLIC_PROD_DOMAIN: process.env.NEXT_PUBLIC_PROD_DOMAIN,
  },

  emptyStringAsUndefined: true,
});

import { betterAuth } from "better-auth";
import { admin, oAuthProxy, organization } from "better-auth/plugins";
import { env } from "./env";
import { db } from "./db/drizzle";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "./db/schema";
import { bannedOrgSlugs } from "./org";
import { allowedOrgSlugChars } from "./org";
import { nextCookies } from "better-auth/next-js";
import { getDeploymentAliases } from "./deployments";
import { ListDeploymentAliasesResponseBody } from "@vercel/sdk/models/listdeploymentaliasesop.js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema: schema,
  }),
  advanced: {
    defaultCookieAttributes: {
      secure: true,
      sameSite: "none",
      partitioned: true,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    },
  },
  user: {
    additionalFields: {
      scope: {
        type: "number",
        required: true,
        defaultValue: 0,
        input: false, // don't allow user to set role
      },
    },
  },
  plugins: [
    organization({
      organizationCreation: {
        disabled: false,
        beforeCreate: async ({ organization }) => {
          if (!allowedOrgSlugChars.test(organization.slug)) {
            throw new Error("Invalid organization slug");
          }

          if (bannedOrgSlugs.includes(organization.slug)) {
            throw new Error("The requested organization slug is not allowed.");
          }

          return {
            data: organization,
          };
        },
      },
    }),
    admin(),
    oAuthProxy(),
    nextCookies(),
  ],
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      redirectURI: `${env.NEXT_PUBLIC_AUTH_URL}/api/auth/callback/github`,
    },
  },
  trustedOrigins: async (req) => {
    const aliases: ListDeploymentAliasesResponseBody =
      process.env.VERCEL_ENV === "production" ||
      process.env.VERCEL_ENV === "preview"
        ? await getDeploymentAliases()
        : { aliases: [] };

    const origins = [
      `https://${process.env.VERCEL_URL!}`,
      ...aliases.aliases.map((alias) => `https://${alias.alias}`),
    ];

    const url =
      req.headers.get("host") ||
      req.headers.get("origin") ||
      req.headers.get("referer");

    if (!url) {
      return origins;
    }

    const urlObj = new URL(`https://${url}`);
    const host = urlObj.host;
    const port = urlObj.port;

    return origins.filter((origin) => {
      const originUrl = new URL(origin);
      return originUrl.host === host && originUrl.port === port;
    });
  },
});

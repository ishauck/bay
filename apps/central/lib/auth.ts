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

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema: schema,
  }),
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
      redirectUri: `${env.NEXT_PUBLIC_AUTH_URL}/api/auth/callback/github`,
    },
  },
  trustedOrigins: [
    `https://${process.env.VERCEL_URL!}/*`,
    ...(await getDeploymentAliases()).aliases.map(
      (alias) => `https://${alias.alias}/*`
    )
  ],
});

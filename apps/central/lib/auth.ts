import { betterAuth } from "better-auth";
import { admin, organization } from "better-auth/plugins";
import { env } from "./env";
import { db } from "./db/drizzle";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "./db/schema";
import { bannedOrgSlugs } from "./org";
import { allowedOrgSlugChars } from "./org";
import { getDeploymentAliases } from "./deployments";

const origins =
  process.env.VERCEL != "1"
    ? ["http://localhost:3000"]
    : [
        "http://localhost:3000",
        ...(await getDeploymentAliases()).aliases.map(
          (alias) => `https://${alias.alias}`
        ),
      ];

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
  ],
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  trustedOrigins: (req) => {
    let newOrigins = process.env.NEXT_PUBLIC_VERCEL_URL
      ? [...origins, process.env.NEXT_PUBLIC_VERCEL_URL]
      : [...origins];

    newOrigins = newOrigins.map((origin) => {
      if (!origin.startsWith("http")) {
        return `https://${origin}`;
      }
      return origin;
    });

    const urls = newOrigins.map((origin) => {
      try {
        return new URL(origin);
      } catch {
        console.warn(`Invalid URL: ${origin}`);
        return null;
      }
    }).filter(Boolean);

    const filteredUrls = urls.filter((url) => {
      if (!url) return false;
      const host = req.headers.get("host");
      const origin = req.headers.get("origin");
      return (
        url.hostname === host ||
        url.hostname === origin ||
        url.hostname === origin?.replace(/^https?:\/\//, "")
      );
    });

    return filteredUrls.filter((url) => url !== null).map((url) => url.origin);
  },
  baseURL: env.NEXT_PUBLIC_AUTH_URL,
  cors: {
    origin: origins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

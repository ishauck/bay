import { Vercel } from "@vercel/sdk";
import { env } from "./env";

const vercel = new Vercel({
  bearerToken: env.VERCEL_TOKEN,
});

export async function getDeploymentAliases() {
  const team = await vercel.teams.getTeam({
    teamId: env.VERCEL_TEAM_ID,
  });

  const result = await vercel.aliases.listDeploymentAliases({
    id: process.env.VERCEL_DEPLOYMENT_ID!,
    teamId: env.VERCEL_TEAM_ID,
    slug: team.slug,
  });

  return result;
}
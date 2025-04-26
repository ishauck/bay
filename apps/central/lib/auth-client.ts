import { createAuthClient } from "better-auth/react";
import { adminClient, inferAdditionalFields, organizationClient } from "better-auth/client/plugins";
import { auth } from "./auth";
import { env } from "./env";

export const authClient = createAuthClient({
  plugins: [organizationClient(), adminClient(), inferAdditionalFields<typeof auth>()],
  baseURL: env.NEXT_PUBLIC_AUTH_URL,
});

export default authClient;

export const { signIn, signOut, useSession } = authClient;

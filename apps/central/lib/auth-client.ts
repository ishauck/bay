import { createAuthClient } from "better-auth/react";
import { adminClient, inferAdditionalFields, organizationClient } from "better-auth/client/plugins";
import { env } from "./env";
import { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_AUTH_URL,
  plugins: [organizationClient(), adminClient(), inferAdditionalFields<typeof auth>()],
});

export default authClient;

export const { signIn, signOut, useSession } = authClient;

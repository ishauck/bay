import { createAuthClient } from "better-auth/react";
import { adminClient, inferAdditionalFields, organizationClient } from "better-auth/client/plugins";
import { auth } from "./auth";

export const authClient = createAuthClient({
  plugins: [organizationClient(), adminClient(), inferAdditionalFields<typeof auth>()]
});

export default authClient;

export const { signIn, signOut, useSession } = authClient;

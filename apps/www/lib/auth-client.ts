import { createAuthClient } from "better-auth/react";
import {
  adminClient,
  inferAdditionalFields,
  organizationClient,
  passkeyClient,
} from "better-auth/client/plugins";
import { auth } from "./auth";

export const authClient = createAuthClient({
  plugins: [
    organizationClient(),
    adminClient(),
    inferAdditionalFields<typeof auth>(),
    passkeyClient(),
  ],
});

export default authClient;

export const { signIn, signOut, useSession } = authClient;

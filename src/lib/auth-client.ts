import { oauthProviderClient } from "@better-auth/oauth-provider/client";
import { createAuthClient } from "void/client/react";

export const authClient = createAuthClient({
  basePath: "/api/auth",
  plugins: [oauthProviderClient()],
});

export const { useSession } = authClient;

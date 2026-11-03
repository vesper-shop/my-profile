import { oauthProvider } from "@better-auth/oauth-provider";
import { APIError } from "better-auth/api";
import { jwt } from "better-auth/plugins";
import { OAUTH_SCOPES, OWNER_SCOPES, OWNER_USER_ID } from "@shared/oauth";
import { defineAuth } from "void/auth";

const RESOURCES = [
  "https://memos.you-find.me",
  "https://moment.you-find.me",
  "https://knowledge.you-find.me",
];

export default defineAuth(({ defaults, request }) => {
  const requestOrigin = new URL(request.url).origin;

  return {
    ...defaults,
    trustedOrigins: [
      ...new Set([
        requestOrigin,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://[::1]:5173",
      ]),
    ],
    advanced: {
      ...defaults.advanced,
      useSecureCookies: new URL(request.url).protocol === "https:",
    },
    onAPIError: {
      ...defaults.onAPIError,
      errorURL: "/error",
    },
    account: {
      ...defaults.account,
      encryptOAuthTokens: true,
      accountLinking: { enabled: false },
    },
    session: {
      ...defaults.session,
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60,
      },
    },
    plugins: [
      jwt(),
      oauthProvider({
        loginPage: "/login",
        consentPage: "/oauth/consent",
        scopes: Object.keys(OAUTH_SCOPES),
        resources: RESOURCES,
        resourceSeedMode: "overwrite",
        cachedTrustedClients: new Set(["vesper", "workspace", "memos", "moment", "knowledge"]),
        enforcePerClientResources: false,
        allowDynamicClientRegistration: true,
        allowUnauthenticatedClientRegistration: true,
        clientRegistrationDefaultApplicationType: "infer",
        customAccessTokenClaims: ({ user, scopes }) => {
          if (user?.id !== OWNER_USER_ID && scopes.some((scope) => OWNER_SCOPES.has(scope))) {
            throw new APIError("FORBIDDEN", { message: "These scopes belong to the site owner." });
          }
          return {};
        },
      }),
    ],
  };
});

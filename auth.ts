import { oauthProvider } from "@better-auth/oauth-provider";
import { APIError } from "better-auth/api";
import { jwt } from "better-auth/plugins";
import { defineAuth } from "void/auth";
import { env } from "void/env";
import { Resend } from "resend";

type SendEmailOptions =
  | { to: string; subject: string; text: string; html?: string }
  | { to: string; subject: string; html: string; text?: string };

const RESOURCES = [
  "https://memos.you-find.me",
  "https://moment.you-find.me",
  "https://knowledge.you-find.me",
];

const OWNER_SCOPES = [
  "memos:read",
  "memos:write",
  "moment:read",
  "moment:write",
  "knowledge:read",
  "knowledge:write",
];

async function sendEmail(options: SendEmailOptions) {
  const resend = new Resend(env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: env.RESEND_FROM,
    ...options,
  });

  if (error) throw new Error(error.message);
  console.log("Email sent:", data.id);
}

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
    emailAndPassword: {
      ...defaults.emailAndPassword,
      enabled: true,
      requireEmailVerification: true,
      revokeSessionsOnPasswordReset: true,
      sendResetPassword: async ({ user, url }) => {
        await sendEmail({
          to: user.email,
          subject: "Reset your password",
          html: `<a href="${url}">Click the link to reset your password</a>`,
        });
      },
      onPasswordReset: async ({ user }) => {
        console.log(`Password for user ${user.email} has been reset.`);
      },
    },
    emailVerification: {
      ...defaults.emailVerification,
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      sendVerificationEmail: async ({ user, url }) => {
        await sendEmail({
          to: user.email,
          subject: "Verify your email address",
          html: `<a href="${url}">Click the link to verify your email</a>`,
        });
      },
    },
    account: {
      ...defaults.account,
      encryptOAuthTokens: true,
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
        scopes: ["openid", "profile", "email", "offline_access", ...OWNER_SCOPES],
        resources: RESOURCES,
        resourceSeedMode: "overwrite",
        cachedTrustedClients: new Set(["vesper", "workspace", "memos", "moment", "knowledge"]),
        enforcePerClientResources: false,
        customAccessTokenClaims: ({ user, scopes }) => {
          if (!user) {
            throw new APIError("BAD_REQUEST", {
              message: "Access tokens are issued to users only.",
            });
          }
          if (
            scopes.some((scope) => OWNER_SCOPES.includes(scope)) &&
            user.email.toLowerCase() !== env.ALLOWED_EMAIL.toLowerCase()
          ) {
            throw new APIError("FORBIDDEN", { message: "These scopes belong to the site owner." });
          }
          return { email: user.email };
        },
      }),
    ],
  };
});

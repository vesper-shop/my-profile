export const OWNER_USER_ID = "owner";

export const OAUTH_SCOPES = {
  openid: "Confirm your identity",
  profile: "Read your name and avatar",
  email: "Read your email address",
  offline_access: "Stay signed in until you revoke access",
  "memos:read": "Read Memos",
  "memos:write": "Create and change Memos",
  "moment:read": "Read Moment",
  "moment:write": "Create and change Moment",
  "knowledge:read": "Read Knowledge",
  "knowledge:write": "Create and change Knowledge",
} as const;

export type OAuthScope = keyof typeof OAUTH_SCOPES;

export const OWNER_SCOPES: ReadonlySet<string> = new Set<OAuthScope>([
  "memos:read",
  "memos:write",
  "moment:read",
  "moment:write",
  "knowledge:read",
  "knowledge:write",
]);

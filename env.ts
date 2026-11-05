import { defineEnv, string } from "void/env";

export default defineEnv({
  BETTER_AUTH_SECRET: string(),
  AUTH_GITHUB_CLIENT_ID: string(),
  AUTH_GITHUB_CLIENT_SECRET: string(),
  AUTH_GOOGLE_CLIENT_ID: string(),
  AUTH_GOOGLE_CLIENT_SECRET: string(),
});

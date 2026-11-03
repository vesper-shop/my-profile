import { defineEnv, email, string, url } from "void/env";

export default defineEnv({
  OPENAI_API_URL: url().default("https://api.siliconflow.cn/v1"),
  OPENAI_MODEL: string().default("deepseek-ai/DeepSeek-V4-Flash"),
  RESEND_FROM: email().default("pleasure@yiming1234.cn"),
  ALLOWED_EMAIL: email(),

  BETTER_AUTH_SECRET: string(),
  AUTH_GITHUB_CLIENT_ID: string(),
  AUTH_GITHUB_CLIENT_SECRET: string(),
  AUTH_GOOGLE_CLIENT_ID: string(),
  AUTH_GOOGLE_CLIENT_SECRET: string(),
  OPENAI_API_KEY: string(),
  RESEND_API_KEY: string(),
});

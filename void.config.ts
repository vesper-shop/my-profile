import { defineConfig } from "void/config";

export default defineConfig({
  target: "cloudflare",
  routing: {
    notFound: "404-page",
  },
  inference: {
    appType: "void",
  },
  cloudflare: {
    name: "my-profile",
    account_id: "fb71c4eceaf623ae1b19b8b37d7a38cf",
    compatibility_date: "2026-08-01",
    compatibility_flags: ["nodejs_compat"],
    upload_source_maps: true,
    workers_dev: false,
    preview_urls: false,
    routes: [
      { pattern: "you-find.me", custom_domain: true },
      { pattern: "www.you-find.me", custom_domain: true },
      { pattern: "yiming1234.cn", custom_domain: true },
      { pattern: "www.yiming1234.cn", custom_domain: true },
    ],
    placement: {
      mode: "smart",
    },
    observability: {
      logs: {
        enabled: true,
        invocation_logs: true,
      },
      traces: {
        enabled: true,
      },
    },
  },
});

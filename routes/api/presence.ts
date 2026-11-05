import { z } from "zod";
import { defineHandler } from "void/handler";
import { recordPresence } from "@server/lib/presence";

const presenceBodySchema = z.object({
  sessionId: z.uuid(),
});

export const POST = defineHandler(async (c) => {
  let rawBody: unknown;
  try {
    rawBody = await c.req.json();
  } catch {
    return c.json({ error: "The request body is not valid JSON." }, 400);
  }
  const body = presenceBodySchema.safeParse(rawBody);
  if (!body.success) return c.json({ error: "Invalid presence heartbeat." }, 400);
  return c.json({ count: recordPresence(body.data.sessionId) });
});

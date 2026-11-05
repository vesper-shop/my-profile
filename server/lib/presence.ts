const SESSION_TTL_MS = 180_000;
const sessions = new Map<string, number>();

export function recordPresence(sessionId: string): number {
  const now = Date.now();
  sessions.set(sessionId, now);
  for (const [id, lastSeen] of sessions) {
    if (now - lastSeen >= SESSION_TTL_MS) sessions.delete(id);
  }
  return sessions.size;
}

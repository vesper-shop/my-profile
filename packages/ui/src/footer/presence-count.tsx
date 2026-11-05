import { useEffect, useState } from "react";

const HEARTBEAT_INTERVAL_MS = 60_000;
const SESSION_STORAGE_KEY = "presence-session-id";

export function PresenceCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let sessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    }
    const body = JSON.stringify({ sessionId });

    const heartbeat = async () => {
      const response = await fetch("/api/presence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      if (!response.ok) return;
      const presence = (await response.json()) as { count: number };
      setCount(presence.count);
    };

    void heartbeat();
    const timer = setInterval(() => void heartbeat(), HEARTBEAT_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  if (count === null) return null;

  return (
    <p className="text-xs text-muted-foreground/50">
      <span className="tabular-nums">{count}</span> people browsing right now :)
    </p>
  );
}

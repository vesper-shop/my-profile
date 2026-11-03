import { OAUTH_SCOPES, OWNER_SCOPES, OWNER_USER_ID, type OAuthScope } from "@shared/oauth";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ChevronDown, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient, useSession } from "@/lib/auth-client";

export const Route = createFileRoute("/_auth/oauth/consent")({
  component: ConsentPage,
});

function ConsentPage() {
  const [query] = useState(() => new URLSearchParams(window.location.search));
  const clientId = query.get("client_id");
  const scope = query.get("scope");
  const [clientName, setClientName] = useState<string | null>(null);
  const [pending, setPending] = useState<"idle" | "accept" | "deny">("idle");
  const { data: session } = useSession();

  useEffect(() => {
    if (!clientId) return;
    void authClient.oauth2
      .publicClient({ query: { client_id: clientId } })
      .then(({ data, error }) => {
        if (error) {
          toast.error(`${error.status} ${error.statusText}`, { description: error.message });
          return;
        }
        if (data.client_name) setClientName(data.client_name);
      });
  }, [clientId]);

  if (!clientId || !scope) {
    return (
      <section className="grid w-full gap-6">
        <div className="grid gap-2">
          <h1 className="text-lg font-medium tracking-tight">No authorization request</h1>
          <p className="text-sm text-muted-foreground">
            Open this page from an application's sign-in.
          </p>
        </div>
        <Button asChild variant="outline" className="w-full">
          <Link to="/">Back to home</Link>
        </Button>
      </section>
    );
  }

  const requested = new Set(scope.split(" "));
  const scopes = (Object.keys(OAUTH_SCOPES) as OAuthScope[]).filter((id) => requested.has(id));
  const ownerOnly = session?.user.id !== OWNER_USER_ID && scopes.some((id) => OWNER_SCOPES.has(id));

  const decide = async (accept: boolean) => {
    setPending(accept ? "accept" : "deny");
    const { error } = await authClient.oauth2.consent({ accept });
    if (error) {
      toast.error(`${error.status} ${error.statusText}`, { description: error.message });
      setPending("idle");
    }
  };

  return (
    <section className="grid w-full gap-6">
      <div className="grid gap-1">
        <h1 className="text-lg font-medium tracking-tight">Authorize {clientName}</h1>
        <p className="font-mono text-xs text-muted-foreground">{clientId}</p>
        {ownerOnly && (
          <p className="text-sm text-muted-foreground">Only the site owner can authorize this.</p>
        )}
      </div>

      <details className="group rounded-lg border border-border text-left text-sm">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
          <span>{scopes.length} permissions</span>
          <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
        </summary>
        <ul className="grid max-h-64 gap-3 overflow-y-auto border-t border-border px-4 py-3">
          {scopes.map((id) => (
            <li key={id} className="grid gap-0.5">
              <span>{OAUTH_SCOPES[id]}</span>
              <span className="font-mono text-xs text-muted-foreground">{id}</span>
            </li>
          ))}
        </ul>
      </details>

      <div className={ownerOnly ? "grid gap-3" : "grid grid-cols-2 gap-3"}>
        <Button variant="outline" disabled={pending !== "idle"} onClick={() => void decide(false)}>
          {pending === "deny" ? <Loader2 className="size-4 animate-spin" /> : "Deny"}
        </Button>
        {!ownerOnly && (
          <Button disabled={pending !== "idle"} onClick={() => void decide(true)}>
            {pending === "accept" ? <Loader2 className="size-4 animate-spin" /> : "Allow"}
          </Button>
        )}
      </div>
    </section>
  );
}

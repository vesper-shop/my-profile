import { createFileRoute } from "@tanstack/react-router";
import { CircleCheck, Loader2 } from "lucide-react";
import { type SVGProps, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient, useSession } from "@/lib/auth-client";

export const Route = createFileRoute("/_auth/login")({
  component: LoginPage,
});

function LoginPage() {
  const [pending, setPending] = useState<"idle" | "github" | "google" | "sign-out">("idle");
  const { data: session, isPending } = useSession();
  const resumesAuthorization = new URLSearchParams(window.location.search).has("sig");

  const signIn = async (provider: "github" | "google") => {
    setPending(provider);
    try {
      await authClient.signIn.social(
        { provider, callbackURL: "/login", errorCallbackURL: "/error" },
        {
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
        },
      );
    } finally {
      setPending("idle");
    }
  };

  const signOut = async () => {
    setPending("sign-out");
    try {
      await authClient.signOut({
        fetchOptions: {
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
        },
      });
    } finally {
      setPending("idle");
    }
  };

  if (isPending) return <Loader2 className="size-5 animate-spin text-muted-foreground" />;

  if (session && !resumesAuthorization) {
    return (
      <section className="grid w-full gap-6">
        <div className="grid justify-items-center gap-2">
          <CircleCheck className="size-6 text-foreground" aria-hidden="true" />
          <h1 className="text-lg font-medium tracking-tight">Signed in</h1>
          <p className="text-sm text-muted-foreground">
            Signed in as {session.user.name}. You can close this page now.
          </p>
        </div>
        <Button
          variant="outline"
          className="w-full gap-2"
          disabled={pending !== "idle"}
          onClick={() => void signOut()}
        >
          {pending === "sign-out" && <Loader2 className="size-4 animate-spin" />}
          Use another account
        </Button>
      </section>
    );
  }

  return (
    <section className="grid w-full gap-6">
      <h1 className="text-lg font-medium tracking-tight">Sign in</h1>
      <div className="grid gap-3">
        <Button
          variant="outline"
          className="w-full gap-2"
          disabled={pending !== "idle"}
          onClick={() => void signIn("github")}
        >
          {pending === "github" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <GithubIcon className="size-4" />
          )}
          GitHub
        </Button>
        <Button
          variant="outline"
          className="w-full gap-2"
          disabled={pending !== "idle"}
          onClick={() => void signIn("google")}
        >
          {pending === "google" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ChromeIcon className="size-4" />
          )}
          Google
        </Button>
      </div>
    </section>
  );
}

function ChromeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8" y2="8" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>
  );
}

function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

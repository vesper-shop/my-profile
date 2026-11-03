import { Link, createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_auth/error")({
  component: AuthErrorPage,
});

function AuthErrorPage() {
  const query = new URLSearchParams(window.location.search);
  const error = query.get("error");
  const description = query.get("error_description");

  return (
    <section className="grid w-full gap-6">
      <div className="grid gap-2">
        <h1 className="text-lg font-medium tracking-tight">Sign-in failed</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        {error && <p className="font-mono text-xs text-muted-foreground">{error}</p>}
      </div>
      <Button asChild variant="outline" className="w-full">
        <Link to="/">Back to home</Link>
      </Button>
    </section>
  );
}

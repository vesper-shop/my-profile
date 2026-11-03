import { Link, Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-xs flex-col items-center justify-center gap-8 px-6 py-12 text-center">
      <Link to="/" aria-label="Home">
        <img
          src="/profile/me.png"
          alt=""
          width={64}
          height={64}
          className="size-16 rounded-full border border-border"
        />
      </Link>
      <Outlet />
    </main>
  );
}

import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { Card } from "@/components/ui/card";
import { AUTH_QUERY_KEY } from "@/features/auth/auth.constants";

export const Route = createFileRoute("/auth")({
  beforeLoad: ({ context }) => {
    const user = context.queryClient.getQueryData([AUTH_QUERY_KEY]);

    if (user) {
      throw redirect({ to: "/" });
    }
  },
  component: AuthenticationLayout,
});

function AuthenticationLayout() {
  return (
    <section className="bg-muted h-screen">
      <div className="flex h-full items-center justify-center">
        <Card className="w-full max-w-sm">
          <Outlet />
        </Card>
      </div>
    </section>
  );
}

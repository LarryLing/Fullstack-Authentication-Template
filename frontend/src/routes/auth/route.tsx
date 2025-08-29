import { createFileRoute, Outlet } from "@tanstack/react-router";

import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/auth")({
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

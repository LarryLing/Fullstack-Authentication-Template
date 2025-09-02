import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, Outlet, useNavigate } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { Toaster } from "@/components/ui/sonner";
import type { AuthContextType } from "@/features/auth/contexts/auth.context";
import { setNavigate } from "@/lib/navigation";

interface MyRouterContext {
  auth: AuthContextType;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root,
});

function Root() {
  const navigate = useNavigate();

  setNavigate(navigate);

  return (
    <>
      <Outlet />
      <Toaster richColors />
      <TanStackRouterDevtools position="bottom-left" initialIsOpen={false} />
      <ReactQueryDevtools position="bottom" initialIsOpen={false} />
    </>
  );
}

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { Toaster } from "@/components/ui/sonner";

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors />
      <TanStackRouterDevtools position="bottom-left" initialIsOpen={false} />
      <ReactQueryDevtools position="bottom" initialIsOpen={false} />
    </>
  ),
});

import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { GenericAlert } from "@/components/GenericAlert";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import { PAGE_NOT_FOUND } from "@/constants/alert-messages";
import { setNavigate } from "@/lib/navigation";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root,
  notFoundComponent: NotFound,
});

function Root() {
  const navigate = useNavigate();

  setNavigate(navigate);

  return (
    <main className="bg-muted flex justify-center items-center h-screen">
      <Outlet />
      <Toaster richColors />
      <TanStackRouterDevtools position="bottom-left" initialIsOpen={false} />
      <ReactQueryDevtools position="bottom" initialIsOpen={false} />
    </main>
  );
}

function NotFound() {
  return (
    <Card className="w-full max-w-sm">
      <CardContent>
        <GenericAlert {...PAGE_NOT_FOUND} />
      </CardContent>
      <CardFooter className="text-sm flex justify-center">
        <Link to="/" className="text-sm text-primary hover:underline cursor-default">
          Return to home
        </Link>
      </CardFooter>
    </Card>
  );
}

import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

import queryClient from "./config/query-client";
import { getUser } from "./features/auth/auth.api";
import { AUTH_QUERY_KEY } from "./features/auth/auth.constants";
import { router } from "./main";

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <InnerApp />
    </QueryClientProvider>
  );
};

function InnerApp() {
  const { isPending } = useQuery({
    queryKey: [AUTH_QUERY_KEY],
    queryFn: getUser,
    staleTime: Infinity,
  });

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="size-8 animate-spin" />
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

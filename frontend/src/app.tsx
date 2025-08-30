import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";

import queryClient from "./config/query-client";
import { AuthProvider } from "./features/auth/contexts/auth.provider";
import { useAuth } from "./features/auth/hooks/use-auth";
import { router } from "./main";

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
    </QueryClientProvider>
  );
};

function InnerApp() {
  const auth = useAuth();

  return <RouterProvider context={{ auth }} router={router} />;
}

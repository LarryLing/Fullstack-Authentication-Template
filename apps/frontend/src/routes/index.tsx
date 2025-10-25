import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { AUTH_QUERY_KEYS } from "@/constants/query-keys";
import { logout } from "@/features/auth/auth.api";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context, location }) => {
    const user = context.queryClient.getQueryData([AUTH_QUERY_KEYS.USER]);

    if (!user) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutateAsync: logoutAsync } = useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.setQueryData([AUTH_QUERY_KEYS.USER], null);
      navigate({ to: "/login", replace: true });
    },
  });

  const handleLogout = async () => {
    await logoutAsync();
  };

  return (
    <div className="flex flex-col items-center gap-y-2">
      <h3>Welcome Home!</h3>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}

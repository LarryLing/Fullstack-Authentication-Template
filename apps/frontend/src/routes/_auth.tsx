import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";

import { GenericAlert } from "@/components/GenericAlert";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PAGE_NOT_FOUND } from "@/constants/alert-messages";
import { AUTH_QUERY_KEY } from "@/features/auth/auth.constants";

export const Route = createFileRoute("/_auth")({
  beforeLoad: ({ context }) => {
    const user = context.queryClient.getQueryData([AUTH_QUERY_KEY]);

    if (user) {
      throw redirect({ to: "/" });
    }
  },
  component: AuthenticationLayout,
  notFoundComponent: NotFound,
});

function AuthenticationLayout() {
  return (
    <Card className="w-full max-w-sm">
      <Outlet />
    </Card>
  );
}

function NotFound() {
  return (
    <>
      <CardContent>
        <GenericAlert {...PAGE_NOT_FOUND} />
      </CardContent>
      <CardFooter className="text-sm flex justify-center">
        <Link to="/login" className="text-sm text-primary hover:underline cursor-default">
          Return to login
        </Link>
      </CardFooter>
    </>
  );
}

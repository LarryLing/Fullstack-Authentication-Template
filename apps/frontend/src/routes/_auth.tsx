import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";

import { GenericAlert } from "@/components/GenericAlert";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { GENERIC_ALERT_MESSAGES } from "@/constants/alert-messages";
import { AUTH_QUERY_KEYS } from "@/constants/query-keys";

export const Route = createFileRoute("/_auth")({
  beforeLoad: ({ context }) => {
    const user = context.queryClient.getQueryData([AUTH_QUERY_KEYS.USER]);

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
        <GenericAlert {...GENERIC_ALERT_MESSAGES.PAGE_NOT_FOUND} />
      </CardContent>
      <CardFooter className="text-sm flex justify-center">
        <Link to="/login" className="text-sm text-primary hover:underline cursor-default">
          Return to login
        </Link>
      </CardFooter>
    </>
  );
}

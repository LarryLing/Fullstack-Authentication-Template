import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import z from "zod";

import { GenericAlert } from "@/components/GenericAlert";
import { CardContent, CardFooter } from "@/components/ui/card";
import { confirmSignup } from "@/features/auth/auth.api";
import { AUTH_QUERY_KEY, CONFIRM_SIGNUP_QUERY_KEY } from "@/features/auth/auth.constants";
import { INVALID_CONFIRM_SIGNUP_CODE } from "@/features/auth/auth.constants";

const confirmSignupSearchSchema = z.object({
  code: z.coerce.string(),
});

export const Route = createFileRoute("/_auth/signup/confirm")({
  validateSearch: confirmSignupSearchSchema,
  beforeLoad: ({ search }) => {
    if (!search.code) {
      throw redirect({ to: "/login" });
    }
  },
  loaderDeps: ({ search: { code } }) => ({ code }),
  loader: async ({ deps: { code }, context }) => {
    await context.queryClient.fetchQuery({
      queryKey: [CONFIRM_SIGNUP_QUERY_KEY, code],
      queryFn: () => confirmSignup(code),
      staleTime: Infinity,
      retry: false,
    });

    await context.queryClient.invalidateQueries({
      queryKey: [AUTH_QUERY_KEY],
    });

    throw redirect({ to: "/" });
  },
  pendingComponent: ConfirmPending,
  errorComponent: ConfirmError,
});

function ConfirmPending() {
  return (
    <CardContent className="flex justify-center items-center">
      <Loader2 className="size-8 animate-spin" />
    </CardContent>
  );
}

function ConfirmError() {
  return (
    <>
      <CardContent>
        <GenericAlert {...INVALID_CONFIRM_SIGNUP_CODE} />
      </CardContent>
      <CardFooter className="text-sm flex justify-center">
        <Link to="/signup" className="text-sm text-primary hover:underline cursor-default">
          Request another link
        </Link>
      </CardFooter>
    </>
  );
}

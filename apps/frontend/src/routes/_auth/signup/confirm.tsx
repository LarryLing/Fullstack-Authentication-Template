import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import z from "zod";

import { GenericAlert } from "@/components/GenericAlert";
import { CardContent, CardFooter } from "@/components/ui/card";
import { INVALID_CONFIRM_SIGNUP_CODE } from "@/constants/alert-messages";
import { confirmSignup } from "@/features/auth/auth.api";
import { AUTH_QUERY_KEY, CONFIRM_SIGNUP_QUERY_KEY } from "@/features/auth/auth.constants";

const confirmSignupSearchSchema = z.object({
  code: z.coerce.string(),
});

export const Route = createFileRoute("/_auth/signup/confirm")({
  validateSearch: confirmSignupSearchSchema,
  beforeLoad: ({ search }) => {
    if (!search.code) {
      throw redirect({ to: "/auth/login" });
    }
  },
  component: Confirm,
});

function Confirm() {
  const { code } = Route.useSearch();

  const { isPending, isSuccess } = useQuery({
    queryKey: [CONFIRM_SIGNUP_QUERY_KEY],
    queryFn: () => confirmSignup(code),
    retry: false,
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({ queryKey: [AUTH_QUERY_KEY] });
      navigate({ to: "/" });
    }
  }, [isSuccess, navigate, queryClient]);

  if (isPending) {
    return (
      <CardContent className="flex justify-center items-center">
        <Loader2 className="size-8 animate-spin" />
      </CardContent>
    );
  }

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

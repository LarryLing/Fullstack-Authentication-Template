import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import z from "zod";

import { CardContent, CardFooter } from "@/components/ui/card";
import queryClient from "@/config/query-client";
import { confirmSignup } from "@/features/auth/auth.api";
import { AUTH_QUERY_KEY, CONFIRM_SIGNUP_QUERY_KEY } from "@/features/auth/auth.constants";
import { AuthAlert } from "@/features/auth/components/AuthAlert";

const confirmSignupSearchSchema = z.object({
  code: z.string(),
});

export const Route = createFileRoute("/auth/signup/confirm")({
  validateSearch: confirmSignupSearchSchema,
  component: Confirm,
});

function Confirm() {
  const { code } = Route.useSearch();

  const { isPending, isSuccess } = useQuery({
    queryKey: [CONFIRM_SIGNUP_QUERY_KEY],
    queryFn: () => confirmSignup(code),
    enabled: !!code,
    retry: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({ queryKey: [AUTH_QUERY_KEY] });
      navigate({ to: "/" });
    }
  }, [isSuccess, navigate]);

  if (isPending) {
    return (
      <CardContent>
        <Loader2 className="size-8 animate-spin" />
      </CardContent>
    );
  }

  return (
    <>
      <CardContent>
        <AuthAlert
          variant="destructive"
          title="Failed to confirm signup"
          description="The link is either invalid or expired."
        />
      </CardContent>
      <CardFooter className="text-sm flex justify-center">
        <Link to="/auth/signup" className="text-sm text-primary hover:underline cursor-default">
          Request another link
        </Link>
      </CardFooter>
    </>
  );
}

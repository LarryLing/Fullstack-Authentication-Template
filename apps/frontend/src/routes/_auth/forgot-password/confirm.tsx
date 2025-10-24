import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import z from "zod";

import { GenericAlert } from "@/components/GenericAlert";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { confirmForgotPassword } from "@/features/auth/auth.api";
import {
  INVALID_PASSWORD_RESET_CODE,
  RESET_PASSWORD_QUERY_KEY,
  SUCCESSFUL_PASSWORD_RESET,
} from "@/features/auth/auth.constants";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";
import { useResetPasswordForm } from "@/features/auth/hooks/use-reset-password-form";

const confirmForgotPasswordSearchSchema = z.object({
  code: z.coerce.string(),
});

export const Route = createFileRoute("/_auth/forgot-password/confirm")({
  validateSearch: confirmForgotPasswordSearchSchema,
  beforeLoad: ({ search }) => {
    if (!search.code) {
      throw redirect({ to: "/login" });
    }
  },
  loaderDeps: ({ search: { code } }) => ({ code }),
  loader: async ({ deps: { code }, context }) => {
    return await context.queryClient.fetchQuery({
      queryKey: [RESET_PASSWORD_QUERY_KEY, code],
      queryFn: () => confirmForgotPassword(code),
      staleTime: Infinity,
    });
  },
  component: Confirm,
  pendingComponent: ConfirmPending,
  errorComponent: ConfirmError,
});

function Confirm() {
  const { user_id } = Route.useLoaderData();

  const resetPasswordForm = useResetPasswordForm(user_id);
  const { isPending: isResetPasswordPending, isSuccess: isResetPasswordSuccess } = resetPasswordForm;

  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Almost there!</CardTitle>
        <CardDescription>Enter your new password below to continue.</CardDescription>
      </CardHeader>
      <CardContent>
        {isResetPasswordSuccess ? (
          <GenericAlert {...SUCCESSFUL_PASSWORD_RESET} />
        ) : (
          <ResetPasswordForm {...resetPasswordForm} />
        )}
      </CardContent>
      <CardFooter className="text-sm flex justify-center">
        {isResetPasswordSuccess ? (
          <Link to="/login" className="text-sm text-primary hover:underline cursor-default">
            Return to login
          </Link>
        ) : (
          <Link
            to="/forgot-password"
            className="text-sm text-primary hover:underline cursor-default"
            disabled={isResetPasswordPending}
          >
            Request another link
          </Link>
        )}
      </CardFooter>
    </>
  );
}

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
        <GenericAlert {...INVALID_PASSWORD_RESET_CODE} />
      </CardContent>
      <CardFooter className="text-sm flex justify-center">
        <Link to="/forgot-password" className="text-sm text-primary hover:underline cursor-default">
          Request another link
        </Link>
      </CardFooter>
    </>
  );
}

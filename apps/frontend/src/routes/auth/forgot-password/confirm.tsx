import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import z from "zod";

import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { confirmForgotPassword } from "@/features/auth/auth.api";
import { RESET_PASSWORD_QUERY_KEY } from "@/features/auth/auth.constants";
import { AuthAlert } from "@/features/auth/components/auth.alert";
import { ResetPasswordForm } from "@/features/auth/components/reset-password.form";
import { useResetPasswordForm } from "@/features/auth/hooks/use-reset-password-form";

const confirmForgotPasswordSearchSchema = z.object({
  code: z.string().catch(""),
});

export const Route = createFileRoute("/auth/forgot-password/confirm")({
  validateSearch: confirmForgotPasswordSearchSchema,
  component: Confirm,
});

function Confirm() {
  const { code } = Route.useSearch();

  const {
    data,
    isPending: isConfirmPending,
    isError: isConfirmError,
  } = useQuery({
    queryKey: [RESET_PASSWORD_QUERY_KEY],
    queryFn: () => confirmForgotPassword(code),
    staleTime: Infinity,
  });

  const resetPasswordForm = useResetPasswordForm(data?.user_id);
  const { isPending: isResetPasswordPending, isSuccess: isResetPasswordSuccess } = resetPasswordForm;

  if (isConfirmPending) {
    return (
      <CardContent>
        <Loader2 className="size-8 animate-spin" />
      </CardContent>
    );
  }

  if (isConfirmError) {
    return (
      <>
        <CardContent>
          <AuthAlert
            variant="destructive"
            title="Failed to confirm password reset code"
            description="The link is either invalid or expired."
          />
        </CardContent>
        <CardFooter className="text-sm flex justify-center">
          <Link to="/auth/forgot-password" className="text-sm text-primary hover:underline cursor-default">
            Request another link
          </Link>
        </CardFooter>
      </>
    );
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Almost there!</CardTitle>
        <CardDescription>Enter your new password below to continue.</CardDescription>
      </CardHeader>
      <CardContent>
        {isResetPasswordSuccess ? (
          <AuthAlert variant="default" title="Success!" description="Your password has been successfully reset." />
        ) : (
          <ResetPasswordForm {...resetPasswordForm} />
        )}
      </CardContent>
      <CardFooter className="text-sm flex justify-center">
        {isResetPasswordSuccess ? (
          <Link to="/auth/login" className="text-sm text-primary hover:underline cursor-default">
            Go to login
          </Link>
        ) : (
          <Link
            to="/auth/forgot-password"
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

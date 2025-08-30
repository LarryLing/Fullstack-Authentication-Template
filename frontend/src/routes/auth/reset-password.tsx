import { createFileRoute, Link } from "@tanstack/react-router";
import z from "zod";

import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthAlert } from "@/features/auth/components/auth.alert";
import { ResetPasswordForm } from "@/features/auth/components/reset-password.form";
import { useResetPasswordForm } from "@/features/auth/hooks/use-reset-password-form";

const confirmForgotPasswordSearchSchema = z.object({
  code: z.string(),
});

export const Route = createFileRoute("/auth/reset-password")({
  validateSearch: confirmForgotPasswordSearchSchema,
  component: Confirm,
});

function Confirm() {
  const { code } = Route.useSearch();

  const useResetPasswordFormReturn = useResetPasswordForm(code);

  const { isPending, isSuccess } = useResetPasswordFormReturn;

  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Almost there!</CardTitle>
        <CardDescription>Enter your new password below to finish resetting your password.</CardDescription>
      </CardHeader>
      <CardContent>
        {isSuccess ? (
          <AuthAlert variant="default" title="Success!" description="Your password has been successfully reset." />
        ) : (
          <ResetPasswordForm {...useResetPasswordFormReturn} />
        )}
      </CardContent>
      {isSuccess && (
        <CardFooter className="text-sm flex justify-center">
          <p>
            Go back to{" "}
            <Link to="/auth/login" className="text-sm text-primary hover:underline cursor-default" disabled={isPending}>
              Login
            </Link>
          </p>
        </CardFooter>
      )}
    </>
  );
}

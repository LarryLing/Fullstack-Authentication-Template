import { createFileRoute, Link } from "@tanstack/react-router";

import { GenericAlert } from "@/components/GenericAlert";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AUTH_ALERT_MESSAGES } from "@/constants/alert-messages";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";
import { useForgotPasswordForm } from "@/features/auth/hooks/use-forgot-password-form";

export const Route = createFileRoute("/_auth/forgot-password/")({
  component: ForgotPassword,
});

function ForgotPassword() {
  const useForgotPasswordFormReturn = useForgotPasswordForm();

  const { isPending, isSuccess } = useForgotPasswordFormReturn;

  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Forgot your password?</CardTitle>
        <CardDescription>No worries! Enter your email below to receive a link to reset your password.</CardDescription>
      </CardHeader>
      <CardContent>
        {isSuccess ? (
          <GenericAlert {...AUTH_ALERT_MESSAGES.SUCCESSFUL_PASSWORD_RESET_SEND} />
        ) : (
          <ForgotPasswordForm {...useForgotPasswordFormReturn} />
        )}
      </CardContent>
      <CardFooter className="text-sm flex justify-center">
        <p>
          Go back to{" "}
          <Link to="/login" className="text-sm text-primary hover:underline cursor-default" disabled={isPending}>
            Login
          </Link>{" "}
          or{" "}
          <Link to="/signup" className="text-sm text-primary hover:underline cursor-default" disabled={isPending}>
            Sign Up
          </Link>
        </p>
      </CardFooter>
    </>
  );
}

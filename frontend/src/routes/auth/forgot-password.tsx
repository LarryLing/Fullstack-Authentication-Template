import { createFileRoute, Link } from "@tanstack/react-router";

import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthAlert } from "@/features/auth/components/auth-alert";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { useForgotPasswordForm } from "@/features/auth/hooks/use-forgot-password.form";

export const Route = createFileRoute("/auth/forgot-password")({
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
          <AuthAlert
            variant="default"
            title="Success!"
            description="A password reset email has been sent to your email address."
          />
        ) : (
          <ForgotPasswordForm {...useForgotPasswordFormReturn} />
        )}
      </CardContent>
      <CardFooter className="text-sm flex justify-center">
        <p>
          Go back to{" "}
          <Link to="/auth/login" className="text-sm text-primary hover:underline cursor-default" disabled={isPending}>
            Login
          </Link>{" "}
          or{" "}
          <Link to="/auth/signup" className="text-sm text-primary hover:underline cursor-default" disabled={isPending}>
            Sign Up
          </Link>
        </p>
      </CardFooter>
    </>
  );
}

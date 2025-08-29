import { createFileRoute } from "@tanstack/react-router";

import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResetPasswordForm } from "@/features/auth/components/reset-password";

export const Route = createFileRoute("/_auth/reset-password")({
  component: ResetPassword,
});

function ResetPassword() {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Forgot your password?</CardTitle>
        <CardDescription>No worries! Enter the code we sent to your email to reset your password.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm />
      </CardContent>
    </>
  );
}

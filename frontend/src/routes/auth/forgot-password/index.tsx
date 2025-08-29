import { createFileRoute } from "@tanstack/react-router";

import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export const Route = createFileRoute("/auth/forgot-password/")({
  component: ForgotPassword,
});

function ForgotPassword() {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Forgot your password?</CardTitle>
        <CardDescription>No worries! Enter your email below to receive a link to reset your password.</CardDescription>
      </CardHeader>
      <CardContent>
        <ForgotPasswordForm />
      </CardContent>
    </>
  );
}

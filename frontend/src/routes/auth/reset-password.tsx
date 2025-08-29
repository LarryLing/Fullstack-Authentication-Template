import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResetPasswordForm } from "@/features/auth/components/reset-password";

const confirmForgotPasswordSearchSchema = z.object({
  code: z.string(),
});

export const Route = createFileRoute("/auth/reset-password")({
  validateSearch: confirmForgotPasswordSearchSchema,
  component: Confirm,
});

function Confirm() {
  const { code } = Route.useSearch();

  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Almost there!</CardTitle>
        <CardDescription>Enter your new password below to finish resetting your password.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm code={code} />
      </CardContent>
    </>
  );
}

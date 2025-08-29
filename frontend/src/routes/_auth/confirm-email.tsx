import { createFileRoute } from "@tanstack/react-router";

import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmEmailForm } from "@/features/auth/components/confirm-email-form";

export const Route = createFileRoute("/_auth/confirm-email")({
  component: ConfirmEmail,
});

function ConfirmEmail() {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Almost there!</CardTitle>
        <CardDescription>Enter the code we sent to your email to finish creating your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <ConfirmEmailForm />
      </CardContent>
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";

import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailForm } from "@/features/auth/components/email-form";

export const Route = createFileRoute("/_auth/email")({
  component: Email,
});

function Email() {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Let's get started!</CardTitle>
        <CardDescription>Enter your email to continue.</CardDescription>
      </CardHeader>
      <CardContent>
        <EmailForm />
      </CardContent>
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";

import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignUpForm } from "@/features/auth/components/signup-form";

export const Route = createFileRoute("/_auth/signup-form")({
  component: SignUp,
});

function SignUp() {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Hello there!</CardTitle>
        <CardDescription>Looks like you're new here. Let's create an account!</CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
      </CardContent>
    </>
  );
}

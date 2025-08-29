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
        <CardTitle className="text-xl font-semibold">Create an account</CardTitle>
        <CardDescription>We couldn't find an account with that email. Let's create one!</CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
      </CardContent>
    </>
  );
}

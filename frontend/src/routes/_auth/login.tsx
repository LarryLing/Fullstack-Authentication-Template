import { createFileRoute } from "@tanstack/react-router";

import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/features/auth/components/login-form";

export const Route = createFileRoute("/_auth/login")({
  component: Login,
});

function Login() {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Login to your account</CardTitle>
        <CardDescription>Enter your password to finish logging in.</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </>
  );
}

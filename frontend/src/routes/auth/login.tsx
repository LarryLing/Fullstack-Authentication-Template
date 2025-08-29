import { createFileRoute } from "@tanstack/react-router";

import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/features/auth/components/login-form";

export const Route = createFileRoute("/auth/login")({
  component: Login,
});

function Login() {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Welcome back!</CardTitle>
        <CardDescription>Enter your credentials to log in.</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import z from "zod";

import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { useLoginForm } from "@/features/auth/hooks/use-login-form";

const loginSearchSchema = z.object({
  redirect: z.string().optional().catch(""),
});

export const Route = createFileRoute("/_auth/login")({
  validateSearch: loginSearchSchema,
  component: Login,
});

function Login() {
  const { redirect } = Route.useSearch();

  const useLoginFormReturn = useLoginForm(redirect);

  const { isPending } = useLoginFormReturn;

  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Welcome back!</CardTitle>
        <CardDescription>Enter your credentials to log in.</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm {...useLoginFormReturn} />
      </CardContent>
      <CardFooter className="text-sm flex justify-center">
        <p>
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-sm text-primary hover:underline cursor-default" disabled={isPending}>
            Sign Up
          </Link>
        </p>
      </CardFooter>
    </>
  );
}

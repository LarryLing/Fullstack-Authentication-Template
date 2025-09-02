import { createFileRoute, Link } from "@tanstack/react-router";

import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthAlert } from "@/features/auth/components/auth.alert";
import { SignUpForm } from "@/features/auth/components/signup.form";
import { useSignUpForm } from "@/features/auth/hooks/use-signup-form";

export const Route = createFileRoute("/auth/signup/")({
  component: SignUp,
});

function SignUp() {
  const useSignUpFormReturn = useSignUpForm();

  const { isPending, isSuccess } = useSignUpFormReturn;

  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Welcome!</CardTitle>
        <CardDescription>Looks like you&apos;re new here. Let&apos;s create an account!</CardDescription>
      </CardHeader>
      <CardContent>
        {isSuccess ? (
          <AuthAlert
            variant="default"
            title="Success!"
            description="A signup email has been sent to your email address."
          />
        ) : (
          <SignUpForm {...useSignUpFormReturn} />
        )}
      </CardContent>
      <CardFooter className="text-sm flex justify-center">
        <p>
          Already have an account?{" "}
          <Link to="/auth/login" className="text-sm text-primary hover:underline cursor-default" disabled={isPending}>
            Login
          </Link>
        </p>
      </CardFooter>
    </>
  );
}

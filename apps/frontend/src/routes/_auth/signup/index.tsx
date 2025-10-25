import { createFileRoute, Link } from "@tanstack/react-router";

import { GenericAlert } from "@/components/GenericAlert";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AUTH_ALERT_MESSAGES } from "@/constants/alert-messages";
import { SignUpForm } from "@/features/auth/components/SignUpForm";
import { useSignUpForm } from "@/features/auth/hooks/use-signup-form";

export const Route = createFileRoute("/_auth/signup/")({
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
          <GenericAlert {...AUTH_ALERT_MESSAGES.SUCCESSFUL_SIGNUP_EMAIL_SEND} />
        ) : (
          <SignUpForm {...useSignUpFormReturn} />
        )}
      </CardContent>
      <CardFooter className="text-sm flex justify-center">
        <p>
          Already have an account?{" "}
          <Link to="/login" className="text-sm text-primary hover:underline cursor-default" disabled={isPending}>
            Login
          </Link>
        </p>
      </CardFooter>
    </>
  );
}

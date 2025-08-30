import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import z from "zod";

import { CardContent, CardFooter } from "@/components/ui/card";
import { confirmSignup } from "@/features/auth/auth.api";
import { AuthAlert } from "@/features/auth/components/auth.alert";

const confirmSignupSearchSchema = z.object({
  code: z.string(),
});

export const Route = createFileRoute("/auth/signup/confirm")({
  validateSearch: confirmSignupSearchSchema,
  component: Confirm,
});

function Confirm() {
  const { code } = Route.useSearch();

  const { isPending, isSuccess } = useQuery({
    queryKey: ["confirm-signup", code],
    queryFn: () => confirmSignup(code),
  });

  return (
    <>
      <CardContent>
        {isPending ? (
          <Loader2 className="size-6 animate-spin" />
        ) : (
          <AuthAlert
            variant={isSuccess ? "default" : "destructive"}
            title={isSuccess ? "Success" : "Failed to confirm account"}
            description={
              isSuccess
                ? "Your account has been confirmed. You can now continue to the app."
                : "The link is either invalid or expired."
            }
          />
        )}
      </CardContent>
      <CardFooter className="text-sm flex justify-center">
        {isSuccess ? (
          <Link to="/" className="text-sm text-primary hover:underline cursor-default">
            Continue to app
          </Link>
        ) : (
          <Link to="/auth/login" className="text-sm text-primary hover:underline cursor-default">
            Request another link
          </Link>
        )}
      </CardFooter>
    </>
  );
}

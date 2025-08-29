import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { confirmSignup } from "@/features/auth/auth.api";

const confirmSignupSearchSchema = z.object({
  code: z.string(),
});

export const Route = createFileRoute("/auth/signup/confirm")({
  validateSearch: confirmSignupSearchSchema,
  component: Confirm,
});

function Confirm() {
  const { code } = Route.useSearch();

  const { isPending, isError } = useQuery({
    queryKey: ["confirm-signup", code],
    queryFn: () => confirmSignup(code),
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Successfully signed up!</CardTitle>
        <CardDescription>Your account has been confirmed. You can now continue to the app.</CardDescription>
      </CardHeader>
    </>
  );
}

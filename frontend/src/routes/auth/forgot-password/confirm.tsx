import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { confirmForgotPassword } from "@/features/auth/auth.api";
import { ResetPasswordForm } from "@/features/auth/components/reset-password";

const confirmForgotPasswordSearchSchema = z.object({
  code: z.string(),
});

export const Route = createFileRoute("/auth/forgot-password/confirm")({
  validateSearch: confirmForgotPasswordSearchSchema,
  component: Confirm,
});

function Confirm() {
  const { code } = Route.useSearch();

  const { data, isPending, isError } = useQuery({
    queryKey: ["confirm-forgot-password", code],
    queryFn: () => confirmForgotPassword(code),
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
        <CardTitle className="text-xl font-semibold">Almost there!</CardTitle>
        <CardDescription>Enter your new password below to finish resetting your password.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm userId={data?.user_id} />
      </CardContent>
    </>
  );
}

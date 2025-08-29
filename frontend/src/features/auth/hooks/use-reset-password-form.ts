import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { resetPassword } from "../auth.api";
import { useAuthStore } from "../auth.store";
import { resetPasswordFormSchema, type ResetPasswordFormType } from "../schemas/reset-password.schema";

export const useResetPasswordForm = () => {
  const router = useRouter();
  const { navigate, history } = router;

  const email = useAuthStore((state) => state.email);
  const reset = useAuthStore((state) => state.reset);

  const form = useForm<ResetPasswordFormType>({
    defaultValues: {
      passwordResetCode: "",
      password: "",
      confirmPassword: "",
    },
    // @ts-expect-error - zodResolver is not typed correctly
    resolver: zodResolver(resetPasswordFormSchema),
  });

  useEffect(() => {
    if (!useAuthStore.persist.hasHydrated) return;

    if (!email) {
      navigate({ to: "/auth/email", replace: true });
    }
  }, [email, navigate]);

  const { mutateAsync: resetPasswordMutationAsync, isPending } = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      reset();
      navigate({ to: "/auth/login", replace: true });
    },
    onError: (error) => {
      toast.error("Failed to reset password. Please try again.", {
        description: error.message,
      });
    },
  });

  const onSubmit = async (values: ResetPasswordFormType) => {
    if (!email) return;

    await resetPasswordMutationAsync({
      ...values,
      email,
    });
  };

  const handleBack = () => {
    history.back();
  };

  return { form, onSubmit, handleBack, isPending };
};

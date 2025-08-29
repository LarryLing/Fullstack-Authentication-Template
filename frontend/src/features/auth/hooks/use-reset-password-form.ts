import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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

  const onSubmit = (values: ResetPasswordFormType) => {
    try {
      console.log({
        ...values,
        email,
      });
      reset();
      navigate({ to: "/auth/login", replace: true });
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  };

  const handleBack = () => {
    history.back();
  };

  return { form, onSubmit, handleBack };
};

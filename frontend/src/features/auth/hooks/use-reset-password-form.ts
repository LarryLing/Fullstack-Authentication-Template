import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { authSchema } from "../schemas/auth.schema";
import { useAuthStore } from "../stores/auth.stores";

const resetPasswordFormSchema = authSchema.pick({
  passwordResetCode: true,
  password: true,
  confirmPassword: true,
});

type ResetPasswordFormType = z.infer<typeof resetPasswordFormSchema>;

export const useResetPasswordForm = () => {
  const router = useRouter();

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

  const onSubmit = (values: ResetPasswordFormType) => {
    try {
      console.log({
        ...values,
        email,
      });
      reset();
      router.navigate({ to: "/auth/login" });
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  };

  useEffect(() => {
    if (!useAuthStore.persist.hasHydrated) return;

    if (!email) {
      router.navigate({ to: "/auth/email" });
    }
  }, [email, router]);

  const handleBack = () => {
    router.history.back();
  };

  return { form, onSubmit, handleBack };
};

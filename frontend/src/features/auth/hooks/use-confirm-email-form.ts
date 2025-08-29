import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { authSchema } from "../schemas/auth.schema";
import { useAuthStore } from "../stores/auth.stores";

const confirmEmailFormSchema = authSchema.pick({
  emailConfirmationCode: true,
  password: true,
  confirmPassword: true,
});

type ConfirmEmailFormType = z.infer<typeof confirmEmailFormSchema>;

export const useConfirmEmailForm = () => {
  const router = useRouter();

  const email = useAuthStore((state) => state.email);
  const reset = useAuthStore((state) => state.reset);

  const form = useForm<ConfirmEmailFormType>({
    defaultValues: {
      emailConfirmationCode: "",
      password: "",
      confirmPassword: "",
    },
    // @ts-expect-error - zodResolver is not typed correctly
    resolver: zodResolver(confirmEmailFormSchema),
  });

  useEffect(() => {
    if (!useAuthStore.persist.hasHydrated) return;

    if (!email) {
      router.navigate({ to: "/auth/email" });
    }
  }, [email, router]);

  const onSubmit = (values: ConfirmEmailFormType) => {
    try {
      console.log({
        ...values,
        email,
      });
      reset();
      router.navigate({ to: "/" });
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  };

  const handleBack = () => {
    router.history.back();
  };

  return { form, onSubmit, handleBack };
};

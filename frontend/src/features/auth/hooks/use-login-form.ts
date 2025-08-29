import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { authSchema } from "../schemas/auth.schema";
import { useAuthStore } from "../stores/auth.stores";

const loginFormSchema = authSchema.pick({
  password: true,
});

type LoginFormType = z.infer<typeof loginFormSchema>;

export const useLoginForm = () => {
  const router = useRouter();

  const email = useAuthStore((state) => state.email);
  const reset = useAuthStore((state) => state.reset);

  const form = useForm<LoginFormType>({
    defaultValues: {
      password: "",
    },
    // @ts-expect-error - zodResolver is not typed correctly
    resolver: zodResolver(loginFormSchema),
  });

  useEffect(() => {
    if (!useAuthStore.persist.hasHydrated) return;

    if (!email) {
      router.navigate({ to: "/auth/email" });
    }
  }, [email, router]);

  const onSubmit = (values: LoginFormType) => {
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

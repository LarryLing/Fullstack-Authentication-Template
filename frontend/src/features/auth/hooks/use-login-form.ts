import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useAuthStore } from "../auth.store";
import { loginFormSchema, type LoginFormType } from "../schemas/login.schema";

export const useLoginForm = () => {
  const router = useRouter();
  const { navigate, history } = router;

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
      navigate({ to: "/auth/email", replace: true });
    }
  }, [email, navigate]);

  const onSubmit = (values: LoginFormType) => {
    try {
      console.log({
        ...values,
        email,
      });
      reset();
      navigate({ to: "/" });
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

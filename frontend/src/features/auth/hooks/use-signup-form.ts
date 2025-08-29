import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useAuthStore } from "../auth.store";
import { signUpFormSchema, type SignUpFormType } from "../schemas/signup.schema";

export const useSignUpForm = () => {
  const router = useRouter();
  const { navigate, history } = router;

  const email = useAuthStore((state) => state.email);

  const form = useForm<SignUpFormType>({
    defaultValues: {
      firstName: "",
      lastName: "",
    },
    // @ts-expect-error - zodResolver is not typed correctly
    resolver: zodResolver(signUpFormSchema),
  });

  useEffect(() => {
    if (!useAuthStore.persist.hasHydrated) return;

    if (!email) {
      navigate({ to: "/auth/email" });
    }
  }, [email, navigate]);

  const onSubmit = (values: SignUpFormType) => {
    try {
      console.log({
        ...values,
        email,
      });
      navigate({ to: "/auth/confirm-email" });
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

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { authSchema } from "../schemas/auth.schema";
import { useAuthStore } from "../stores/auth.stores";

const signUpFormSchema = authSchema.pick({
  firstName: true,
  lastName: true,
});

type SignUpFormType = z.infer<typeof signUpFormSchema>;

export const useSignUpForm = () => {
  const router = useRouter();

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
      router.navigate({ to: "/auth/email" });
    }
  }, [email, router]);

  const onSubmit = (values: SignUpFormType) => {
    try {
      console.log({
        ...values,
        email,
      });
      router.navigate({ to: "/auth/confirm-email" });
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

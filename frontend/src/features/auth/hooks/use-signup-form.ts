import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { signup } from "../auth.api";
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

  const { mutateAsync: signupMutationAsync, isPending } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      navigate({ to: "/auth/confirm-email" });
    },
    onError: (error) => {
      toast.error("Failed to signup. Please try again.", {
        description: error.message,
      });
    },
  });

  const onSubmit = async (values: SignUpFormType) => {
    if (!email) return;

    await signupMutationAsync({
      ...values,
      email,
    });
  };

  const handleBack = () => {
    history.back();
  };

  return { form, onSubmit, handleBack, isPending };
};

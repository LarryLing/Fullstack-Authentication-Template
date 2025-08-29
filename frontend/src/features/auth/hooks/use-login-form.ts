import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { login } from "../auth.api";
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

  const { mutateAsync: loginMutationAsync, isPending } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      reset();
      navigate({ to: "/" });
    },
    onError: (error) => {
      toast.error("Failed to login. Please try again.", {
        description: error.message,
      });
    },
  });

  const onSubmit = async (values: LoginFormType) => {
    if (!email) return;

    await loginMutationAsync({
      ...values,
      email,
    });
  };

  const handleBack = () => {
    history.back();
  };

  return { form, onSubmit, handleBack, isPending };
};

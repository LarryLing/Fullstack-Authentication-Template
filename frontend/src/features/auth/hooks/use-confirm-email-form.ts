import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { confirmEmail } from "../auth.api";
import { useAuthStore } from "../auth.store";
import { confirmEmailFormSchema, type ConfirmEmailFormType } from "../schemas/confirm-email.schema";

export const useConfirmEmailForm = () => {
  const router = useRouter();
  const { navigate, history } = router;

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
      navigate({ to: "/auth/email" });
    }
  }, [email, navigate]);

  const { mutateAsync: confirmEmailMutationAsync, isPending } = useMutation({
    mutationFn: confirmEmail,
    onSuccess: () => {
      reset();
      navigate({ to: "/" });
    },
    onError: (error) => {
      toast.error("Failed to confirm email. Please try again.", {
        description: error.message,
      });
    },
  });

  const onSubmit = async (values: ConfirmEmailFormType) => {
    if (!email) return;

    await confirmEmailMutationAsync({
      ...values,
      email,
    });
  };

  const handleBack = () => {
    history.back();
  };

  return { form, onSubmit, handleBack, isPending };
};

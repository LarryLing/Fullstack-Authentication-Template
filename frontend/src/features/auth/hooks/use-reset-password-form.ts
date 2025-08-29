import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { User } from "@/types/user.type";

import { resetPassword } from "../auth.api";
import { resetPasswordFormSchema, type ResetPasswordFormType } from "../schemas/reset-password.schema";

export const useResetPasswordForm = (userId: User["id"]) => {
  const router = useRouter();

  const form = useForm<ResetPasswordFormType>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    // @ts-expect-error - zodResolver is not typed correctly
    resolver: zodResolver(resetPasswordFormSchema),
  });

  const { mutateAsync: resetPasswordMutationAsync, isPending } = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      router.navigate({ to: "/auth/login", replace: true });
    },
    onError: (error) => {
      toast.error("Failed to reset password. Please try again.", {
        description: error.message,
      });
    },
  });

  const onSubmit = async (values: ResetPasswordFormType) => {
    await resetPasswordMutationAsync({
      ...values,
      id: userId,
    });
  };

  const handleBack = () => {
    router.history.back();
  };

  return { form, onSubmit, handleBack, isPending };
};

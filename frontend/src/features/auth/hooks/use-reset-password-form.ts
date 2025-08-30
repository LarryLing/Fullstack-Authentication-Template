import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import type AuthError from "@/errors/auth-error";

import { resetPassword } from "../auth.api";
import { resetPasswordFormSchema, type ResetPasswordFormType } from "../schemas/reset-password.schema";

export type UseResetPasswordFormReturnType = {
  form: UseFormReturn<ResetPasswordFormType>;
  onSubmit: (data: ResetPasswordFormType) => void;
  isPending: boolean;
  isSuccess: boolean;
};

export const useResetPasswordForm = (code: string): UseResetPasswordFormReturnType => {
  const form = useForm<ResetPasswordFormType>({
    defaultValues: {
      password: "",
      confirm_password: "",
    },
    // @ts-expect-error - zodResolver is not typed correctly
    resolver: zodResolver(resetPasswordFormSchema),
  });

  const {
    mutateAsync: resetPasswordMutationAsync,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: resetPassword,
    onError: (error: AuthError) => {
      toast.error("Failed to reset password", {
        description: error.message,
      });
    },
  });

  const onSubmit = async (values: ResetPasswordFormType) => {
    await resetPasswordMutationAsync({ ...values, code });
  };

  return { form, onSubmit, isPending, isSuccess };
};

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import type AuthError from "@/errors/auth-error";

import { forgotPassword } from "../auth.api";
import { forgotPasswordFormSchema, type ForgotPasswordFormType } from "../schemas/forgot-password.schema";

export type UseForgotPasswordFormReturnType = {
  form: UseFormReturn<ForgotPasswordFormType>;
  onSubmit: (data: ForgotPasswordFormType) => void;
  isPending: boolean;
  isSuccess: boolean;
};

export const useForgotPasswordForm = (): UseForgotPasswordFormReturnType => {
  const form = useForm<ForgotPasswordFormType>({
    defaultValues: {
      email: "",
    },
    // @ts-expect-error - zodResolver is not typed correctly
    resolver: zodResolver(forgotPasswordFormSchema),
  });

  const {
    mutateAsync: forgotPasswordMutationaAsync,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: forgotPassword,
    onError: (error: AuthError) => {
      toast.error("Failed to send reset password email", {
        description: error.message,
      });
    },
  });

  const onSubmit = async (values: ForgotPasswordFormType) => {
    await forgotPasswordMutationaAsync(values);
  };

  return { form, onSubmit, isPending, isSuccess };
};

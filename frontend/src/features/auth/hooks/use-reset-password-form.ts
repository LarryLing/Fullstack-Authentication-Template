import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import type { User } from "@/types/user.type";

import AuthError from "@/errors/auth-error";

import { resetPassword } from "../auth.api";
import { ResetPasswordSchema, type ResetPasswordSchemaType } from "../schemas/reset-password.schema";

export type UseResetPasswordFormReturnType = {
  form: UseFormReturn<ResetPasswordSchemaType>;
  onSubmit: (data: ResetPasswordSchemaType) => void;
  isPending: boolean;
  isSuccess: boolean;
};

export const useResetPasswordForm = (user_id: User["id"] | undefined): UseResetPasswordFormReturnType => {
  const form = useForm<ResetPasswordSchemaType>({
    defaultValues: {
      password: "",
      confirm_password: "",
    },
    // @ts-expect-error - zodResolver is not typed correctly
    resolver: zodResolver(ResetPasswordSchema),
  });

  const {
    mutateAsync: resetPasswordMutationAsync,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: resetPassword,
    onError: (error) => {
      const message = error instanceof AuthError ? error.message : "An unknown error occurred";
      toast.error(message);
    },
  });

  const onSubmit = async (data: ResetPasswordSchemaType) => {
    if (!user_id) return;
    await resetPasswordMutationAsync({ ...data, id: user_id });
  };

  return { form, onSubmit, isPending, isSuccess };
};

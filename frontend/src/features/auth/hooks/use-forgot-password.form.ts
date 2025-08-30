import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import AuthError from "@/errors/auth-error";

import { forgotPassword } from "../auth.api";
import { ForgotPasswordSchema, type ForgotPasswordSchemaType } from "../schemas/forgot-password.schema";

export type UseForgotPasswordFormReturnType = {
  form: UseFormReturn<ForgotPasswordSchemaType>;
  onSubmit: (data: ForgotPasswordSchemaType) => void;
  isPending: boolean;
  isSuccess: boolean;
};

export const useForgotPasswordForm = (): UseForgotPasswordFormReturnType => {
  const form = useForm<ForgotPasswordSchemaType>({
    defaultValues: {
      email: "",
    },
    // @ts-expect-error - zodResolver is not typed correctly
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const {
    mutateAsync: forgotPasswordMutationaAsync,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: forgotPassword,
    onError: (error) => {
      const message = error instanceof AuthError ? error.message : "An unknown error occurred";
      toast.error(message);
    },
  });

  const onSubmit = async (values: ForgotPasswordSchemaType) => {
    await forgotPasswordMutationaAsync(values);
  };

  return { form, onSubmit, isPending, isSuccess };
};

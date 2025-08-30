import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import type AuthError from "@/errors/auth-error";

import { signup } from "../auth.api";
import { signUpFormSchema, type SignUpFormType } from "../schemas/signup.schema";

export type UseSignUpFormReturnType = {
  form: UseFormReturn<SignUpFormType>;
  onSubmit: (data: SignUpFormType) => void;
  isPending: boolean;
  isSuccess: boolean;
};

export const useSignUpForm = (): UseSignUpFormReturnType => {
  const form = useForm<SignUpFormType>({
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      confirm_password: "",
    },
    // @ts-expect-error - zodResolver is not typed correctly
    resolver: zodResolver(signUpFormSchema),
  });

  const {
    mutateAsync: signupMutationAsync,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: signup,
    onError: (error: AuthError) => {
      toast.error("Failed to sign up", {
        description: error.message,
      });
    },
  });

  const onSubmit = async (values: SignUpFormType) => {
    await signupMutationAsync(values);
  };

  return { form, onSubmit, isPending, isSuccess };
};

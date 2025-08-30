import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import AuthError from "@/errors/auth-error";

import { signup } from "../auth.api";
import { SignUpSchema, type SignUpSchemaType } from "../schemas/signup.schema";

export type UseSignUpFormReturnType = {
  form: UseFormReturn<SignUpSchemaType>;
  onSubmit: (data: SignUpSchemaType) => void;
  isPending: boolean;
  isSuccess: boolean;
};

export const useSignUpForm = (): UseSignUpFormReturnType => {
  const form = useForm<SignUpSchemaType>({
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      confirm_password: "",
    },
    // @ts-expect-error - zodResolver is not typed correctly
    resolver: zodResolver(SignUpSchema),
  });
  const {
    mutateAsync: signUpMutationAsync,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: signup,
    onError: (error) => {
      const message = error instanceof AuthError ? error.message : "An unknown error occurred";
      toast.error(message);
    },
  });

  const onSubmit = async (values: SignUpSchemaType) => {
    await signUpMutationAsync(values);
  };

  return { form, onSubmit, isPending, isSuccess };
};

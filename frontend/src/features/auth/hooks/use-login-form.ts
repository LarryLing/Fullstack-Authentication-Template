import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import type AuthError from "@/errors/auth-error";

import { login } from "../auth.api";
import { loginFormSchema, type LoginFormType } from "../schemas/login.schema";

export type UseLoginFormReturnType = {
  form: UseFormReturn<LoginFormType>;
  onSubmit: (data: LoginFormType) => void;
  isPending: boolean;
};

export const useLoginForm = (redirect: string | undefined): UseLoginFormReturnType => {
  const navigate = useNavigate();

  const form = useForm<LoginFormType>({
    defaultValues: {
      password: "",
    },
    // @ts-expect-error - zodResolver is not typed correctly
    resolver: zodResolver(loginFormSchema),
  });

  const { mutateAsync: loginMutationAsync, isPending } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate({ to: redirect || "/", replace: true });
    },
    onError: (error: AuthError) => {
      toast.error("Failed to login", {
        description: error.message,
      });
    },
  });

  const onSubmit = async (values: LoginFormType) => {
    await loginMutationAsync(values);
  };

  return { form, onSubmit, isPending };
};

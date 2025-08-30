import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import type AuthError from "@/errors/auth-error";

import queryClient from "@/config/query-client";

import { login } from "../auth.api";
import { AUTH } from "../contexts/auth.provider";
import { LoginSchema, type LoginSchemaType } from "../schemas/login.schema";

export type UseLoginFormReturnType = {
  form: UseFormReturn<LoginSchemaType>;
  onSubmit: (data: LoginSchemaType) => void;
  isPending: boolean;
};

export const useLoginForm = (redirect: string | undefined): UseLoginFormReturnType => {
  const navigate = useNavigate();

  const form = useForm<LoginSchemaType>({
    defaultValues: {
      password: "",
    },
    // @ts-expect-error - zodResolver is not typed correctly
    resolver: zodResolver(LoginSchema),
  });

  const { mutateAsync: loginMutationAsync, isPending } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [AUTH] });
      navigate({ to: redirect || "/", replace: true });
    },
    onError: (error: AuthError) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (values: LoginSchemaType) => {
    await loginMutationAsync(values);
  };

  return { form, onSubmit, isPending };
};

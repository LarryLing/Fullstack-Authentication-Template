import AuthError from "@fullstack-template/error/auth-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { AUTH_QUERY_KEYS } from "@/constants/query-keys";

import { login } from "../auth.api";
import { LoginSchema, type LoginSchemaType } from "../schemas/login.schema";

export type UseLoginFormReturnType = {
  form: UseFormReturn<LoginSchemaType>;
  onSubmit: (data: LoginSchemaType) => void;
  isPending: boolean;
};

export const useLoginForm = (redirect: string | undefined): UseLoginFormReturnType => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<LoginSchemaType>({
    defaultValues: {
      password: "",
    },
    resolver: zodResolver(LoginSchema),
  });

  const { mutateAsync: loginMutationAsync, isPending } = useMutation({
    mutationFn: login,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [AUTH_QUERY_KEYS.USER] });
      navigate({ to: redirect || "/", replace: true });
    },
    onError: (error) => {
      const message = error instanceof AuthError ? error.message : "An unknown error occurred";
      toast.error(message);
    },
  });

  const onSubmit = async (data: LoginSchemaType) => {
    await loginMutationAsync(data);
  };

  return { form, onSubmit, isPending };
};

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { login } from "../auth.api";
import { loginFormSchema, type LoginFormType } from "../schemas/login.schema";

export const useLoginForm = () => {
  const router = useRouter();

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
      router.navigate({ to: "/", replace: true });
    },
    onError: (error) => {
      toast.error("Failed to login. Please try again.", {
        description: error.message,
      });
    },
  });

  const onSubmit = async (values: LoginFormType) => {
    await loginMutationAsync(values);
  };

  const handleBack = () => {
    router.history.back();
  };

  return { form, onSubmit, handleBack, isPending };
};

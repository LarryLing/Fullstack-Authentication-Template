import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { forgotPassword } from "../auth.api";
import { forgotPasswordFormSchema, type ForgotPasswordFormType } from "../schemas/forgot-password.schema";

export const useForgotPasswordForm = () => {
  const router = useRouter();

  const form = useForm<ForgotPasswordFormType>({
    defaultValues: {
      email: "",
    },
    // @ts-expect-error - zodResolver is not typed correctly
    resolver: zodResolver(forgotPasswordFormSchema),
  });

  const { mutateAsync: forgotPasswordMutationaAsync, isPending } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      form.reset();
      toast.success("Successfully sent reset password email", {
        description: "Please check your email for a link to reset your password",
      });
    },
    onError: (error) => {
      toast.error("Failed to send reset password email. Please try again.", {
        description: error.message,
      });
    },
  });

  const onSubmit = async (values: ForgotPasswordFormType) => {
    await forgotPasswordMutationaAsync(values);
  };

  const handleBack = () => {
    router.history.back();
  };

  return { form, onSubmit, handleBack, isPending };
};

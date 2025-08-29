import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { authSchema } from "../schemas/auth.schema";

const resetPasswordFormSchema = authSchema.pick({
  passwordResetCode: true,
  password: true,
  confirmPassword: true,
});

type ResetPasswordFormType = z.infer<typeof resetPasswordFormSchema>;

export const useResetPasswordForm = () => {
  const form = useForm<ResetPasswordFormType>({
    defaultValues: {
      passwordResetCode: "",
      password: "",
      confirmPassword: "",
    },
    // @ts-expect-error - zodResolver is not typed correctly
    resolver: zodResolver(resetPasswordFormSchema),
  });

  const onSubmit = (values: ResetPasswordFormType) => {
    try {
      console.log(values);
      toast.success("Form submitted successfully");
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  };

  return { form, onSubmit };
};

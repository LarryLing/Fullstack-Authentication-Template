import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { authSchema } from "../schemas/auth.schema";

const confirmEmailFormSchema = authSchema.pick({
  emailConfirmationCode: true,
  password: true,
  confirmPassword: true,
});

type ConfirmEmailFormType = z.infer<typeof confirmEmailFormSchema>;

export const useConfirmEmailForm = () => {
  const form = useForm<ConfirmEmailFormType>({
    defaultValues: {
      emailConfirmationCode: "",
      password: "",
      confirmPassword: "",
    },
    // @ts-expect-error - zodResolver is not typed correctly
    resolver: zodResolver(confirmEmailFormSchema),
  });

  const onSubmit = (values: ConfirmEmailFormType) => {
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

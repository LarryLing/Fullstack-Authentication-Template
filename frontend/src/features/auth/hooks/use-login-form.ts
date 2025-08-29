import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { authSchema } from "../schemas/auth.schema";

const loginFormSchema = authSchema.pick({
  password: true,
});

type LoginFormType = z.infer<typeof loginFormSchema>;

export const useLoginForm = () => {
  const form = useForm<LoginFormType>({
    defaultValues: {
      password: "",
    },
    // @ts-expect-error - zodResolver is not typed correctly
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit = (values: LoginFormType) => {
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

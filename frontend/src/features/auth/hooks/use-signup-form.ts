import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { authSchema } from "../schemas/auth.schema";

const signUpFormSchema = authSchema.pick({
  firstName: true,
  lastName: true,
});

type SignUpFormType = z.infer<typeof signUpFormSchema>;

export const useSignUpForm = () => {
  const form = useForm<SignUpFormType>({
    defaultValues: {
      firstName: "",
      lastName: "",
    },
    // @ts-expect-error - zodResolver is not typed correctly
    resolver: zodResolver(signUpFormSchema),
  });

  const onSubmit = (values: SignUpFormType) => {
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

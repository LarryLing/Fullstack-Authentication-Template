import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { authSchema } from "../schemas/auth.schema";
import { useAuthStore } from "../stores/auth.stores";

const emailFormSchema = authSchema.pick({
  email: true,
});

type EmailFormType = z.infer<typeof emailFormSchema>;

export const useEmailForm = () => {
  const router = useRouter();

  const setData = useAuthStore((state) => state.setData);

  const form = useForm<EmailFormType>({
    defaultValues: {
      email: "",
    },
    // @ts-expect-error - zodResolver is not typed correctly
    resolver: zodResolver(emailFormSchema),
  });

  const onSubmit = (values: EmailFormType) => {
    try {
      console.log({
        ...values,
      });
      setData(values);
      router.navigate({ to: "/login" });
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  };

  return { form, onSubmit };
};

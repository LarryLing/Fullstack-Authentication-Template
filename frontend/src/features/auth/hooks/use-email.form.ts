import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useAuthStore } from "../auth.store";
import { emailFormSchema, type EmailFormType } from "../schemas/email.schema";

export const useEmailForm = () => {
  const router = useRouter();
  const { navigate } = router;

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
      navigate({ to: "/auth/login" });
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  };

  const handleBack = () => {
    navigate({ to: "/" });
  };

  return { form, onSubmit, handleBack };
};

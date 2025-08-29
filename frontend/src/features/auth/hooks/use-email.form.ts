import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { email } from "../auth.api";
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

  const { mutateAsync: emailMutationAsync, isPending } = useMutation({
    mutationFn: email,
    onSuccess: (_data, variables) => {
      setData(variables);
      navigate({ to: "/auth/login" });
    },
    onError: (error) => {
      toast.error("Failed to get email. Please try again.", {
        description: error.message,
      });
    },
  });

  const onSubmit = async (values: EmailFormType) => {
    await emailMutationAsync(values);
  };

  const handleBack = () => {
    navigate({ to: "/" });
  };

  return { form, onSubmit, handleBack, isPending };
};

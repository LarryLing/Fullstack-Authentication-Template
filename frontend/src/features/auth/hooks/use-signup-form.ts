import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { signup } from "../auth.api";
import { signUpFormSchema, type SignUpFormType } from "../schemas/signup.schema";

export const useSignUpForm = () => {
  const router = useRouter();

  const form = useForm<SignUpFormType>({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
    // @ts-expect-error - zodResolver is not typed correctly
    resolver: zodResolver(signUpFormSchema),
  });

  const { mutateAsync: signupMutationAsync, isPending } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      form.reset();
      toast.success("Successfully signed up!", {
        description: "Please check your email to confirm your account",
      });
    },
    onError: (error) => {
      toast.error("Failed to signup. Please try again.", {
        description: error.message,
      });
    },
  });

  const onSubmit = async (values: SignUpFormType) => {
    await signupMutationAsync(values);
  };

  const handleBack = () => {
   router.history.back();
  };

  return { form, onSubmit, handleBack, isPending };
};

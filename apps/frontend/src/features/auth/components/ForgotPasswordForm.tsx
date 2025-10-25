import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PLACEHOLDERS } from "@/constants/placeholders";

import { type UseForgotPasswordFormReturnType } from "../hooks/use-forgot-password-form";

type ForgotPasswordFormProps = Pick<UseForgotPasswordFormReturnType, "form" | "onSubmit" | "isPending">;

export const ForgotPasswordForm = ({ form, onSubmit, isPending }: ForgotPasswordFormProps) => {
  const { handleSubmit, control } = form;

  return (
    <Form {...form}>
      <form className="flex flex-col items-center gap-y-5" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder={PLACEHOLDERS.EMAIL} {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Continue"}
        </Button>
      </form>
    </Form>
  );
};

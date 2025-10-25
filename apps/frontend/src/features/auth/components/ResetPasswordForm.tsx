import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PLACEHOLDERS } from "@/constants/placeholders";

import { type UseResetPasswordFormReturnType } from "../hooks/use-reset-password-form";

type ResetPasswordFormProps = Pick<UseResetPasswordFormReturnType, "form" | "onSubmit" | "isPending">;

export const ResetPasswordForm = ({ form, onSubmit, isPending }: ResetPasswordFormProps) => {
  const { handleSubmit, control } = form;

  return (
    <Form {...form}>
      <form className="flex flex-col items-center gap-y-5" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder={PLACEHOLDERS.PASSWORD} type="password" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input placeholder={PLACEHOLDERS.PASSWORD} type="password" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reset Password"}
        </Button>
      </form>
    </Form>
  );
};

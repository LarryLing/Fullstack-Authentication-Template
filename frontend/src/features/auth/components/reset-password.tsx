import { useRouter } from "@tanstack/react-router";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

import { useResetPasswordForm } from "../hooks/use-reset-password-form";

export const ResetPasswordForm = () => {
  const router = useRouter();

  const { form, onSubmit } = useResetPasswordForm();

  const { handleSubmit, control } = form;

  const handleBack = () => {
    router.history.back();
  };

  return (
    <Form {...form}>
      <form className="flex flex-col items-center gap-y-5" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          control={control}
          name="passwordResetCode"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Password Reset Code</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field} pattern={REGEXP_ONLY_DIGITS}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="••••••••" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input placeholder="••••••••" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row-reverse gap-x-2 w-full">
          <Button type="submit">Reset Password</Button>
          <Button variant="outline" type="button" onClick={handleBack}>
            Back
          </Button>
        </div>
      </form>
    </Form>
  );
};

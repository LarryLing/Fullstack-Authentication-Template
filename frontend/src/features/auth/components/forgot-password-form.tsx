import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useForgotPasswordForm } from "../hooks/use-forgot-password.form";

export const ForgotPasswordForm = () => {
  const { form, onSubmit, handleBack, isPending } = useForgotPasswordForm();

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
                <Input placeholder="m@example.com" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row-reverse gap-x-2 w-full">
          <Button type="submit" disabled={isPending}>
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Continue"}
          </Button>
          <Button variant="outline" type="button" onClick={handleBack} disabled={isPending}>
            Back
          </Button>
        </div>
      </form>
    </Form>
  );
};

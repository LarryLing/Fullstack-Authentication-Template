import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useLoginForm } from "../hooks/use-login-form";

export const LoginForm = () => {
  const { form, onSubmit, handleBack, isPending } = useLoginForm();

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
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full">
              <div className="flex justify-between">
                <FormLabel>Password</FormLabel>
                <Link to="/auth/forgot-password" className="text-sm text-primary hover:underline cursor-default">
                  Forgot password?
                </Link>
              </div>
              <FormControl>
                <Input placeholder="••••••••" type="password" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row-reverse gap-x-2 w-full">
          <Button type="submit" disabled={isPending}>
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Login"}
          </Button>
          <Button variant="outline" type="button" onClick={handleBack} disabled={isPending}>
            Back
          </Button>
        </div>
      </form>
    </Form>
  );
};

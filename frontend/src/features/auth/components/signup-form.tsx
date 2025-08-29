import { useRouter } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useSignUpForm } from "../hooks/use-signup-form";

export const SignUpForm = () => {
  const router = useRouter();

  const { form, onSubmit } = useSignUpForm();

  const { handleSubmit, control } = form;

  const handleBack = () => {
    router.history.back();
  };

  return (
    <Form {...form}>
      <form className="flex flex-col items-center gap-y-5" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          control={control}
          name="firstName"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="lastName"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row-reverse gap-x-2 w-full">
          <Button type="submit">Sign Up</Button>
          <Button variant="outline" type="button" onClick={handleBack}>
            Back
          </Button>
        </div>
      </form>
    </Form>
  );
};

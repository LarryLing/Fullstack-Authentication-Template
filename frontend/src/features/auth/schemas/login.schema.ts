import { z } from "zod";

export const LoginSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string(),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;

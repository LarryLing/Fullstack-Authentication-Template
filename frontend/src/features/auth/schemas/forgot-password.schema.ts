import { z } from "zod";

import { authSchema } from "./auth.schema";

export const forgotPasswordFormSchema = authSchema.pick({
  email: true,
});

export type ForgotPasswordFormType = z.infer<typeof forgotPasswordFormSchema>;

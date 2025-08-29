import { z } from "zod";

import { authSchema } from "./auth.schema";

export const resetPasswordFormSchema = authSchema.pick({
  passwordResetCode: true,
  password: true,
  confirmPassword: true,
});

export type ResetPasswordFormType = z.infer<typeof resetPasswordFormSchema>;

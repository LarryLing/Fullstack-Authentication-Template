import { z } from "zod";

import { authSchema } from "./auth.schema";

export const confirmEmailFormSchema = authSchema.pick({
  emailConfirmationCode: true,
  password: true,
  confirmPassword: true,
});

export type ConfirmEmailFormType = z.infer<typeof confirmEmailFormSchema>;

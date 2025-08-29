import { z } from "zod";

import { authSchema } from "./auth.schema";

export const signUpFormSchema = authSchema.pick({
  firstName: true,
  lastName: true,
});

export type SignUpFormType = z.infer<typeof signUpFormSchema>;

import { z } from "zod";

import { authSchema } from "./auth.schema";

export const loginFormSchema = authSchema.pick({
  email: true,
  password: true,
});

export type LoginFormType = z.infer<typeof loginFormSchema>;

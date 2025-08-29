import { z } from "zod";

import { authSchema } from "./auth.schema";

export const loginFormSchema = authSchema.pick({
  password: true,
});

export type LoginFormType = z.infer<typeof loginFormSchema>;

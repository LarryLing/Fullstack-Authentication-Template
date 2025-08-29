import { z } from "zod";

import { authSchema } from "./auth.schema";

export const emailFormSchema = authSchema.pick({
  email: true,
});

export type EmailFormType = z.infer<typeof emailFormSchema>;

import { z } from "zod";

import { authSchema } from "./auth.schema";

export const signUpFormSchema = authSchema;

export type SignUpFormType = z.infer<typeof signUpFormSchema>;

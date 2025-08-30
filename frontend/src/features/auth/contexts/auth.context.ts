import { createContext } from "react";

import type { User } from "@/types/user.type";

export type AuthContextType = {
  user: User | null;
  isPending: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isPending: false,
});

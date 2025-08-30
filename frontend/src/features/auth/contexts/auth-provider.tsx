import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { type PropsWithChildren } from "react";

import type { User } from "@/types/user.type";

import { getUser } from "../auth.api";
import { AuthContext } from "./auth-context";

export const AUTH = "auth";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { data: user, ...rest } = useQuery({
    queryKey: [AUTH],
    queryFn: getUser,
    staleTime: Infinity,
  });

  const value = {
    user: user as User | null,
    ...rest,
  };

  if (value.isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

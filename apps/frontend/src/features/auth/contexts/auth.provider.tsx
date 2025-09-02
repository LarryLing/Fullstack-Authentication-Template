import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { type PropsWithChildren } from "react";

import { AUTH_QUERY_KEY } from "@/features/auth/auth.constants";
import type { User } from "@/types/user.type";

import { getUser } from "../auth.api";

import { AuthContext } from "./auth.context";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { data: user, isPending } = useQuery({
    queryKey: [AUTH_QUERY_KEY],
    queryFn: getUser,
    staleTime: Infinity,
  });

  const value = {
    user: user as User | null,
    isPending,
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="size-8 animate-spin" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

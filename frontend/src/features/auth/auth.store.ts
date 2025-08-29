import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { AuthType } from "./schemas/auth.schema";

type AuthStoreType = Partial<AuthType> & {
  setData: (data: Partial<AuthType>) => void;
  reset: () => void;
};

export const useAuthStore = create<AuthStoreType>()(
  persist(
    (set, _get, store) => ({
      setData: (data) => set(data),
      reset: () => {
        set(store.getInitialState());
        store.persist.clearStorage();
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

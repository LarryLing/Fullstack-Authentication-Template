import type { UseNavigateResult } from "@tanstack/react-router";

export let navigate: UseNavigateResult<string> | null = null;

export const setNavigate = (fn: UseNavigateResult<string>) => {
  navigate = fn;
};

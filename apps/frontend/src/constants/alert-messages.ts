import type { GenericAlertProps } from "@/components/GenericAlert";

export const PAGE_NOT_FOUND: GenericAlertProps = {
  variant: "destructive",
  title: "Page not found",
  description: "The page you were looking for does not exist.",
};

export const INVALID_PASSWORD_RESET_CODE: GenericAlertProps = {
  variant: "destructive",
  title: "Failed to confirm password reset code",
  description: "The link is either invalid or expired.",
};

export const INVALID_CONFIRM_SIGNUP_CODE: GenericAlertProps = {
  variant: "destructive",
  title: "Failed to confirm signup",
  description: "The link is either invalid or expired.",
};

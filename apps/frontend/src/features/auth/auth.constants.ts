import type { GenericAlertProps } from "@/components/GenericAlert";

export const AUTH_QUERY_KEY = "auth";
export const RESET_PASSWORD_QUERY_KEY = "reset-password";
export const CONFIRM_SIGNUP_QUERY_KEY = "confirm-signup";

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

export const SUCCESSFUL_SIGNUP_EMAIL_SEND: GenericAlertProps = {
  variant: "default",
  title: "Success!",
  description: "A signup email has been sent to your email address.",
};

export const SUCCESSFUL_PASSWORD_RESET_SEND: GenericAlertProps = {
  variant: "default",
  title: "Success!",
  description: "A password reset email has been sent to your email address.",
};

export const SUCCESSFUL_PASSWORD_RESET: GenericAlertProps = {
  variant: "default",
  title: "Success!",
  description: "Your password has been successfully reset.",
};

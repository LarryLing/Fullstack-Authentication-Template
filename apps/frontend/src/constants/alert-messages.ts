import type { GenericAlertProps } from "@/components/GenericAlert";

export const GENERIC_ALERT_MESSAGES = {
  PAGE_NOT_FOUND: {
    variant: "destructive",
    title: "Page not found",
    description: "The page you were looking for does not exist.",
  },
} as const satisfies Record<string, GenericAlertProps>;

export const AUTH_ALERT_MESSAGES = {
  INVALID_PASSWORD_RESET_CODE: {
    variant: "destructive",
    title: "Failed to confirm password reset code",
    description: "The link is either invalid or expired.",
  },
  INVALID_CONFIRM_SIGNUP_CODE: {
    variant: "destructive",
    title: "Failed to confirm signup",
    description: "The link is either invalid or expired.",
  },
  SUCCESSFUL_PASSWORD_RESET_SEND: {
    variant: "default",
    title: "Success!",
    description: "A password reset email has been sent to your email address.",
  },
  SUCCESSFUL_SIGNUP_EMAIL_SEND: {
    variant: "default",
    title: "Success!",
    description: "A signup email has been sent to your email address.",
  },
  SUCCESSFUL_PASSWORD_RESET: {
    variant: "default",
    title: "Success!",
    description: "Your password has been successfully reset.",
  },
} as const satisfies Record<string, GenericAlertProps>;

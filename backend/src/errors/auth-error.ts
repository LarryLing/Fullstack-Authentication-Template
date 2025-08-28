import GenericError from "./generic-error.js";

export const enum AuthErrorCodes {
  USER_NOT_FOUND = "USER_NOT_FOUND",
  USER_ALREADY_EXISTS = "USER_ALREADY_EXISTS",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  INVALID_VERIFICATION_CODE = "INVALID_VERIFICATION_CODE",
  VERIFICATION_CODE_ALREADY_SENT = "VERIFICATION_CODE_ALREADY_SENT",
}

class AuthError extends GenericError<AuthErrorCodes> {}

export default AuthError;

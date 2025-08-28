import GenericError from "./generic-error.js";

export const enum AuthErrorCodes {
  USER_NOT_FOUND = "USER_NOT_FOUND",
  USER_ALREADY_EXISTS = "USER_ALREADY_EXISTS",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  INVALID_TOKEN = "INVALID_TOKEN",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
}

class AuthError extends GenericError<AuthErrorCodes> {}

export default AuthError;

import GenericError from "./generic-error.js";

type AuthErrorCodes =
  | "USER_NOT_FOUND" // A user, verified or not, does not exist
  | "USER_ALREADY_EXISTS" // A verified user already exists
  | "USER_NOT_VERIFIED" // A verified user does not exist
  | "INVALID_CREDENTIALS" // The provided credentials are invalid
  | "INVALID_TOKEN" // The provided token is invalid
  | "TOKEN_EXPIRED"; // The provided token has expired

class AuthError extends GenericError<AuthErrorCodes> {}

export default AuthError;

import jwt, { JwtPayload, SignOptions, VerifyOptions } from "jsonwebtoken";

import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../constants/env.js";

export const enum JwtTokenType {
  ACCESS = "access",
  REFRESH = "refresh",
}

export type TokenPayload = JwtPayload & {
  sub: string;
  iat: number;
  jti: string;
  type: JwtTokenType;
};

export type SignOptionsAndSecret = SignOptions & {
  secret: string;
};

export type VerifyOptionsAndSecret = VerifyOptions & {
  secret: string;
};

const defaultSignOptions: SignOptions = {
  audience: ["user"],
};

const defaultVerifyOptions: VerifyOptions = {
  audience: ["user"],
};

const AccessTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: "1h",
  secret: ACCESS_TOKEN_SECRET,
};

export const RefreshTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: "7d",
  secret: REFRESH_TOKEN_SECRET,
};

export const generateJwtToken = (payload: TokenPayload, options?: SignOptionsAndSecret) => {
  const { secret, ...signOptions } = options || AccessTokenSignOptions;

  return jwt.sign(payload, secret, {
    ...defaultSignOptions,
    ...signOptions,
  });
};

export const verifyJwtToken = (token: string, options?: VerifyOptionsAndSecret) => {
  const { secret = ACCESS_TOKEN_SECRET, ...verifyOptions } = options || {};

  try {
    const payload = jwt.verify(token, secret, {
      ...defaultVerifyOptions,
      ...verifyOptions,
    }) as TokenPayload;

    return {
      payload,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};

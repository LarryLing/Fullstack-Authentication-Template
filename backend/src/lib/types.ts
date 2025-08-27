export type LoginRequestBody = {
  email: string;
  password: string;
};

export type SignupRequestBody = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

export type User = {
  email: string;
  firstName: string;
  id: string;
  isVerified: boolean;
  lastName: string;
  password: string;
  resetPasswordToken: null | string;
  resetPasswordTokenExpiresAt: null | string;
};

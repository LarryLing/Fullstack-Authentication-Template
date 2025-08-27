export type AuthRequestBody = {
  id: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  verification_token: number;
  reset_password_token: number;
};

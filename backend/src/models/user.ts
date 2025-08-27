import { RowDataPacket } from "mysql2/promise";

export interface User extends RowDataPacket {
  id: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  created_at: number;
  verified_at: null | number;
  last_logged_in_at: null | number;
  reset_password_token: null | number;
  reset_password_token_expires_at: null | number;
  verification_token: null | number;
  verification_token_expires_at: null | number;
}

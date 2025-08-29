import { RowDataPacket } from "mysql2/promise";

export const enum VerificationCodeTypes {
  SIGNUP = "signup",
  PASSWORD_RESET = "password_reset",
}

export interface VerificationCode extends RowDataPacket {
  id: string;
  user_id: string;
  issued_at: number;
  expires_at: number;
  type: VerificationCodeTypes;
}

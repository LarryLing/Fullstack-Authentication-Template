import { RowDataPacket } from "mysql2/promise";

export const enum VerificationCodeTypes {
  EMAIL_CONFIRMATION = "email_confirmation",
  PASSWORD_RESET = "password_reset",
}

export interface VerificationCode extends RowDataPacket {
  user_id: string;
  issued_at: number;
  expires_at: number;
  code: string;
  type: VerificationCodeTypes;
}

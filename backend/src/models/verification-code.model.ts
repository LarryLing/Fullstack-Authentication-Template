import { RowDataPacket } from "mysql2/promise";

import { VerificationCodeType } from "../types/verification-code-type.js";

export interface VerificationCode extends RowDataPacket {
  user_id: string;
  issued_at: number;
  expires_at: number;
  code: string;
  type: VerificationCodeType;
}

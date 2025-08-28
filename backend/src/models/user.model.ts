import { RowDataPacket } from "mysql2/promise";

export interface User extends RowDataPacket {
  id: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  created_at: number;
  last_logged_in_at: null | number;
}

import type { HttpStatusCode } from "@/constants/http";

class GenericError<C extends string> extends Error {
  message: string;
  status: HttpStatusCode;
  code: C;

  constructor({ message, status, code }: { message: string; status: HttpStatusCode; code: C }) {
    super();
    this.message = message;
    this.status = status;
    this.code = code;
  }
}

export default GenericError;

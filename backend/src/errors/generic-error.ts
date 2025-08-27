class GenericError<C extends string> extends Error {
  message: string;
  status: number;
  code: C;

  constructor({ message, status, code }: { message: string; status: number; code: C }) {
    super();
    this.message = message;
    this.status = status;
    this.code = code;
  }
}

export default GenericError;

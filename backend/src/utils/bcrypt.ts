import bcrypt from "bcrypt";

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hashed_password: string): Promise<boolean> => {
  return bcrypt.compare(password, hashed_password).catch(() => false);
};

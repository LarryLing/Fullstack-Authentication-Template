const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }

  return value;
};

export const NODE_ENV = getEnv("NODE_ENV", "development");
export const PORT = getEnv("PORT", "3000");
export const DEBUG = getEnv("DEBUG", "false");
export const APP_ORIGIN = getEnv("APP_ORIGIN", "http://localhost:5173");

export const ACCESS_TOKEN_SECRET = getEnv("ACCESS_TOKEN_SECRET");
export const REFRESH_TOKEN_SECRET = getEnv("REFRESH_TOKEN_SECRET");

export const MYSQL_HOSTNAME = getEnv("MYSQL_HOSTNAME");
export const MYSQL_PORT = getEnv("MYSQL_PORT");
export const MYSQL_USERNAME = getEnv("MYSQL_USERNAME");
export const MYSQL_PASSWORD = getEnv("MYSQL_PASSWORD");
export const MYSQL_DB_NAME = getEnv("MYSQL_DB_NAME");

export const EMAIL_SENDER = getEnv("EMAIL_SENDER", "onboarding@resend.dev");
export const RESEND_API_KEY = getEnv("RESEND_API_KEY");

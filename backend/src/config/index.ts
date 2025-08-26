import dotenv from "dotenv";

dotenv.config();

const config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3000,
  WHITELISTED_ORIGINS: [process.env.WHITELISTED_ORIGINS || "http://localhost:5173"],
};

export default config;

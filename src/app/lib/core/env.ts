import dotenv from "dotenv";
import path from "path";

const NODE_ENV = process.env.NODE_ENV || "development";

const ENV_PATH = path.resolve(
  __dirname,
  NODE_ENV === "development"
    ? "../../../../.env.local"
    : `../../../../.env.${NODE_ENV}`
);

dotenv.config({ path: ENV_PATH });

const env = {
  NODE_ENV,
  PORT: process.env.PORT || 3000,
  CORS_ORIGINS: process.env.CORS_ORIGINS || "http://localhost:3000",
  JWT_SECRET: process.env.JWT_SECRET || "secret",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "secret",
  DATABASE_URL: process.env.DATABASE_URL || "",
  REDIS_URL: process.env.REDIS_URL || "",
};

export default env;

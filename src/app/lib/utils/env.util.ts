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
  PORT: process.env.PORT || 3030,
  CORS_ORIGINS: process.env.CORS_ORIGINS || "http://localhost:3000",
};

export default env;

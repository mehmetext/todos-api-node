import { CorsOptions } from "cors";
import { env } from "../utils";

export const whitelist = env.CORS_ORIGINS.split(",");

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) {
      return callback(null, true);
    }

    // Allow requests from the whitelist or development environment
    if (whitelist.indexOf(origin) !== -1 || env.NODE_ENV === "development") {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400, // 24 saat
};

export default corsOptions;

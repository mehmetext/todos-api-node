import { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import { ERROR_CODES, RATE_LIMITER } from "../constants";
import ApiResponse from "./api-response";
import env from "./env";

const options = {
  windowMs: RATE_LIMITER.WINDOW_MS, // 15 minutes
  max: RATE_LIMITER.MAX_REQUESTS,
  skip: () => env.NODE_ENV === "development",
  handler: (req: Request, res: Response) => {
    ApiResponse.error(
      res,
      ERROR_CODES.TOO_MANY_REQUESTS,
      "Too many requests from this IP, please try again later.",
      429
    );
  },
  standardHeaders: RATE_LIMITER.HEADERS.STANDARD,
  legacyHeaders: RATE_LIMITER.HEADERS.LEGACY,
};

export default rateLimit(options);

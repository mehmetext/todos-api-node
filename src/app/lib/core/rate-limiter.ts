import { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import ApiResponse from "./api-response";
import env from "./env";
import { ERROR_CODES } from "./error-codes";

const options = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  skip: () => env.NODE_ENV === "development",
  handler: (req: Request, res: Response) => {
    ApiResponse.error(
      res,
      ERROR_CODES.TOO_MANY_REQUESTS,
      "Too many requests from this IP, please try again later.",
      429
    );
  },
  standardHeaders: true,
  legacyHeaders: false,
};

export default rateLimit(options);

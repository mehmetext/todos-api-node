import { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import { env } from "../utils";
import ApiResponse from "./api-response";

const options = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1,
  skip: () => env.NODE_ENV === "development",
  handler: (req: Request, res: Response) => {
    ApiResponse.error(
      res,
      "TOO_MANY_REQUESTS",
      "Too many requests from this IP, please try again later.",
      429
    );
  },
  standardHeaders: true,
  legacyHeaders: false,
};

export default rateLimit(options);

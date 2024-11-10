import ApiResponse from "@/lib/core/api-response";
import env from "@/lib/core/env";
import { ERROR_CODES } from "@/lib/core/error-codes";
import { NextFunction, Request, Response } from "express";

export default function errorHandlerMiddleware(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  console.error({
    name: err.name,
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
  });

  if (env.NODE_ENV === "development") {
    return ApiResponse.error(
      res,
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      "Something went wrong",
      500,
      { name: err.name, message: err.message }
    );
  }

  return ApiResponse.error(
    res,
    ERROR_CODES.INTERNAL_SERVER_ERROR,
    "Something went wrong"
  );
}

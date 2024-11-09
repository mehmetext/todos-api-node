import ApiResponse from "@/lib/core/api-response";
import { NextFunction, Request, Response } from "express";

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization;

  if (!token) {
    return ApiResponse.unauthorized(res, "Unauthorized");
  }

  next();
}

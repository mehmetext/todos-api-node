import ApiResponse from "@/lib/core/api-response";
import { IAuthRequest } from "@/lib/types/auth.types";
import { verifyAccessToken } from "@/lib/utils";
import { NextFunction, Response } from "express";

export default function authMiddleware(
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return ApiResponse.unauthorized(res);
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    // Normalde burada user service'den kullanıcı bilgileri alınır
    req.user = {
      id: decoded.userId,
      email: "test@test.com",
      name: "Test User",
    };

    next();
  } catch (err) {
    return ApiResponse.unauthorized(res, "Invalid token");
  }
}

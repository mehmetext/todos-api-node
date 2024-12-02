import ApiResponse from "@/lib/core/api-response";
import prisma from "@/lib/core/prisma";
import { verifyAccessToken } from "@/lib/utils";
import { NextFunction, Request, Response } from "express";

export default async function authMiddleware(
  req: Request,
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

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      console.error("User not found:", decoded.userId);
      return ApiResponse.unauthorized(res, "Invalid token");
    }

    req.user = user;
    next();
  } catch {
    return ApiResponse.unauthorized(res);
  }
}

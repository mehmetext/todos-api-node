import ApiResponse from "@/lib/core/api-response";
import prisma from "@/lib/core/prisma";
import { IAuthRequest } from "@/lib/types/auth.types";
import { verifyAccessToken } from "@/lib/utils";
import { NextFunction, Response } from "express";

export default async function authMiddleware(
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

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      console.error("User not found:", decoded.userId);
      return ApiResponse.unauthorized(res, "Invalid token");
    }

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    return ApiResponse.unauthorized(res, "Invalid token");
  }
}

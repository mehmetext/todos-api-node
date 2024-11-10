import ApiResponse from "@/lib/core/api-response";
import env from "@/lib/core/env";
import prisma from "@/lib/core/prisma";
import {
  generateTokens,
  getRefreshTokenExpiryMs,
  verifyRefreshToken,
} from "@/lib/utils";
import { LoginInput, RegisterInput } from "@/lib/validations/auth.validation";
import bcrypt from "bcrypt";
import { CookieOptions, Request, Response } from "express";

export default class AuthController {
  static REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: getRefreshTokenExpiryMs(),
    path: "/api/auth",
  };

  static async login(
    req: Request<unknown, unknown, LoginInput["body"]>,
    res: Response
  ) {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return ApiResponse.unauthorized(res, "Invalid credentials");
    }

    const tokens = generateTokens({ userId: user.id });

    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        expiresAt: new Date(Date.now() + getRefreshTokenExpiryMs()),
      },
    });

    // Set refresh token as httpOnly cookie
    res.cookie(
      "refresh_token",
      tokens.refreshToken,
      AuthController.REFRESH_TOKEN_COOKIE_OPTIONS
    );

    // Send access token in response body
    return ApiResponse.success(res, { accessToken: tokens.accessToken });
  }

  static async register(
    req: Request<unknown, unknown, RegisterInput["body"]>,
    res: Response
  ) {
    const { email, name, password } = req.body;

    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return ApiResponse.badRequest(res, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { email, name, password: hashedPassword },
    });

    return ApiResponse.success(res, "User created successfully");
  }

  static async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refresh_token;

      if (!refreshToken) {
        return ApiResponse.unauthorized(res, "Refresh token is required");
      }

      const tokenRecord = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
      });

      if (
        !tokenRecord ||
        !tokenRecord.isValid ||
        tokenRecord.expiresAt < new Date()
      ) {
        if (tokenRecord) {
          await prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
        }
        return ApiResponse.unauthorized(res, "Invalid refresh token");
      }

      const decoded = verifyRefreshToken(refreshToken);
      const tokens = generateTokens({ userId: decoded.userId });

      await prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
      await prisma.refreshToken.create({
        data: {
          token: tokens.refreshToken,
          userId: decoded.userId,
          expiresAt: new Date(Date.now() + getRefreshTokenExpiryMs()),
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"],
        },
      });

      // set new refresh token as httpOnly cookie
      res.cookie(
        "refresh_token",
        tokens.refreshToken,
        AuthController.REFRESH_TOKEN_COOKIE_OPTIONS
      );

      return ApiResponse.success(res, { accessToken: tokens.accessToken });
    } catch {
      return ApiResponse.unauthorized(res, "Invalid refresh token");
    }
  }

  static async logout(req: Request, res: Response) {
    const refreshToken = req.cookies.refresh_token;

    if (refreshToken) {
      await prisma.refreshToken.delete({ where: { token: refreshToken } });
    }

    res.clearCookie(
      "refresh_token",
      AuthController.REFRESH_TOKEN_COOKIE_OPTIONS
    );
    return ApiResponse.success(res, "Logged out successfully");
  }
}

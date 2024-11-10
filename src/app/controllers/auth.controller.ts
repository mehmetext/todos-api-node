import ApiResponse from "@/lib/core/api-response";
import env from "@/lib/core/env";
import prisma from "@/lib/core/prisma";
import { getRefreshTokenExpiryMs } from "@/lib/utils";
import { LoginInput, RegisterInput } from "@/lib/validations/auth.validation";
import { AuthService } from "@/services";
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
    const tokens = await AuthService.login(
      req.body.email,
      req.body.password,
      req.ip,
      req.headers["user-agent"]
    );

    if (!tokens) {
      return ApiResponse.unauthorized(res, "Invalid credentials");
    }

    res.cookie(
      "refresh_token",
      tokens.refreshToken,
      AuthController.REFRESH_TOKEN_COOKIE_OPTIONS
    );

    return ApiResponse.success(res, {
      accessToken: tokens.accessToken,
    });
  }

  static async register(
    req: Request<unknown, unknown, RegisterInput["body"]>,
    res: Response
  ) {
    const result = await AuthService.register(req.body);

    if (!result) {
      return ApiResponse.badRequest(res, "User already exists");
    }

    return ApiResponse.success(res, "User created successfully");
  }

  static async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refresh_token;

      if (!refreshToken) {
        return ApiResponse.unauthorized(res, "Refresh token is required");
      }

      const tokens = await AuthService.refresh(
        refreshToken,
        req.ip,
        req.headers["user-agent"]
      );

      if (!tokens) {
        return ApiResponse.unauthorized(res, "Invalid refresh token");
      }

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

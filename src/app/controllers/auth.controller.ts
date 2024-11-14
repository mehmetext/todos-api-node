import { AUTH } from "@/lib/constants";
import ApiResponse from "@/lib/core/api-response";
import env from "@/lib/core/env";
import prisma from "@/lib/core/prisma";
import { getRefreshTokenExpiryMs } from "@/lib/utils";
import { LoginInput, RegisterInput } from "@/lib/validations";
import { AuthService } from "@/services";
import { CookieOptions, Request, Response } from "express";

export default class AuthController {
  static REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
    httpOnly: AUTH.COOKIE.OPTIONS.httpOnly,
    secure: env.NODE_ENV === "production",
    sameSite: AUTH.COOKIE.OPTIONS.sameSite,
    maxAge: getRefreshTokenExpiryMs(),
    path: AUTH.COOKIE.PATH,
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
      AUTH.COOKIE.NAME,
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
      AUTH.COOKIE.NAME,
      tokens.refreshToken,
      AuthController.REFRESH_TOKEN_COOKIE_OPTIONS
    );

    return ApiResponse.success(res, { accessToken: tokens.accessToken });
  }

  static async logout(req: Request, res: Response) {
    const refreshToken = req.cookies.refresh_token;

    if (refreshToken) {
      await prisma.refreshToken.delete({ where: { token: refreshToken } });
    }

    res.clearCookie(
      AUTH.COOKIE.NAME,
      AuthController.REFRESH_TOKEN_COOKIE_OPTIONS
    );
    return ApiResponse.success(res, "Logged out successfully");
  }
}

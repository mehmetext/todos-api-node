import ApiResponse from "@/lib/core/api-response";
import { generateTokens, verifyRefreshToken } from "@/lib/utils";
import { LoginInput } from "@/lib/validations/auth.validation";
import { CookieOptions, Request, Response } from "express";

export default class AuthController {
  static REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/api/auth",
  };

  static async login(req: Request<{}, {}, LoginInput["body"]>, res: Response) {
    const { email, password } = req.body;

    if (email === "test@test.com" && password === "test") {
      const tokens = generateTokens({ userId: "user123" });

      // Set refresh token as httpOnly cookie
      res.cookie(
        "refresh_token",
        tokens.refreshToken,
        AuthController.REFRESH_TOKEN_COOKIE_OPTIONS
      );

      // Send access token in response body
      return ApiResponse.success(res, { accessToken: tokens.accessToken });
    }

    return ApiResponse.unauthorized(res, "Invalid credentials");
  }

  static async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refresh_token;

      if (!refreshToken) {
        return ApiResponse.unauthorized(res, "Refresh token is required");
      }

      const decoded = verifyRefreshToken(refreshToken);
      const tokens = generateTokens({ userId: decoded.userId });

      // set new refresh token as httpOnly cookie
      res.cookie(
        "refresh_token",
        tokens.refreshToken,
        AuthController.REFRESH_TOKEN_COOKIE_OPTIONS
      );

      return ApiResponse.success(res, { accessToken: tokens.accessToken });
    } catch (error) {
      return ApiResponse.unauthorized(res, "Invalid refresh token");
    }
  }

  static async logout(req: Request, res: Response) {
    res.clearCookie(
      "refresh_token",
      AuthController.REFRESH_TOKEN_COOKIE_OPTIONS
    );
    return ApiResponse.success(res, "Logged out successfully");
  }
}

import ApiResponse from "@/lib/core/api-response";
import { generateToken } from "@/lib/utils/jwt.util";
import { LoginInput } from "@/lib/validations/auth.validation";
import { Request, Response } from "express";

export default class AuthController {
  static async login(req: Request<{}, {}, LoginInput>, res: Response) {
    const { email, password } = req.body;

    if (email === "test@test.com" && password === "test") {
      const token = generateToken({
        userId: "1",
        email: "test@test.com",
      });

      return ApiResponse.success(res, { token });
    }

    return ApiResponse.unauthorized(res, "Invalid credentials");
  }
}

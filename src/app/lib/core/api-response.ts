import { Response } from "express";

export default class ApiResponse {
  static success<T>(res: Response, data: T, statusCode: number = 200): void {
    res.status(statusCode).json({
      success: true,
      data: data,
      timestamp: new Date().toISOString(),
    });
  }

  static error(
    res: Response,
    code: string,
    message: string,
    statusCode: number = 500,
    details?: any
  ): void {
    res.status(statusCode).json({
      success: false,
      error: {
        code,
        message,
        details,
      },
      timestamp: new Date().toISOString(),
    });
  }

  // for specific errors
  static notFound(res: Response, message: string = "Resource not found"): void {
    this.error(res, "NOT_FOUND", message, 404);
  }

  static badRequest(res: Response, message: string, details?: any): void {
    this.error(res, "BAD_REQUEST", message, 400, details);
  }

  static unauthorized(res: Response, message: string = "Unauthorized"): void {
    this.error(res, "UNAUTHORIZED", message, 401);
  }
}

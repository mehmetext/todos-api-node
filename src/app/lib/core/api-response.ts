import { Response } from "express";
import { ERROR_CODES, ErrorCode, ErrorResponse } from "./error-codes";

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
    code: ErrorCode,
    message: string,
    statusCode: number = 500,
    details?: unknown
  ): void {
    const errorResponse: ErrorResponse = {
      code,
      message,
      details,
    };

    res.status(statusCode).json({
      success: false,
      error: errorResponse,
      timestamp: new Date().toISOString(),
    });
  }

  // for specific errors
  static notFound(res: Response, message: string = "Resource not found"): void {
    this.error(res, ERROR_CODES.NOT_FOUND, message, 404);
  }

  static badRequest(res: Response, message: string, details?: unknown): void {
    this.error(res, ERROR_CODES.BAD_REQUEST, message, 400, details);
  }

  static unauthorized(res: Response, message: string = "Unauthorized"): void {
    this.error(res, ERROR_CODES.UNAUTHORIZED, message, 401);
  }
}

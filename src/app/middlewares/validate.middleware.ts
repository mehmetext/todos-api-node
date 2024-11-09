import ApiResponse from "@/lib/core/api-response";
import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";

export default function validate(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return ApiResponse.badRequest(res, "Validation error", {
          errors: error.errors.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        });
      }

      return next(error);
    }
  };
}

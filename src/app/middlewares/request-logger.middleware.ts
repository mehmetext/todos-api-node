import { NextFunction, Request, Response } from "express";

export default function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(`${req.method} ${req.url} - ${res.statusCode}`);

  next();
}

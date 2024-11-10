import { NextFunction, Request, Response } from "express";

export default function requestLoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const start = performance.now();
  const reqUrl = req.url;

  res.on("finish", () => {
    const duration = performance.now() - start;
    console.log(
      `${req.method} ${reqUrl} | ${res.statusCode} | ${duration.toFixed(2)}ms`
    );
  });

  next();
}

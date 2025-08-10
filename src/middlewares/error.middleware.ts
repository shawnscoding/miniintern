import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  const response: any = { message };
  // production 환경 제외하고 스택 트레이스 활성화
  // if (process.env.NODE_ENV !== "production" && err.stack) {
  //   response.stack = err.stack;
  // }
  res.status(status).json(response);
}

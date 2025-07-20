import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";

  console.error(`[Error] ${req.method} - ${req.path}: ${message}`);
  res.status(status).json({ error: message });
};

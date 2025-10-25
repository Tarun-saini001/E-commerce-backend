import { Request, Response, NextFunction } from "express";

export const checkPortal = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const portalHeader = req.headers["x-portal"];
  if (!portalHeader) {
    req.headers["x-portal"] = "user";
  } else if (typeof portalHeader === "string") {
    req.headers["x-portal"] = portalHeader.toLowerCase();
  }
  next();
};


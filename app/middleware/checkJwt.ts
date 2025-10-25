import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getSecretForPlatform } from "../utils/common.js";

const authenticateJWT =
  (platform: number) =>
  async (
    req: Request & { user?: JwtPayload },
    res: Response & { unAuthorized: () => void },
    next: NextFunction,
  ) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.unAuthorized();
    }

    const token = authHeader.split(" ")[1];
    const secret = getSecretForPlatform(platform);

    jwt.verify(token, secret, (error, decoded) => {
      if (error) {
        return res.unAuthorized();
      }
      req.user = decoded as JwtPayload;
      next();
    });
  };

export default authenticateJWT;

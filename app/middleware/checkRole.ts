import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/common";
import Session from "../modules/onboarding/models/session";
import { USER_TYPES } from "../config/constants";
import User from '../modules/onboarding/models/user'

export const verify =
  (...roles: number[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const token = String(req.headers.authorization || "")
          .replace(/bearer|jwt|Guest/i, "")
          .trim();

        if (!token) {
          return res.status(401).send({
            statusCode: 401,
            message: req.t("UNAUTHORIZED_ACCESS"),
            data: {},
            status: 0,
            isSessionExpired: true,
          });
        }
        const decoded = verifyToken(token, roles[0]);

        if (!decoded) {
          return res.status(401).send({
            statusCode: 401,
            message: req.t("UNAUTHORIZED_ACCESS"),
            data: {},
            status: 0,
            isSessionExpired: true,
          });
        }

        const session = await Session.findOne({
          _id: decoded._id,
          // role: { $in: roles },
          userId: decoded.userId,
        });

        if (!session) {
          return res.status(401).send({
            statusCode: 401,
            message: req.t("SESSION_EXPIRED"),
            data: {},
            status: 0,
            isSessionExpired: true,
          });
        }

        const user = {
          id: session.userId,
          role: session.role,
        }

        const roleKey = roles.includes(USER_TYPES.ADMIN) ? "admin" : "user";
        (req as any)[roleKey] = user as unknown as typeof User;

        next();
      } catch (error: any) {
        const message =
          String(error.name).toLowerCase() === "error"
            ? error.message
            : req.t("UNAUTHORIZED_ACCESS");

        res.status(401).send({
          statusCode: 401,
          message,
          data: {},
          status: 0,
          isSessionExpired: true,
        });
      }
    };

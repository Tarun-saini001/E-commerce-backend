import { JWT } from "@app/config/constants";
import { getSecretForPlatform } from "@app/utils/common";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return next();

    let token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;

    try {
        // decode token WITHOUT verifying to extract role
        const decodedTemp: any = jwt.decode(token);
        if (!decodedTemp) return next();

        const secret = getSecretForPlatform(decodedTemp.role); // secret based on role
        const decoded = jwt.verify(token, secret);         // verify now

        req.user = decoded as any;
    } catch (err:any) {
        console.log("JWT verify error:", err.message);
    }

    next();
};

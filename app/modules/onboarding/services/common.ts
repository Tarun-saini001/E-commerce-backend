import { verifyEmailCode, verifyPhoneOtp } from "./otp";
import {
    createErrorResponse,
    generateNumber,
    getToken,
} from "@app/utils/common";
import { OtpResponse, ValidateUserAuthResponse } from "@app/types/others";
import { RESPONSE_STATUS, USER_TYPES, ROLES } from "@app/config/constants";
import User from "../models/user";
import Session from "../models/session";
import { Request } from "express";
import { SendOtpType, UpdateProfileType, VerifyOtpType } from "../validation/onboarding";

export const buildUserQuery = (body: SendOtpType | UpdateProfileType, includeVerification = true) => {
    const qry: any = { isDeleted: false };

    if (body.email) {
        qry.email = body.email.toLowerCase();
        if (includeVerification) qry.isEmailVerified = true;
    }
    if (body.phone) {
        qry.phone = body.phone;
        qry.countryCode = body.countryCode;
        if (includeVerification) qry.isPhoneVerified = true;
    }

    return qry;
};

export const checkUserExists = async (
    body: SendOtpType | UpdateProfileType,
    req: Request,
    excludeUserId?: string,
) => {
    const qry = buildUserQuery(body);
    if (excludeUserId) {
        qry._id = { $ne: excludeUserId };
    }
    const user = await User.findOne(qry);
    if (user) {
        const message = body.email
            ? req.t("EMAIL_ALREADY_IN_USE")
            : req.t("PHONE_ALREADY_IN_USE");

        return createErrorResponse(
            RESPONSE_STATUS.VALIDATION_ERROR,
            message,
        );
    }
};

export const verifyOtpCode = async (
    body: VerifyOtpType,
    req: Request
): Promise<{ expiresAt: Date; otp: string } | { code: number; status: boolean; message: string }> => {
    let otp: OtpResponse;

    if (body.email) {
        otp = await verifyEmailCode(body.email, body.otp, body.otpType, req);
    } else if (body.phone) {
        if (!body.countryCode) {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("INVALID_OTP"),
            );
        }
        otp = await verifyPhoneOtp(body.countryCode, body.phone, body.otp, body.otpType, req);
    } else {
        return createErrorResponse(
            RESPONSE_STATUS.BAD_REQUEST,
            req.t("INVALID_OTP"),
        );
    }

    if (!otp.success) {
        return createErrorResponse(
            RESPONSE_STATUS.BAD_REQUEST,
            req.t("INVALID_OTP"),
        );
    }

    return {
        expiresAt: new Date(otp.expiresAt),
        otp: otp.otp
    };
};

export const sessionRole = (role: number): number => {
    const adminRoles = [ROLES.ADMIN, ROLES.SUBADMIN] as number[];
    const userRoles = [ROLES.USER, ROLES.BUSINESS] as number[];
    if (adminRoles.includes(role)) return USER_TYPES.ADMIN;
    if (userRoles.includes(role)) return USER_TYPES.USER;
    return USER_TYPES.USER;
};

export const createUserSession = async (
    user: any,
    body: any,
    role: number,
    isForget = false,
    rememberMe = false
) => {
    const sessionType = sessionRole(role);

    const sessionData = {
        deviceType: body.deviceType,
        deviceToken: body.deviceToken,
        userId: user._id,
        role,
        jti: generateNumber(20),
    };

    const session = await Session.create(sessionData);

    const userObj = user.toObject ? user.toObject() : user;
    const { password, __v, ...safeUser } = userObj;

    return {
        ...safeUser,
        token: getToken(
            { _id: session.id, userId: user._id, jti: session.jti, isForget },
            sessionType,
            rememberMe
        ),
        tokenType: "Bearer",
    };
};

export const validateUserAuth = (req: Request): ValidateUserAuthResponse => {
    const user = req.user || req.admin;
    if (!user) {
        return createErrorResponse(
            RESPONSE_STATUS.UNAUTHORIZED,
            req.t("UNAUTHORIZED_ACCESS"),
        );
    }
    return { user, error: null };
};

export const getRoleFromHeaders = (req: Request): number => {
    const portalHeader = req.headers["x-portal"];
    if (portalHeader === "admin") return ROLES.ADMIN;
    if (portalHeader === "subadmin") return ROLES.SUBADMIN;
    if (portalHeader === "user") return ROLES.USER;
    return ROLES.USER;
};






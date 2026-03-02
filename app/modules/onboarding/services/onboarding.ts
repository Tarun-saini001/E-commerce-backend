import {
    comparePassword,
    createSuccessResponse,
    generateNumber,
    getExpireDate,
    getUserRole,
    hashPassword,
    isExpired,
    createErrorResponse,
} from "@app/utils/common";
import {
    buildUserQuery,
    checkUserExists,
    createUserSession,
    getRoleFromHeaders,
    validateUserAuth,
    verifyOtpCode,
} from "./common";

import { FORGOT_PASSWORD_WITH, OTP_FOR, RESPONSE_STATUS, USER_STATUS, ROLES } from "@app/config/constants";

import User from "../models/user";
import Otp from "../models/otp";
import Session from "../models/session";
import { ChangePasswordType, LoginType, SendOtpType, SocialLoginType, UpdateProfileType, VerifyOtpType } from "../validation/onboarding";
import { Request } from "express";
import { ValidateUserAuthResponse } from "@app/types/others";
import { sendMail } from "@app/utils/mail";

export const Onboarding = {
    sendOtp: async (req: Request) => {
        const body: SendOtpType = req.body;
        if (!body) {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("MISSING_BODY_IN_REQUEST"),
            );
        }
        const qry = buildUserQuery(body);
        switch (body.otpType) {
            case OTP_FOR.LOGIN:
            case OTP_FOR.FORGOT_PASSWORD:
                const user = await User.findOne(qry);
                if (!user) {
                    return createErrorResponse(
                        RESPONSE_STATUS.BAD_REQUEST,
                        req.t("ACCOUNT_NOT_FOUND"),
                        true
                    );
                }
                break;

            case OTP_FOR.REGISTER:
                const existsError = await checkUserExists(body, req);
                if (existsError) return existsError;
                break;
        }
        const otp = generateNumber(4);
        await Otp.findOneAndUpdate(
            {
                email: body.email || null,
                phone: body.phone || null,
                countryCode: body.countryCode || null,
                otpType: Number(body.otpType || OTP_FOR.REGISTER),
            },
            {
                $set: {
                    email: body.email,
                    phone: body.phone,
                    countryCode: body.countryCode,
                    // otp: process.env.NODE_ENV === "prod" ? generateNumber(4) : "1234",
                    otp: otp,
                    otpType: Number(body.otpType || OTP_FOR.REGISTER),
                    expiresAt: await getExpireDate(FORGOT_PASSWORD_WITH.EXPIRE_TIME),
                },
            },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true,
            }
        );
        if (!body.email) {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                "Email is required to send OTP"
            );
        }
        console.log("GMAIL_USER:", process.env.GMAIL_USER);
        console.log("GMAIL_APP_PASSWORD:", process.env.GMAIL_APP_PASSWORD);
        try {
            await sendMail({
                from: process.env.GMAIL_USER,
                to: body.email,
                subject: "Your OTP is..",
                template: "app/views/email/OTP",
                data: {
                    userName: body.name || body.email,
                    otp,
                },
            });
        } catch (error) {
            console.error("Failed to send OTP email:", error);
            return createErrorResponse(RESPONSE_STATUS.INTERNAL_SERVER_ERROR, "Failed to send OTP email");
        }
        let data = createSuccessResponse(req.t("OTP_SENT_SUCCESSFULLY"));
        return data;
    },

    verifyOtp: async (req: Request) => {
        const body: VerifyOtpType = req.body;
        console.log('body: ', body);
        if (!body.email && !body.phone) {
            return createErrorResponse(RESPONSE_STATUS.BAD_REQUEST, req.t("INVALID_INPUT"));
        }

        const otpResult = await verifyOtpCode(body, req);

        if ("code" in otpResult) {
            return createErrorResponse(otpResult.code, otpResult.message);
        }

        if (!otpResult || otpResult.otp !== body.otp) {
            return createErrorResponse(RESPONSE_STATUS.BAD_REQUEST, req.t("INVALID_OTP"));
        }

        if (otpResult.expiresAt && isExpired(otpResult.expiresAt)) {
            return createErrorResponse(RESPONSE_STATUS.BAD_REQUEST, req.t("OTP_EXPIRED"));
        }

        let user: any;
        let role: number;
        switch (body.otpType) {
            case OTP_FOR.LOGIN:
            case OTP_FOR.FORGOT_PASSWORD: {
                user = await User.findOne(buildUserQuery(body)).populate("permission").lean();
                if (!user) {
                    return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("ACCOUNT_NOT_FOUND"));
                }
                role = Number(user.role);
                const result = await createUserSession(
                    user,
                    body,
                    role,
                    Number(body.otpType) === Number(OTP_FOR.FORGOT_PASSWORD)
                );

                await Otp.findOneAndDelete({
                    email: body.email,
                    phone: body.phone,
                    countryCode: body.countryCode,
                    otpType: Number(body.otpType),
                });

                if (body.otpType === OTP_FOR.LOGIN) {
                    return createSuccessResponse(result, req.t("OTP_VERIFIED_SUCCESSFULLY"));
                }

                return createSuccessResponse(
                    { token: result.token, tokenType: result.tokenType, permission: user.permission },
                    req.t("OTP_VERIFIED_SUCCESSFULLY")
                );
            }

            case OTP_FOR.REGISTER: {
                const existsError = await checkUserExists(body, req);
                if (existsError) return existsError;
                if (body.role === ROLES.ADMIN || body.role === ROLES.SUBADMIN) {
                    return createErrorResponse(RESPONSE_STATUS.BAD_REQUEST, req.t("INVALID_INPUT"));
                }
                let userRole = body.role ?? getRoleFromHeaders(req)
                const userData = {
                    ...buildUserQuery(body),
                    role: userRole,
                    fullName: body.name || body.fullName,
                    isEmailVerified: !!body.email,
                    isPhoneVerified: !!body.phone,
                    isPasswordSet: !!body.password,
                    ...(body.password ? { password: await hashPassword(body.password), isPasswordSet: true } : {}),
                };
                user = (await User.create(userData)).toObject();
                role = Number(user.role);
                break;
            }
            default:
                return createErrorResponse(RESPONSE_STATUS.BAD_REQUEST, req.t("INVALID_INPUT"));
        }
        const result = await createUserSession(
            user,
            body,
            role,
            Number(body.otpType) === Number(OTP_FOR.FORGOT_PASSWORD)
        );
        await Otp.findOneAndDelete({
            email: body.email,
            phone: body.phone,
            countryCode: body.countryCode,
            otpType: Number(body.otpType),
        });
        // return createSuccessResponse({ ...result, permission: user.permission }, req.t("OTP_VERIFIED_SUCCESSFULLY"));
        return createSuccessResponse({
            token: result.token,
            tokenType: result.tokenType,
            name: user.fullName || user.name,
            email: user.email
        }, req.t("OTP_VERIFIED_SUCCESSFULLY"));
    },

    updateProfile: async (req: Request) => {
        const body: UpdateProfileType = req.body;
        const result: ValidateUserAuthResponse = validateUserAuth(req);

        if (!("user" in result)) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("ACCOUNT_NOT_FOUND"));
        }
        const user = result.user;
        if (body.email || body.phone) {
            const existsError = await checkUserExists(body, req, user.id);
            if (existsError) return existsError;
        }
        if (body.password) {
            body.password = await hashPassword(body.password);
            (body as any).isPasswordSet = true;
        }
        const userExist = await User.findByIdAndUpdate(user.id, body, { new: true });
        if (!userExist) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("ACCOUNT_NOT_FOUND"));
        }
        return createSuccessResponse(userExist.toObject(), req.t("PROFILE_UPDATED_SUCCESSFULLY"));
    },

    sendOtpToVerify: async (req: Request) => {
        const body: SendOtpType = req.body;
        const result = validateUserAuth(req);

        if (!("user" in result)) {
            return createErrorResponse(
                RESPONSE_STATUS.RECORD_NOT_FOUND,
                req.t("ACCOUNT_NOT_FOUND"),
            );
        }

        const user = result.user;

        const existsError = await checkUserExists(body, req, user.id);
        if (existsError) return existsError;

        const otp = await Otp.findOneAndUpdate(
            {
                email: body.email || null,
                phone: body.phone || null,
                countryCode: body.countryCode || null,
                otpType: Number(body.otpType || OTP_FOR.REGISTER),
            },
            {
                $set: {
                    email: body.email,
                    phone: body.phone,
                    countryCode: body.countryCode,
                    otp: process.env.NODE_ENV === "prod" ? generateNumber(4) : "1234",
                    otpType: Number(body.otpType || OTP_FOR.VERIFICATION),
                    expiresAt: await getExpireDate(FORGOT_PASSWORD_WITH.EXPIRE_TIME),
                },
            },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true,
            }
        );
        return createSuccessResponse(req.t("OTP_SENT_SUCCESSFULLY"));
    },

    verifyOtpToVerify: async (req: Request) => {
        const body: VerifyOtpType = req.body;
        const result = validateUserAuth(req);

        console.log("result", result);

        if (!("user" in result)) {
            return createErrorResponse(
                RESPONSE_STATUS.RECORD_NOT_FOUND,
                req.t("ACCOUNT_NOT_FOUND"),
            );
        }

        const user = result.user;

        const otpResult = await verifyOtpCode(body, req);

        if ("code" in otpResult) {
            return createErrorResponse(
                otpResult.code,
                otpResult.message,
            );
        }

        if (!otpResult || otpResult.otp !== body.otp) {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("INVALID_OTP"),
            );
        }

        if (otpResult.expiresAt && isExpired(otpResult.expiresAt)) {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("OTP_EXPIRED"),
            );
        }

        const existsError = await checkUserExists(body, req, user.id);
        if (existsError) return existsError;

        if (body.secretPin) {
            body.secretPin = await hashPassword(body.secretPin);
        }

        if (body.email) (body as any).isEmailVerified = true;
        if (body.phone) (body as any).isPhoneVerified = true;

        const updatedUser = await User.findByIdAndUpdate(user.id, body, { new: true });

        return createSuccessResponse(
            updatedUser,
            req.t("OTP_VERIFIED_SUCCESSFULLY"),
        );
    },

    deleteAccount: async (req: Request) => {
        const result = validateUserAuth(req);

        if (!("user" in result)) {
            return createErrorResponse(
                RESPONSE_STATUS.RECORD_NOT_FOUND,
                req.t("ACCOUNT_NOT_FOUND"),
            );
        }

        const user = result.user;

        const response = await User.findByIdAndUpdate(user.id, { isDeleted: true });

        if (!response) {
            return createErrorResponse(
                RESPONSE_STATUS.VALIDATION_ERROR,
                req.t("INVALID_ID"),
            );
        }
        return createSuccessResponse(undefined, req.t("ACCOUNT_DELETED_SUCCESSFULLY"));
    },

    login: async (req: Request) => {
        const body: LoginType = req.body;
        // 
        const role = await getUserRole(body.email);
        if (!role) {
            return createErrorResponse(
                RESPONSE_STATUS.RECORD_NOT_FOUND,
                req.t("ACCOUNT_NOT_FOUND"),
            );
        }
        const user = await User.findOne({
            email: body.email,
            isEmailVerified: true,
            isDeleted: false,
            role: role,
        }).populate("permission");

        if (!user) {
            return createErrorResponse(
                RESPONSE_STATUS.RECORD_NOT_FOUND,
                req.t("ACCOUNT_NOT_FOUND"),
            );
        }

        if (!user.password || !user.isPasswordSet) {
            return createErrorResponse(
                RESPONSE_STATUS.RECORD_NOT_FOUND,
                req.t("PASSWORD_NOT_SET"),
            );
        }

        if (!body?.password) {
            return createErrorResponse(
                RESPONSE_STATUS.RECORD_NOT_FOUND,
                req.t("INVALID_INPUT"),
            );
        }

        const isMatch = await comparePassword(body?.password, user.password);
        if (!isMatch) {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("INVALID_CREDENTIALS"),
            );
        }

        if (user.isBlocked) {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("ACCOUNT_BLOCKED"),
            );
        }

        if ((user.role === ROLES.BUSINESS) && user.status === USER_STATUS.PENDING && user.isProfileComplete === true) {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("ACCOUNT_NOT_VERIFIED"),
            );
        }
        const result = await createUserSession(user, body, role, false, body.rememberMe);
        return createSuccessResponse({ ...result, permission: user.permission }, req.t("LOGIN_SUCCESSFULLY"));
    },

    socialLogin: async (req: Request) => {
        const body: SocialLoginType = req.body;

        let user = await User.findOne({
            socialId: body.socialId,
            socialType: body.socialType,
            isDeleted: false,
        }).populate("permission");

        if (!user) {
            if (body.email) {
                const existing = await User.findOne({
                    email: body.email,
                    isDeleted: false,
                    isEmailVerified: true,
                });

                if (!existing) {
                    (body as any).isEmailVerified = true;
                    user = await User.create(body);
                } else {
                    user = await User.findByIdAndUpdate(existing._id, body, { new: true });
                }
            } else {
                user = await User.create(body);
            }
        }
        const result = await createUserSession(user, body, body.role);
        return createSuccessResponse({ ...result, permission: user.permission }, req.t("LOGIN_SUCCESSFULLY"));
    },

    logout: async (req: Request) => {
        const result = validateUserAuth(req);

        if (!("user" in result)) {
            return createErrorResponse(
                RESPONSE_STATUS.RECORD_NOT_FOUND,
                req.t("ACCOUNT_NOT_FOUND"),
            );
        }
        const token = String(req.headers.authorization || "")
            .replace(/bearer|jwt|Guest/i, "")
            .trim();

        const user = result.user;
        await Session.deleteMany({ userId: user.id, token });

        return createSuccessResponse(undefined, req.t("LOGOUT_SUCCESSFULLY"));
    },

    changePassword: async (req: Request) => {
        const body: ChangePasswordType = req.body;
        const result = validateUserAuth(req);

        if (!("user" in result)) {
            return createErrorResponse(
                RESPONSE_STATUS.RECORD_NOT_FOUND,
                req.t("ACCOUNT_NOT_FOUND"),
            );
        }

        const user = result.user;

        const userExist = await User.findById(user.id).select(
            "password isEmailVerified isBlocked",
        );

        if (!userExist) {
            return createErrorResponse(
                RESPONSE_STATUS.RECORD_NOT_FOUND,
                req.t("ACCOUNT_NOT_FOUND"),
            );
        }

        if (!userExist.isEmailVerified) {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("ACCOUNT_NOT_VERIFIED"),
            );
        }

        if (userExist.isBlocked) {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("ACCOUNT_BLOCKED"),
            );
        }

        if (!body.isResetPassword) {
            if (!userExist.password) {
                return createErrorResponse(
                    RESPONSE_STATUS.BAD_REQUEST,
                    req.t("PASSWORD_NOT_SET"),
                );
            }

            if (!body?.oldPassword) {
                return createErrorResponse(
                    RESPONSE_STATUS.RECORD_NOT_FOUND,
                    req.t("INVALID_INPUT"),
                );
            }

            const isMatch = await comparePassword(body.oldPassword, userExist.password);
            if (!isMatch) {
                return createErrorResponse(
                    RESPONSE_STATUS.BAD_REQUEST,
                    req.t("OLD_PASSWORD_NOT_MATCH"),
                );
            }
        }

        if (userExist.password && (await comparePassword(body.newPassword, userExist.password))) {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("NEW_PASSWORD_SAME_AS_OLD_PASSWORD"),
            );
        }

        const hashed = await hashPassword(body.newPassword);
        await User.findByIdAndUpdate(user.id, { password: hashed });

        return createSuccessResponse(undefined, req.t("PASSWORD_CHANGED_SUCCESSFULLY"));
    },

    getProfile: async (req: Request) => {
        const result = validateUserAuth(req);

        if (!("user" in result)) {
            return createErrorResponse(
                RESPONSE_STATUS.RECORD_NOT_FOUND,
                req.t("ACCOUNT_NOT_FOUND"),
            );
        }

        const user = result.user;

        const userRecord = await User.findById(user.id).populate("permission").select("-password")

        return createSuccessResponse(
            userRecord || {},
            req.t("PROFILE_FETCHED_SUCCESSFULLY"),
        );
    }
};

export default Onboarding;


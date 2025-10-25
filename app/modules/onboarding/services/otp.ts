import { Request } from "express";
import { RESPONSE_STATUS } from "@app/config/constants";
import Otp from "../models/otp";
import { OtpResponse } from "@app/types/others";

// Verify OTP by Email
export const verifyEmailCode = async (
    email: string,
    otp: string,
    otpType: number,
    req: Request
): Promise<OtpResponse> => {
    const foundOTP = await Otp.findOne({
        email,
        otp: otp,
        otpType,
    })
        .sort({ createdAt: -1 })
        .exec();

    if (!foundOTP) {
        return {
            success: false,
            status: RESPONSE_STATUS.BAD_REQUEST,
            message: req.t("INVALID_OTP"),
        };
    }

    return {
        success: true,
        expiresAt: foundOTP.expiresAt,
        otp: foundOTP.otp,
    };
};


// Verify OTP by Phone
export const verifyPhoneOtp = async (
    countryCode: string,
    phone: string,
    otp: string,
    otpType: number,
    req: Request
): Promise<OtpResponse> => {
    const foundOTP = await Otp.findOne({
        countryCode,
        phone,
        otp: otp,
        otpType
    })
        .sort({ createdAt: -1 })
        .exec();

    if (!foundOTP) {
        return {
            success: false,
            status: RESPONSE_STATUS.BAD_REQUEST,
            message: req.t("INVALID_OTP"),
        };
    }

    return {
        success: true,
        expiresAt: foundOTP.expiresAt,
        otp: foundOTP.otp,
    };
};


import { Request, Response } from "express";
import { sendResponse } from "@app/utils/common";
import Onboarding from "../services/onboarding";
import { asyncHandler } from "@app/middleware/async";

const login = asyncHandler(async (req: Request, res: Response) => {
    const response = await Onboarding.login(req);
    return sendResponse(res, response);
});

const sendOtp = asyncHandler(async (req: Request, res: Response) => {
    const response = await Onboarding.sendOtp(req);
    return sendResponse(res, response);
});

const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    const response = await Onboarding.verifyOtp(req);
    return sendResponse(res, response);
});

const sendOtpToVerify = asyncHandler(async (req: Request, res: Response) => {
    const response = await Onboarding.sendOtpToVerify(req);
    return sendResponse(res, response);
});

const verifyOtpToVerify = asyncHandler(async (req: Request, res: Response) => {
    const response = await Onboarding.verifyOtpToVerify(req);
    return sendResponse(res, response);
});

const changePassword = asyncHandler(async (req: Request, res: Response) => {
    const response = await Onboarding.changePassword(req);
    return sendResponse(res, response);
});

const logout = asyncHandler(async (req: Request, res: Response) => {
    const response = await Onboarding.logout(req);
    return sendResponse(res, response);
});

const update = asyncHandler(async (req: Request, res: Response) => {
    const response = await Onboarding.updateProfile(req);
    return sendResponse(res, response);
});

const getProfile = asyncHandler(async (req: Request, res: Response) => {
    const response = await Onboarding.getProfile(req);
    return sendResponse(res, response);
});

export default {
    login,
    sendOtp,
    verifyOtp,
    changePassword,
    logout,
    update,
    getProfile,
    sendOtpToVerify,
    verifyOtpToVerify
};

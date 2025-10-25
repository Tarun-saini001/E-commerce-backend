import { Request, Response } from "express";
import { sendResponse } from "@app/utils/common";
import { UserService } from "../services/user";
import { asyncHandler } from "@app/middleware/async";

const addUser = asyncHandler(async (req: Request, res: Response) => {
    const response = await UserService.addUser(req);
    return sendResponse(res, response);
});

const updateUser = asyncHandler(async (req: Request, res: Response) => {
    const response = await UserService.updateUser(req);
    return sendResponse(res, response);
});

const getUser = asyncHandler(async (req: Request, res: Response) => {
    const response = await UserService.getUser(req);
    return sendResponse(res, response);
});

const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const response = await UserService.deleteUser(req);
    return sendResponse(res, response);
});

const getUserList = asyncHandler(async (req: Request, res: Response) => {
    const response = await UserService.list(req);
    return sendResponse(res, response);
});

const exportUserCsv = asyncHandler(async (req: Request, res: Response) => {
    const response = await UserService.csv(req);
    return sendResponse(res, response);
});

export default {
    addUser,
    updateUser,
    getUser,
    deleteUser,
    getUserList,
    exportUserCsv
};

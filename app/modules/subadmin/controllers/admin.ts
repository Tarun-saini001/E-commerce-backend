import { Request, Response } from "express";
import { sendResponse } from "@app/utils/common";
import { SubAdmin } from "../services/subadmin";
import { asyncHandler } from "@app/middleware/async";

const addSubAdmin = asyncHandler(async (req: Request, res: Response) => {
    const response = await SubAdmin.addSubAdmin(req);
    return sendResponse(res, response);
});

const getSubAdmin = asyncHandler(async (req: Request, res: Response) => {
    const response = await SubAdmin.getSubAdmin(req);
    return sendResponse(res, response);
});

const deleteSubAdmin = asyncHandler(async (req: Request, res: Response) => {
    const response = await SubAdmin.deleteSubAdmin(req);
    return sendResponse(res, response);
});

const updateSubAdmin = asyncHandler(async (req: Request, res: Response) => {
    const response = await SubAdmin.updateSubAdmin(req);
    return sendResponse(res, response);
});

const getSubAdminList = asyncHandler(async (req: Request, res: Response) => {
    const response = await SubAdmin.list(req);
    return sendResponse(res, response);
});

export default {
    addSubAdmin,
    getSubAdmin,
    deleteSubAdmin,
    updateSubAdmin,
    getSubAdminList
};

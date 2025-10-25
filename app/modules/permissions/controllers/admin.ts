import { Request, Response } from "express";
import { Permissions } from "../services/permissions";
import { sendResponse } from "@app/utils/common";
import { asyncHandler } from "@app/middleware/async";

const addPermission = asyncHandler(async (req: Request, res: Response) => {
    const response = await Permissions.addPermission(req);
    return sendResponse(res, response);
});

const getPermission = asyncHandler(async (req: Request, res: Response) => {
    const response = await Permissions.getPermission(req);
    return sendResponse(res, response);
});

const deletePermission = asyncHandler(async (req: Request, res: Response) => {
    const response = await Permissions.deletePermission(req);
    return sendResponse(res, response);
});

const updatePermission = asyncHandler(async (req: Request, res: Response) => {
    const response = await Permissions.updatePermission(req);
    return sendResponse(res, response);
});

const getPermissionList = asyncHandler(async (req: Request, res: Response) => {
    const response = await Permissions.getPermissions(req);
    return sendResponse(res, response);
});

export default {
    addPermission,
    getPermission,
    deletePermission,
    updatePermission,
    getPermissionList
};

import { Request, Response } from "express";
import { sendResponse } from "@app/utils/common";
import { asyncHandler } from "@app/middleware/async";
import { AddonService } from "../services/addons";

const addAddon = asyncHandler(async (req: Request, res: Response) => {
    const response = await AddonService.addAddon(req);
    return sendResponse(res, response);
});

const updateAddon = asyncHandler(async (req: Request, res: Response) => {
    const response = await AddonService.updateAddon(req);
    return sendResponse(res, response);
});

const getAddon = asyncHandler(async (req: Request, res: Response) => {
    const response = await AddonService.getAddon(req);
    return sendResponse(res, response);
});

const deleteAddon = asyncHandler(async (req: Request, res: Response) => {
    const response = await AddonService.deleteAddon(req);
    return sendResponse(res, response);
});

const getAddonList = asyncHandler(async (req: Request, res: Response) => {
    const response = await AddonService.list(req);
    return sendResponse(res, response);
});

export default {
    addAddon,
    updateAddon,
    getAddon,
    deleteAddon,
    getAddonList,
};

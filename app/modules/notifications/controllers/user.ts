import { Request, Response } from "express";
import { sendResponse } from "@app/utils/common";
import { asyncHandler } from "@app/middleware/async";
import { AddonService } from "../services/addons";

const getAddon = asyncHandler(async (req: Request, res: Response) => {
    const response = await AddonService.getAddon(req);
    return sendResponse(res, response);
});

const getAddonList = asyncHandler(async (req: Request, res: Response) => {
    const response = await AddonService.list(req);
    return sendResponse(res, response);
});

export default {
    getAddon,
    getAddonList,
};

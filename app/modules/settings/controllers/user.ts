import { Request, Response } from "express";
import { sendResponse } from "@app/utils/common";
import Settings from "../services/settings";
import { asyncHandler } from "@app/middleware/async";

const getSettings = asyncHandler(async (req: Request, res: Response) => {
    const response = await Settings.getSettings(req);
    return sendResponse(res, response);
});

export default {
    getSettings
};

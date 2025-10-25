import { Request, Response, NextFunction } from "express";
import { sendResponse } from "@app/utils/common";
import Media from "../services/media";
import { asyncHandler } from "@app/middleware/async";
const Upload = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = await Media.Upload(req);
    return sendResponse(res, response);
});

export default {
    Upload,
}
import { Request, Response } from "express";
import { sendResponse } from "@app/utils/common";
import Cms from "../services/cms";
import { asyncHandler } from "@app/middleware/async";

const getCms = asyncHandler(async (req: Request, res: Response) => {
    const response = await Cms.getCms(req);
    return sendResponse(res, response);
});

const listFaq = asyncHandler(async (req: Request, res: Response) => {
    const response = await Cms.listFaq(req);
    return sendResponse(res, response);
});

export default {
    getCms,
    listFaq
};

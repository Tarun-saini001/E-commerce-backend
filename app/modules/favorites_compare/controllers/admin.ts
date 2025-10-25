import { Request, Response } from "express";
import { sendResponse } from "@app/utils/common";
import { asyncHandler } from "@app/middleware/async";
import { FavoriteCompareService } from "../services/favurites_compare";

const add = asyncHandler(async (req: Request, res: Response) => {
    const response = await FavoriteCompareService.add(req);
    return sendResponse(res, response);
});

const remove = asyncHandler(async (req: Request, res: Response) => {
    const response = await FavoriteCompareService.remove(req);
    return sendResponse(res, response);
});

const list = asyncHandler(async (req: Request, res: Response) => {
    const response = await FavoriteCompareService.list(req);
    return sendResponse(res, response);
});

export default {
    add,
    remove,
    list
};

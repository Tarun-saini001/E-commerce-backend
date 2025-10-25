import { Request, Response } from "express";
import { sendResponse } from "@app/utils/common";
import { asyncHandler } from "@app/middleware/async";
import { DealershipService } from "../services/dealership";

const addDealership = asyncHandler(async (req: Request, res: Response) => {
    const response = await DealershipService.addDealership(req);
    return sendResponse(res, response);
});

const getDealership = asyncHandler(async (req: Request, res: Response) => {
    const response = await DealershipService.getDealership(req);
    return sendResponse(res, response);
});

const updateDealership = asyncHandler(async (req: Request, res: Response) => {
    const response = await DealershipService.updateDealership(req);
    return sendResponse(res, response);
});

const getDealershipList = asyncHandler(async (req: Request, res: Response) => {
    const response = await DealershipService.list(req);
    return sendResponse(res, response);
});

const deleteDealership = asyncHandler(async (req: Request, res: Response) => {
    const response = await DealershipService.deleteDealership(req);
    return sendResponse(res, response);
})

export default {
    addDealership,
    getDealership,
    getDealershipList,
    updateDealership,
    deleteDealership
};

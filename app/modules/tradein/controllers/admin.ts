import { Request, Response } from "express";
import { sendResponse } from "@app/utils/common";
import { TradeInService } from "../services/tradein";
import { asyncHandler } from "@app/middleware/async";

const addTradeIn = asyncHandler(async (req: Request, res: Response) => {
    const response = await TradeInService.addTradeIn(req);
    return sendResponse(res, response);
});

const updateTradeIn = asyncHandler(async (req: Request, res: Response) => {
    const response = await TradeInService.updateTradeIn(req);
    return sendResponse(res, response);
});

const getTradeIn = asyncHandler(async (req: Request, res: Response) => {
    const response = await TradeInService.getTradeIn(req);
    return sendResponse(res, response);
});

const deleteTradeIn = asyncHandler(async (req: Request, res: Response) => {
    const response = await TradeInService.deleteTradeIn(req);
    return sendResponse(res, response);
});

const getTradeInList = asyncHandler(async (req: Request, res: Response) => {
    const response = await TradeInService.list(req);
    return sendResponse(res, response);
});

export default {
    addTradeIn,
    updateTradeIn,
    getTradeIn,
    deleteTradeIn,
    getTradeInList,
};

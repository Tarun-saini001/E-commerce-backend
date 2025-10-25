import { Request, Response } from "express";
import { sendResponse } from "@app/utils/common";
import { SubscriptionPlanService } from "../services/subscriptionPlan";
import { asyncHandler } from "@app/middleware/async";

const addPlan = asyncHandler(async (req: Request, res: Response) => {
    const response = await SubscriptionPlanService.addPlan(req);
    return sendResponse(res, response);
});

const updatePlan = asyncHandler(async (req: Request, res: Response) => {
    const response = await SubscriptionPlanService.updatePlan(req);
    return sendResponse(res, response);
});

const getPlan = asyncHandler(async (req: Request, res: Response) => {
    const response = await SubscriptionPlanService.getPlan(req);
    return sendResponse(res, response);
});

const deletePlan = asyncHandler(async (req: Request, res: Response) => {
    const response = await SubscriptionPlanService.deletePlan(req);
    return sendResponse(res, response);
});

const getPlanList = asyncHandler(async (req: Request, res: Response) => {
    const response = await SubscriptionPlanService.list(req);
    return sendResponse(res, response);
});

export default {
    addPlan,
    updatePlan,
    getPlan,
    deletePlan,
    getPlanList,
};

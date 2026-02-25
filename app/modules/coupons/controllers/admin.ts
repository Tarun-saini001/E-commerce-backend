import { couponService } from "../services/coupon";
import { asyncHandler } from "@app/middleware/async";
import { Request, Response } from "express";
import { sendResponse } from "@app/utils/common";

const addCoupon = asyncHandler(async (req: Request, res: Response) => {
    const response = await couponService.addCoupon(req);
    return sendResponse(res, response);
})

const updateCoupon = asyncHandler(async (req: Request, res: Response) => {
    const response = await couponService.updateCoupon(req);
    return sendResponse(res, response);
})

const coupons = asyncHandler(async (req: Request, res: Response) => {
    const response = await couponService.coupons(req);
    return sendResponse(res, response);
})
export default {
    addCoupon,
    updateCoupon,
    coupons
}
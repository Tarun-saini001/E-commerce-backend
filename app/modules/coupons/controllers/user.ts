import { couponService } from "../services/coupon";
import { asyncHandler } from "@app/middleware/async";
import { Request, Response } from "express";
import { sendResponse } from "@app/utils/common";

const applyCoupon = asyncHandler(async (req: Request, res: Response) => {
    const response = await couponService.applyCoupon(req);
    return sendResponse(res, response);
})

const removeCoupon = asyncHandler(async (req: Request, res: Response) => {
    const response = await couponService.removeCoupon(req);
    return sendResponse(res, response);
})
export default {
    applyCoupon,
    removeCoupon
}
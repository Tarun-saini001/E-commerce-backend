import { cartService } from "../services/cart";
import { asyncHandler } from "@app/middleware/async";
import { Request, Response } from "express";
import { sendResponse } from "@app/utils/common";

const addToCart = asyncHandler(async (req: Request, res: Response) => {
    const response = await cartService.addToCart(req);
        return sendResponse(res,response);
})
const getCart = asyncHandler(async (req: Request, res: Response) => {
    const response = await cartService.getCart(req);
        return sendResponse(res,response);
})

const updateCart = asyncHandler(async (req: Request, res: Response) => {
    const response = await cartService.updateCart(req);
        return sendResponse(res,response);
})
const mergeGuestCart = asyncHandler(async (req: Request, res: Response) => {
    const response = await cartService.mergeGuestCart(req);
    return sendResponse(res, response);
})

export default {
    addToCart,
    getCart,
    updateCart,
    mergeGuestCart
}
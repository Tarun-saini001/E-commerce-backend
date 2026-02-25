import { productService } from "../services/product";
import { asyncHandler } from "@app/middleware/async";
import { Request, Response } from "express";
import { sendResponse } from "@app/utils/common";


const productList = asyncHandler( async (req: Request, res: Response) => {
    const response = await productService.productList(req);
    return sendResponse(res,response);
})


const getProductById = asyncHandler( async (req: Request, res: Response) => {
    const response = await productService.getProductById(req);
    return sendResponse(res,response);
})

const addToWishList = asyncHandler( async (req: Request, res: Response) => {
    const response = await productService.addToWishList(req);
    return sendResponse(res,response);
})
const getWishlist = asyncHandler( async (req: Request, res: Response) => {
    const response = await productService.getWishlist(req);
    return sendResponse(res,response);
})
export default {
    productList,
    getProductById,
    addToWishList,
    getWishlist
}
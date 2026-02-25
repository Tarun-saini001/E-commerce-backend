import { productService } from "../services/product";
import { asyncHandler } from "@app/middleware/async";
import { Request, Response } from "express";
import { sendResponse } from "@app/utils/common";

const addProduct = asyncHandler(async (req: Request, res: Response) => {
    const response = await productService.addProduct(req);
    return sendResponse(res, response);
})

const productList = asyncHandler( async (req: Request, res: Response) => {
    const response = await productService.productList(req);
    return sendResponse(res,response);
})

const getProductById = asyncHandler( async (req: Request, res: Response) => {
    const response = await productService.getProductById(req);
    return sendResponse(res,response);
})

const updateProduct = asyncHandler( async (req: Request, res: Response) => {
    const response = await productService.updateProduct(req);
    return sendResponse(res,response);
})

const updateBundleOffer = asyncHandler( async (req: Request, res: Response) => {
    const response = await productService.updateBundleOffer(req);
    return sendResponse(res,response);
})

const deleteProduct = asyncHandler( async (req: Request, res: Response) => {
    const response = await productService.deleteProduct(req);
    return sendResponse(res,response);
})

export default {
    addProduct,
    productList,
    getProductById,
    updateProduct,
    updateBundleOffer,
    deleteProduct
}
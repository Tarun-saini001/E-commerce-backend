import { brandService } from "../services/brand";
import { asyncHandler } from "@app/middleware/async";
import { Request, Response } from "express";
import { sendResponse } from "@app/utils/common";

const addBrand = asyncHandler(async (req: Request, res: Response) => {
    const response = await brandService.addBrand(req);
    return sendResponse(res, response);
})

const brandList = asyncHandler( async (req: Request, res: Response) => {
    const response = await brandService.brandList(req);
    return sendResponse(res,response);
})

const getBrandById = asyncHandler( async (req: Request, res: Response) => {
    const response = await brandService.getBrandById(req);
    return sendResponse(res,response);
})

const updateBrand = asyncHandler( async (req: Request, res: Response) => {
    const response = await brandService.updateBrand(req);
    return sendResponse(res,response);
})

const deleteBrand = asyncHandler( async (req: Request, res: Response) => {
    const response = await brandService.deleteBrand(req);
    return sendResponse(res,response);
})

export default {
    addBrand,
    brandList,
    getBrandById,
    updateBrand,
    deleteBrand
}
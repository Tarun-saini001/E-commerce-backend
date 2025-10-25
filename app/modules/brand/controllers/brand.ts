import { Request, Response } from "express";
import { sendResponse } from "@app/utils/common";
import { BrandService } from "../services/brand";
import { asyncHandler } from "@app/middleware/async";

const addBrand = asyncHandler(async (req: Request, res: Response) => {
    const response = await BrandService.addBrand(req);
    return sendResponse(res, response);
});

const getBrand = asyncHandler(async (req: Request, res: Response) => {
    const response = await BrandService.getBrand(req);
    return sendResponse(res, response);
});

const deleteBrand = asyncHandler(async (req: Request, res: Response) => {
    const response = await BrandService.deleteBrand(req);
    return sendResponse(res, response);
});

const updateBrand = asyncHandler(async (req: Request, res: Response) => {
    const response = await BrandService.updateBrand(req);
    return sendResponse(res, response);
});

const getBrandList = asyncHandler(async (req: Request, res: Response) => {
    const response = await BrandService.list(req);
    return sendResponse(res, response);
});

export default {
    addBrand,
    getBrand,
    deleteBrand,
    updateBrand,
    getBrandList,
};

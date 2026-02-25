import { brandService } from "../services/brand";
import { asyncHandler } from "@app/middleware/async";
import { Request, Response } from "express";
import { sendResponse } from "@app/utils/common";


const brandList = asyncHandler( async (req: Request, res: Response) => {
    const response = await brandService.brandList(req);
    return sendResponse(res,response);
})


const getBrandById = asyncHandler( async (req: Request, res: Response) => {
    const response = await brandService.getBrandById(req);
    return sendResponse(res,response);
})
export default {
    brandList,
    getBrandById
}



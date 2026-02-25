import { categoryService } from "../services/category";
import { asyncHandler } from "@app/middleware/async";
import { Request, Response } from "express";
import { sendResponse } from "@app/utils/common";


const categoryList = asyncHandler( async (req: Request, res: Response) => {
    const response = await categoryService.categoryList(req);
    return sendResponse(res,response);
})


const getCategoryById = asyncHandler( async (req: Request, res: Response) => {
    const response = await categoryService.getCategoryById(req);
    return sendResponse(res,response);
})
export default {
    categoryList,
    getCategoryById
}
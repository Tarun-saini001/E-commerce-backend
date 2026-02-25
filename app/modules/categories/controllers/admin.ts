import { categoryService } from "../services/category";
import { asyncHandler } from "@app/middleware/async";
import { Request, Response } from "express";
import { sendResponse } from "@app/utils/common";

const addCategory = asyncHandler(async (req: Request, res: Response) => {
    const response = await categoryService.addCategory(req);
    return sendResponse(res, response);
})

const categoryList = asyncHandler( async (req: Request, res: Response) => {
    const response = await categoryService.categoryList(req);
    return sendResponse(res,response);
})

const getCategoryById = asyncHandler( async (req: Request, res: Response) => {
    const response = await categoryService.getCategoryById(req);
    return sendResponse(res,response);
})

const updateCategory = asyncHandler( async (req: Request, res: Response) => {
    const response = await categoryService.updateCategory(req);
    return sendResponse(res,response);
})

const deleteCategory = asyncHandler( async (req: Request, res: Response) => {
    const response = await categoryService.deleteCategory(req);
    return sendResponse(res,response);
})

export default {
    addCategory,
    categoryList,
    getCategoryById,
    updateCategory,
    deleteCategory
}
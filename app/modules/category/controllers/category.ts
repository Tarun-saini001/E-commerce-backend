import { Request, Response } from "express";
import { sendResponse } from "@app/utils/common";
import { CategoryService } from "../services/category";
import { asyncHandler } from "@app/middleware/async";

const addCategory = asyncHandler(async (req: Request, res: Response) => {
    const response = await CategoryService.addCategory(req);
    return sendResponse(res, response);
});

const getCategory = asyncHandler(async (req: Request, res: Response) => {
    const response = await CategoryService.getCategory(req);
    return sendResponse(res, response);
});

const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const response = await CategoryService.deleteCategory(req);
    return sendResponse(res, response);
});

const updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const response = await CategoryService.updateCategory(req);
    return sendResponse(res, response);
});

const getCategoryList = asyncHandler(async (req: Request, res: Response) => {
    const response = await CategoryService.list(req);
    return sendResponse(res, response);
});

export default {
    addCategory,
    getCategory,
    deleteCategory,
    updateCategory,
    getCategoryList,
};

import { Request, Response } from "express";
import { sendResponse } from "@app/utils/common";
import Cms from "../services/cms";
import { asyncHandler } from "@app/middleware/async";

const addCms = asyncHandler(async (req: Request, res: Response) => {
    const response = await Cms.addCms(req);
    return sendResponse(res, response);
});

const getCms = asyncHandler(async (req: Request, res: Response) => {
    const response = await Cms.getCms(req);
    return sendResponse(res, response);
});

const addFaq = asyncHandler(async (req: Request, res: Response) => {
    const response = await Cms.addFaq(req);
    return sendResponse(res, response);
});

const listFaq = asyncHandler(async (req: Request, res: Response) => {
    const response = await Cms.listFaq(req);
    return sendResponse(res, response);
});

const getFaq = asyncHandler(async (req: Request, res: Response) => {
    const response = await Cms.getFaq(req);
    return sendResponse(res, response);
});

const editFaq = asyncHandler(async (req: Request, res: Response) => {
    const response = await Cms.editFaq(req);
    return sendResponse(res, response);
});

const deleteFaq = asyncHandler(async (req: Request, res: Response) => {
    const response = await Cms.deleteFaq(req);
    return sendResponse(res, response);
});

export default {
    addCms,
    getCms,
    addFaq,
    listFaq,
    getFaq,
    editFaq,
    deleteFaq
};

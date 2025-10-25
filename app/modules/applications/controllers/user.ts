import { Request, Response } from "express";
import { sendResponse } from "@app/utils/common";
import { ApplicationService } from "../services/application";
import { asyncHandler } from "@app/middleware/async";

const addApplication = asyncHandler(async (req: Request, res: Response) => {
    const response = await ApplicationService.addApplication(req);
    return sendResponse(res, response);
});

const getApplication = asyncHandler(async (req: Request, res: Response) => {
    const response = await ApplicationService.getApplication(req);
    return sendResponse(res, response);
});

const getApplicationList = asyncHandler(async (req: Request, res: Response) => {
    const response = await ApplicationService.list(req);
    return sendResponse(res, response);
});

const counterPrice = asyncHandler(async (req: Request, res: Response) => {
    const response = await ApplicationService.counterPrice(req);
    return sendResponse(res, response);
});

const addDocument = asyncHandler(async (req: Request, res: Response) => {
    const response = await ApplicationService.addDocument(req);
    return sendResponse(res, response);
});

const removeDocument = asyncHandler(async (req: Request, res: Response) => {
    const response = await ApplicationService.removeDocument(req);
    return sendResponse(res, response);
});

const updateDocumentStatus = asyncHandler(async (req: Request, res: Response) => {
    const response = await ApplicationService.updateDocumentStatus(req);
    return sendResponse(res, response);
});

const sendMessage = asyncHandler(async (req: Request, res: Response) => {
    const response = await ApplicationService.sendMessage(req);
    return sendResponse(res, response);
});

export default {
    addApplication,
    getApplication,
    getApplicationList,
    counterPrice,
    addDocument,
    removeDocument,
    updateDocumentStatus,
    sendMessage,
};

import { Request, Response } from "express";
import { sendResponse } from "@app/utils/common";
import { asyncHandler } from "@app/middleware/async";
import { DocumentService } from "../services/documents";

const addDocuments = asyncHandler(async (req: Request, res: Response) => {
    const response = await DocumentService.addDocuments(req);
    return sendResponse(res, response);
});

const updateDocument = asyncHandler(async (req: Request, res: Response) => {
    const response = await DocumentService.updateDocument(req);
    return sendResponse(res, response);
});

const getDocument = asyncHandler(async (req: Request, res: Response) => {
    const response = await DocumentService.getDocument(req);
    return sendResponse(res, response);
});

const deleteDocument = asyncHandler(async (req: Request, res: Response) => {
    const response = await DocumentService.deleteDocument(req);
    return sendResponse(res, response);
});

const getDocumentList = asyncHandler(async (req: Request, res: Response) => {
    const response = await DocumentService.list(req);
    return sendResponse(res, response);
});

export default {
    addDocuments,
    updateDocument,
    getDocument,
    deleteDocument,
    getDocumentList
};

import { Request, Response } from "express";
import { sendResponse } from "@app/utils/common";
import { InvoiceService } from "../services/invoice";
import { asyncHandler } from "@app/middleware/async";

const createInvoice = asyncHandler(async (req: Request, res: Response) => {
    const response = await InvoiceService.createInvoice(req);
    return sendResponse(res, response);
});

const getInvoice = asyncHandler(async (req: Request, res: Response) => {
    const response = await InvoiceService.getInvoice(req);
    return sendResponse(res, response);
});

const getInvoiceList = asyncHandler(async (req: Request, res: Response) => {
    const response = await InvoiceService.list(req);
    return sendResponse(res, response);
});

export default {
    createInvoice,
    getInvoice,
    getInvoiceList,
};

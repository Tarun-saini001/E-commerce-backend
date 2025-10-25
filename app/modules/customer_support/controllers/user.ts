import { Request, Response } from "express";
import { sendResponse } from "@app/utils/common";
import { asyncHandler } from "@app/middleware/async";
import { CustomerSupportService } from "../services/customerSupport";

const createTicket = asyncHandler(async (req: Request, res: Response) => {
    const response = await CustomerSupportService.createTicket(req);
    return sendResponse(res, response);
});

const getTicket = asyncHandler(async (req: Request, res: Response) => {
    const response = await CustomerSupportService.getTicket(req);
    return sendResponse(res, response);
});

const updateTicket = asyncHandler(async (req: Request, res: Response) => {
    const response = await CustomerSupportService.updateTicket(req);
    return sendResponse(res, response);
});

const deleteTicket = asyncHandler(async (req: Request, res: Response) => {
    const response = await CustomerSupportService.deleteTicket(req);
    return sendResponse(res, response);
});

const listTickets = asyncHandler(async (req: Request, res: Response) => {
    const response = await CustomerSupportService.listTickets(req);
    return sendResponse(res, response);
});

const sendMessage = asyncHandler(async (req: Request, res: Response) => {
    const response = await CustomerSupportService.sendMessage(req);
    return sendResponse(res, response);
});

const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
    const response = await CustomerSupportService.deleteMessage(req);
    return sendResponse(res, response);
});

export default {
    createTicket,
    getTicket,
    updateTicket,
    deleteTicket,
    listTickets,
    sendMessage,
    deleteMessage,
};

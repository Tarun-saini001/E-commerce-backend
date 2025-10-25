import { Request, Response } from "express";
import { sendResponse } from "@app/utils/common";
import { NotificationService } from "../services/notification";
import { asyncHandler } from "@app/middleware/async";

const addNotification = asyncHandler(async (req: Request, res: Response) => {
    const response = await NotificationService.addNotification(req);
    return sendResponse(res, response);
});

const markAsRead = asyncHandler(async (req: Request, res: Response) => {
    const response = await NotificationService.markAsRead(req);
    return sendResponse(res, response);
});

const getNotification = asyncHandler(async (req: Request, res: Response) => {
    const response = await NotificationService.getNotification(req);
    return sendResponse(res, response);
});

const deleteNotification = asyncHandler(async (req: Request, res: Response) => {
    const response = await NotificationService.deleteNotification(req);
    return sendResponse(res, response);
});

const getNotificationList = asyncHandler(async (req: Request, res: Response) => {
    const response = await NotificationService.list(req);
    return sendResponse(res, response);
});

export default {
    addNotification,
    markAsRead,
    getNotification,
    deleteNotification,
    getNotificationList,
};

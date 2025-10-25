import { Request, Response } from "express";
import { sendResponse } from "@app/utils/common";
import { BookingService } from "../services/booking";
import { asyncHandler } from "@app/middleware/async";

const addBooking = asyncHandler(async (req: Request, res: Response) => {
    const response = await BookingService.addBooking(req);
    return sendResponse(res, response);
});

const updateBooking = asyncHandler(async (req: Request, res: Response) => {
    const response = await BookingService.updateBooking(req);
    return sendResponse(res, response);
});

const getBooking = asyncHandler(async (req: Request, res: Response) => {
    const response = await BookingService.getBooking(req);
    return sendResponse(res, response);
});

const deleteBooking = asyncHandler(async (req: Request, res: Response) => {
    const response = await BookingService.deleteBooking(req);
    return sendResponse(res, response);
});

const getBookingList = asyncHandler(async (req: Request, res: Response) => {
    const response = await BookingService.list(req);
    return sendResponse(res, response);
});

export default {
    addBooking,
    updateBooking,
    getBooking,
    deleteBooking,
    getBookingList,
};

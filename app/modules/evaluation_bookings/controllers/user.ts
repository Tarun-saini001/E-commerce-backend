import { Request, Response } from "express";
import { sendResponse } from "@app/utils/common";
import { AppointmentService } from "../services/appointment";
import { asyncHandler } from "@app/middleware/async";

const addAppointment = asyncHandler(async (req: Request, res: Response) => {
    const response = await AppointmentService.addAppointment(req);
    return sendResponse(res, response);
});

const getAppointment = asyncHandler(async (req: Request, res: Response) => {
    const response = await AppointmentService.getAppointment(req);
    return sendResponse(res, response);
});

const getAppointmentList = asyncHandler(async (req: Request, res: Response) => {
    const response = await AppointmentService.list(req);
    return sendResponse(res, response);
});

export default {
    addAppointment,
    getAppointment,
    getAppointmentList,
};

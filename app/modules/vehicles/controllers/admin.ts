import { Request, Response } from "express";
import { sendResponse } from "@app/utils/common";
import { VehicleService } from "../services/vehicle";
import { asyncHandler } from "@app/middleware/async";

const addVehicle = asyncHandler(async (req: Request, res: Response) => {
    const response = await VehicleService.addVehicle(req);
    return sendResponse(res, response);
});

const getVehicle = asyncHandler(async (req: Request, res: Response) => {
    const response = await VehicleService.getVehicle(req);
    return sendResponse(res, response);
});

const deleteVehicle = asyncHandler(async (req: Request, res: Response) => {
    const response = await VehicleService.deleteVehicle(req);
    return sendResponse(res, response);
});

const updateVehicle = asyncHandler(async (req: Request, res: Response) => {
    const response = await VehicleService.updateVehicle(req);
    return sendResponse(res, response);
});

const getVehicleList = asyncHandler(async (req: Request, res: Response) => {
    const response = await VehicleService.list(req);
    return sendResponse(res, response);
});

const holdVehicle = asyncHandler(async (req: Request, res: Response) => {
    const response = await VehicleService.holdVehicle(req);
    return sendResponse(res, response);
});

const releaseVehicleHold = asyncHandler(async (req: Request, res: Response) => {
    const response = await VehicleService.releaseVehicleHold(req);
    return sendResponse(res, response);
});

export default {
    addVehicle,
    getVehicle,
    deleteVehicle,
    updateVehicle,
    getVehicleList,
    holdVehicle,
    releaseVehicleHold
};

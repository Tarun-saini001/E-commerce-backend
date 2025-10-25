import { Request } from "express";
import { createErrorResponse, createSuccessResponse } from "@app/utils/common";
import { RESPONSE_STATUS, ROLES, VEHICLE_STATUS } from "@app/config/constants";
import { defaultPaginationConfig } from "@app/utils/pagination";
import Vehicle from "../models/vehicles";
import { VehicleType } from "../validation/vehicle";
import { validateUserAuth } from "@app/modules/onboarding/services/common";
import agenda from "bin/agenda";

export const VehicleService = {
    addVehicle: async (req: Request) => {
        const body: VehicleType = req.body;
        const exists = await Vehicle.findOne({ vin: body.vin });
        if (exists) {
            return createErrorResponse(RESPONSE_STATUS.ALREADY_EXISTS, req.t("VEHICLE_ALREADY_EXISTS"));
        }
        const vehicle = await Vehicle.create(body);
        return createSuccessResponse(vehicle, req.t("VEHICLE_ADDED_SUCCESSFULLY"));
    },

    updateVehicle: async (req: Request) => {
        const body: VehicleType = req.body;
        const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, body, { new: true });
        if (!vehicle) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("VEHICLE_NOT_FOUND"));
        }
        return createSuccessResponse(vehicle, req.t("VEHICLE_UPDATED_SUCCESSFULLY"));
    },

    getVehicle: async (req: Request) => {
        const vehicle = await Vehicle.findById(req.params.id)
            .populate("category")
            .populate("brand")
            .populate("dealership");
        if (!vehicle) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("VEHICLE_NOT_FOUND"));
        }
        return createSuccessResponse(vehicle, req.t("VEHICLE_FETCHED_SUCCESSFULLY"));
    },

    deleteVehicle: async (req: Request) => {
        const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!vehicle) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("VEHICLE_NOT_FOUND"));
        }
        return createSuccessResponse({}, req.t("VEHICLE_DELETED_SUCCESSFULLY"));
    },

    list: async (req: Request) => {
        const options = {
            page: req.query.page || defaultPaginationConfig.page,
            limit: req.query.limit || defaultPaginationConfig.limit,
            sort: req.query.sort || { createdAt: -1 },
        };

        const query: any = { isDeleted: false };

        if (req.query.search) {
            query.$or = [
                { vin: { $regex: req.query.search, $options: "i" } },
                { make: { $regex: req.query.search, $options: "i" } },
                { model: { $regex: req.query.search, $options: "i" } },
            ];
        }

        const vehicles = await Vehicle.paginate(query, options);
        return createSuccessResponse(vehicles, req.t("VEHICLE_LIST_FETCHED_SUCCESSFULLY"));
    },

    holdVehicle: async (req: Request) => {
        const result = validateUserAuth(req);

        if (!("user" in result)) {
            return createErrorResponse(
                RESPONSE_STATUS.RECORD_NOT_FOUND,
                req.t("ACCOUNT_NOT_FOUND"),
            );
        }

        let userId;
        const isUser = result.user.role == ROLES.USER;
        if (isUser) {
            userId = result.user.id;
        } else {
            userId = req.body.userId;
        }

        const holdUntil = new Date(req.body.holdUntil);
        const vehicle = await Vehicle.findByIdAndUpdate(
            req.params.id,
            { status: VEHICLE_STATUS.HOLD, hold: { heldBy: userId, holdUntil } },
            { new: true }
        );

        if (!vehicle) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("VEHICLE_NOT_FOUND"));
        }

        await agenda.schedule(holdUntil, "release vehicle hold", { vehicleId: vehicle._id });

        return createSuccessResponse(vehicle, req.t("VEHICLE_HELD_SUCCESSFULLY"));
    },

    releaseVehicleHold: async (req: Request) => {
        const vehicle = await Vehicle.findByIdAndUpdate(
            req.params.id,
            { status: VEHICLE_STATUS.AVAILABLE, hold: null },
            { new: true }
        );
        if (!vehicle) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("VEHICLE_NOT_FOUND"));
        }
        return createSuccessResponse(vehicle, req.t("VEHICLE_REACTIVATED_SUCCESSFULLY"));
    },
};

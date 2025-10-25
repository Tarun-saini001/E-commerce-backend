import { Request } from "express";
import { createErrorResponse, createSuccessResponse } from "@app/utils/common";
import { RESPONSE_STATUS, ROLES } from "@app/config/constants";
import { defaultPaginationConfig } from "@app/utils/pagination";
import { AppointmentType } from "../validations/appointment";
import Appointments from "../models/bookings";
import { validateUserAuth } from "@app/modules/onboarding/services/common";

export const AppointmentService = {
    addAppointment: async (req: Request) => {
        const body: AppointmentType = req.body;

        const result = validateUserAuth(req);

        if (!("user" in result)) {
            return createErrorResponse(
                RESPONSE_STATUS.RECORD_NOT_FOUND,
                req.t("ACCOUNT_NOT_FOUND"),
            );
        }

        const isUser = result.user.role == ROLES.USER;

        if (isUser) (body as any).userId = result.user.id

        if (!isUser && req.body.userId) body.userId = req.body.userId

        const appointment = await Appointments.create(body);
        return createSuccessResponse(appointment, req.t("APPOINTMENT_CREATED_SUCCESSFULLY"));
    },

    updateAppointment: async (req: Request) => {
        const body: Partial<AppointmentType> = req.body;
        const appointment = await Appointments.findByIdAndUpdate(req.params.id, body, { new: true });

        if (!appointment) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("APPOINTMENT_NOT_FOUND"));
        }

        return createSuccessResponse(appointment, req.t("APPOINTMENT_UPDATED_SUCCESSFULLY"));
    },

    getAppointment: async (req: Request) => {
        const appointment = await Appointments.findById(req.params.id).populate("brand");

        if (!appointment) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("APPOINTMENT_NOT_FOUND"));
        }

        return createSuccessResponse(appointment, req.t("APPOINTMENT_FETCHED_SUCCESSFULLY"));
    },

    deleteAppointment: async (req: Request) => {
        const appointment = await Appointments.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );

        if (!appointment) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("APPOINTMENT_NOT_FOUND"));
        }

        return createSuccessResponse(appointment, req.t("APPOINTMENT_DELETED_SUCCESSFULLY"));
    },

    list: async (req: Request) => {
        const result = validateUserAuth(req);

        if (!("user" in result)) {
            return createErrorResponse(
                RESPONSE_STATUS.RECORD_NOT_FOUND,
                req.t("ACCOUNT_NOT_FOUND"),
            );
        }

        const options = {
            page: req.query.page || defaultPaginationConfig.page,
            limit: req.query.limit || defaultPaginationConfig.limit,
            sort: req.query.sort || { createdAt: -1 },
        };

        const query: any = { isDeleted: false };

        const isUser = result.user.role == ROLES.USER

        if (isUser) {
            query.userId = result.user.id
        }

        if (!isUser && req.query.userId) query.userId = req.query.userId
        if (req.query.status) query.status = req.query.status;
        if (req.query.sellingIn) query.sellingIn = req.query.sellingIn;
        if (req.query.search) {
            query.$or = [
                { vin: { $regex: req.query.search, $options: "i" } },
                { make: { $regex: req.query.search, $options: "i" } },
                { model: { $regex: req.query.search, $options: "i" } },
                { plateNumber: { $regex: req.query.search, $options: "i" } },
            ];
        }

        const appointments = await Appointments.paginate(query, options);
        return createSuccessResponse(appointments, req.t("APPOINTMENT_LIST_FETCHED_SUCCESSFULLY"));
    },
};

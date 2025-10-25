import { Request } from "express";
import { createErrorResponse, createSuccessResponse } from "@app/utils/common";
import { RESPONSE_STATUS, ROLES } from "@app/config/constants";
import { defaultPaginationConfig } from "@app/utils/pagination";
import { TradeInType } from "../validations/tradein";
import { TradeIn } from "../models/tradein";
import { validateUserAuth } from "@app/modules/onboarding/services/common";
import Appointments from "@app/modules/evaluation_bookings/models/bookings";

export const TradeInService = {
    addTradeIn: async (req: Request) => {
        const body: TradeInType = req.body;
        const result = validateUserAuth(req);

        if (!("user" in result)) {
            return createErrorResponse(
                RESPONSE_STATUS.RECORD_NOT_FOUND,
                req.t("ACCOUNT_NOT_FOUND")
            );
        }
        const isUser = result.user.role == ROLES.USER;
        if (isUser) {
            body.userId = result.user.id;
        } else if (!body.userId) {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("USER_ID_REQUIRED")
            );
        }

        const tradeIn = await TradeIn.create(body);
        return createSuccessResponse(tradeIn, req.t("TRADEIN_REQUEST_SUBMITTED_SUCCESSFULLY"));
    },

    updateTradeIn: async (req: Request) => {
        const body: Partial<TradeInType> = req.body;

        const tradeIn = await TradeIn.findById(req.params.id);
        if (!tradeIn) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("TRADEIN_NOT_FOUND"));
        }
        const updatedTradeIn = await Appointments.findByIdAndUpdate(
            tradeIn.evaluationBooking,
            body,
            { new: true }
        );

        return createSuccessResponse(updatedTradeIn, req.t("TRADEIN_UPDATED_SUCCESSFULLY"));
    },

    getTradeIn: async (req: Request) => {
        const tradeIn = await TradeIn.findById(req.params.id).populate("userId").populate("evaluationBooking");
        if (!tradeIn) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("TRADEIN_NOT_FOUND"));
        }
        return createSuccessResponse(tradeIn, req.t("TRADEIN_FETCHED_SUCCESSFULLY"));
    },

    deleteTradeIn: async (req: Request) => {
        const tradeIn = await TradeIn.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!tradeIn) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("TRADEIN_NOT_FOUND"));
        }
        return createSuccessResponse(tradeIn, req.t("TRADEIN_DELETED_SUCCESSFULLY"));
    },

    list: async (req: Request) => {
        const result = validateUserAuth(req);

        if (!("user" in result)) {
            return createErrorResponse(
                RESPONSE_STATUS.RECORD_NOT_FOUND,
                req.t("ACCOUNT_NOT_FOUND")
            );
        }

        const options = {
            page: req.query.page || defaultPaginationConfig.page,
            limit: req.query.limit || defaultPaginationConfig.limit,
            sort: req.query.sort || { createdAt: -1 },
            populate: ["userId", "evaluationBooking"],
        };

        const query: any = { isDeleted: false };
        const isUser = result.user.role == ROLES.USER;

        if (isUser) {
            query.userId = result.user.id;
        } else if (req.query.userId && !isUser) {
            query.userId = req.query.userId;
        }
        if (req.query.status) query.status = req.query.status;

        const tradeIns = await TradeIn.paginate(query, options);
        return createSuccessResponse(tradeIns, req.t("TRADEIN_LIST_FETCHED_SUCCESSFULLY"));
    },
};

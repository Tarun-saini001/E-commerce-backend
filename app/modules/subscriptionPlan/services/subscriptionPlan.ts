import { Request } from "express";
import { createErrorResponse, createSuccessResponse } from "@app/utils/common";
import { RESPONSE_STATUS } from "@app/config/constants";
import { defaultPaginationConfig } from "@app/utils/pagination";
import { SubscriptionPlanType } from "../validations/subscriptionPlan";
import { SubscriptionPlan } from "../models/subscriptions";

export const SubscriptionPlanService = {
    addPlan: async (req: Request) => {
        const body: SubscriptionPlanType = req.body;

        const exists = await SubscriptionPlan.findOne({ name: body.name, isDeleted: false });
        if (exists) {
            return createErrorResponse(RESPONSE_STATUS.ALREADY_EXISTS, req.t("PLAN_ALREADY_EXISTS"));
        }

        const plan = await SubscriptionPlan.create(body);
        return createSuccessResponse(plan, req.t("PLAN_CREATED_SUCCESSFULLY"));
    },

    updatePlan: async (req: Request) => {
        const body: Partial<SubscriptionPlanType> = req.body;

        const plan = await SubscriptionPlan.findByIdAndUpdate(req.params.id, body, { new: true });
        if (!plan) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("PLAN_NOT_FOUND"));
        }
        return createSuccessResponse(plan, req.t("PLAN_UPDATED_SUCCESSFULLY"));
    },

    getPlan: async (req: Request) => {
        const plan = await SubscriptionPlan.findById(req.params.id);
        if (!plan) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("PLAN_NOT_FOUND"));
        }
        return createSuccessResponse(plan, req.t("PLAN_FETCHED_SUCCESSFULLY"));
    },

    deletePlan: async (req: Request) => {
        const plan = await SubscriptionPlan.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!plan) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("PLAN_NOT_FOUND"));
        }
        return createSuccessResponse(plan, req.t("PLAN_DELETED_SUCCESSFULLY"));
    },

    list: async (req: Request) => {
        const options = {
            page: req.query.page || defaultPaginationConfig.page,
            limit: req.query.limit || defaultPaginationConfig.limit,
            sort: req.query.sort || { createdAt: -1 },
        };

        const query: any = { isDeleted: false };
        if (req.query.isActive !== undefined) query.isActive = req.query.isActive === "true";

        const plans = await SubscriptionPlan.paginate(query, options);
        return createSuccessResponse(plans, req.t("PLAN_LIST_FETCHED_SUCCESSFULLY"));
    },
};

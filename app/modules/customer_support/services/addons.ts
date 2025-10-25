import { Request } from "express";
import { createErrorResponse, createSuccessResponse } from "@app/utils/common";
import { RESPONSE_STATUS } from "@app/config/constants";
import { defaultPaginationConfig } from "@app/utils/pagination";
import { AddonType } from "../validations/addons";
import { AddOn } from "../models/addons";

export const AddonService = {
    addAddon: async (req: Request) => {
        const body: AddonType = req.body;

        const exists = await AddOn.findOne({ name: body.name, isDeleted: false });
        if (exists) {
            return createErrorResponse(RESPONSE_STATUS.ALREADY_EXISTS, req.t("ADDON_ALREADY_EXISTS"));
        }

        const addon = await AddOn.create(body);
        return createSuccessResponse(addon, req.t("ADDON_CREATED_SUCCESSFULLY"));
    },

    updateAddon: async (req: Request) => {
        const body: Partial<AddonType> = req.body;
        const addon = await AddOn.findByIdAndUpdate(req.params.id, body, { new: true });
        if (!addon) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("ADDON_NOT_FOUND"));
        }
        return createSuccessResponse(addon, req.t("ADDON_UPDATED_SUCCESSFULLY"));
    },

    getAddon: async (req: Request) => {
        const addon = await AddOn.findById(req.params.id);
        if (!addon) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("ADDON_NOT_FOUND"));
        }
        return createSuccessResponse(addon, req.t("ADDON_FETCHED_SUCCESSFULLY"));
    },

    deleteAddon: async (req: Request) => {
        const addon = await AddOn.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!addon) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("ADDON_NOT_FOUND"));
        }
        return createSuccessResponse(addon, req.t("ADDON_DELETED_SUCCESSFULLY"));
    },

    list: async (req: Request) => {
        const options = {
            page: req.query.page || defaultPaginationConfig.page,
            limit: req.query.limit || defaultPaginationConfig.limit,
            sort: req.query.sort || { createdAt: -1 },
        };

        const query: any = { isDeleted: false };
        if (req.query.type) query.type = req.query.type;
        if (req.query.vehicleId) query.vehicleId = req.query.vehicleId;

        const addons = await AddOn.paginate(query, options);
        return createSuccessResponse(addons, req.t("ADDON_LIST_FETCHED_SUCCESSFULLY"));
    },
};

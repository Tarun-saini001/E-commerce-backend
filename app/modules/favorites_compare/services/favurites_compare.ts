import { Request } from "express";
import { createErrorResponse, createSuccessResponse } from "@app/utils/common";
import { RESPONSE_STATUS } from "@app/config/constants";
import { defaultPaginationConfig } from "@app/utils/pagination";
import { FavoriteType } from "../validations/favorites_compare";
import { Favorite_Compare } from "../models/favorite_compare";

export const FavoriteCompareService = {
    add: async (req: Request) => {
        const body: FavoriteType = req.body;

        const exists = await Favorite_Compare.findOne({
            userId: body.userId,
            vehicleId: body.vehicleId,
            type: body.type,
        });

        if (exists) {
            return createErrorResponse(RESPONSE_STATUS.ALREADY_EXISTS, req.t("ALREADY_EXISTS"));
        }

        const favorite = await Favorite_Compare.create(body);
        return createSuccessResponse(favorite, req.t("ADDED_SUCCESSFULLY"));
    },

    remove: async (req: Request) => {
        const removed = await Favorite_Compare.findByIdAndDelete(req.params.id);
        if (!removed) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("NOT_FOUND"));
        }
        return createSuccessResponse(removed, req.t("FAVORITE_REMOVED_SUCCESSFULLY"));
    },

    list: async (req: Request) => {
        const options = {
            page: req.query.page || defaultPaginationConfig.page,
            limit: req.query.limit || defaultPaginationConfig.limit,
            sort: req.query.sort || { createdAt: -1 },
        };

        const query: any = {
            userId: req.query.userId,
            type: req.query.type,
        };

        const favorites = await Favorite_Compare.paginate(query, options);
        return createSuccessResponse(favorites, req.t("FETCHED_SUCCESSFULLY"));
    },
};

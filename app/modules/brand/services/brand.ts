import { Request } from "express";
import { createErrorResponse, createSuccessResponse } from "@app/utils/common";
import { RESPONSE_STATUS } from "@app/config/constants";
import { defaultPaginationConfig } from "@app/utils/pagination";
import { BrandType } from "../validations/brand";
import { Brand } from "../models/brands";

export const BrandService = {
    addBrand: async (req: Request) => {
        const body: BrandType = req.body;
        const exists = await Brand.findOne({ name: body.name, isDeleted: false });
        if (exists) {
            return createErrorResponse(RESPONSE_STATUS.ALREADY_EXISTS, req.t("BRAND_ALREADY_EXISTS"));
        }

        const brand = await Brand.create(body);
        return createSuccessResponse(brand, req.t("BRAND_ADDED_SUCCESSFULLY"));
    },

    updateBrand: async (req: Request) => {
        const body: BrandType = req.body;
        const brand = await Brand.findByIdAndUpdate(req.params.id, body, { new: true });
        if (!brand) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("BRAND_NOT_FOUND"));
        }
        return createSuccessResponse(brand, req.t("BRAND_UPDATED_SUCCESSFULLY"));
    },

    getBrand: async (req: Request) => {
        const brand = await Brand.findById(req.params.id);
        if (!brand) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("BRAND_NOT_FOUND"));
        }
        return createSuccessResponse(brand, req.t("BRAND_FETCHED_SUCCESSFULLY"));
    },

    deleteBrand: async (req: Request) => {
        const brand = await Brand.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!brand) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("BRAND_NOT_FOUND"));
        }
        return createSuccessResponse(brand, req.t("BRAND_DELETED_SUCCESSFULLY"));
    },

    list: async (req: Request) => {
        const options = {
            page: req.query.page || defaultPaginationConfig.page,
            limit: req.query.limit || defaultPaginationConfig.limit,
            sort: req.query.sort || { createdAt: -1 },
        };

        const query: any = { isDeleted: false };

        if (req.query.search) {
            query.name = { $regex: req.query.search, $options: "i" };
        }

        const brands = await Brand.paginate(query, options);
        return createSuccessResponse(brands, req.t("BRAND_LIST_FETCHED_SUCCESSFULLY"));
    },
};

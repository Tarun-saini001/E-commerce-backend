import { Request } from "express";
import { CategoryType } from "../validation/category";
import { createErrorResponse, createSuccessResponse } from "@app/utils/common";
import { RESPONSE_STATUS } from "@app/config/constants";
import { defaultPaginationConfig } from "@app/utils/pagination";
import { Category } from "../models/category";

export const CategoryService = {
    addCategory: async (req: Request) => {
        const body: CategoryType = req.body;
        const exists = await Category.findOne({ name: body.name, isDeleted: false });
        if (exists) {
            return createErrorResponse(RESPONSE_STATUS.ALREADY_EXISTS, req.t("CATEGORY_ALREADY_EXISTS"));
        }
        const category = await Category.create(body);
        return createSuccessResponse(category, req.t("CATEGORY_ADDED_SUCCESSFULLY"));
    },

    updateCategory: async (req: Request) => {
        const body: CategoryType = req.body;
        const category = await Category.findByIdAndUpdate(req.params.id, body, { new: true });
        if (!category) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("CATEGORY_NOT_FOUND"));
        }
        return createSuccessResponse(category, req.t("CATEGORY_UPDATED_SUCCESSFULLY"));
    },

    getCategory: async (req: Request) => {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("CATEGORY_NOT_FOUND"));
        }
        return createSuccessResponse(category, req.t("CATEGORY_FETCHED_SUCCESSFULLY"));
    },

    deleteCategory: async (req: Request) => {
        const category = await Category.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!category) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("CATEGORY_NOT_FOUND"));
        }
        return createSuccessResponse(category, req.t("CATEGORY_DELETED_SUCCESSFULLY"));
    },

    list: async (req: Request) => {
        const options = {
            page: req.query.page || defaultPaginationConfig.page,
            limit: req.query.limit || defaultPaginationConfig.limit,
            sort: req.query.sort || { createdAt: -1 },
        };

        const query: any = { isDeleted: false, parent: null };

        if (req.query.search) {
            query.name = { $regex: req.query.search, $options: "i" };
        }

        if (req.query.parent) {
            query.parent = req.query.parent;
        }

        const categories = await Category.paginate(query, options);
        return createSuccessResponse(categories, req.t("CATEGORY_LIST_FETCHED_SUCCESSFULLY"));
    },
};

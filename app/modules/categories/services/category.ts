import category from "../models/category";
import { addCategory, updateCategory } from "../validation/category";
import { createErrorResponse, createSuccessResponse } from "@app/utils/common";
import { RESPONSE_STATUS } from "@app/config/constants";
import { Request } from "express";



export const categoryService = {
    addCategory: async (req: Request) => {
        const body: addCategory = req.body;
        if (!body) {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("MISSING_BODY_IN_REQUEST"),
            );
        }
        if (!body.categoryName) {
            return createErrorResponse(
                RESPONSE_STATUS.RECORD_NOT_FOUND,
                req.t("CATEGORY_NAME_REQUIRED")
            );
        }
        await category.create(body);
        let data = createSuccessResponse(req.t("CATEGORY_ADDED_SUCCESSFULLY"));
        return data;
    },

    categoryList: async (req: Request) => {
        const id = req.params.id
        let query: any = {};

        if (id) {
            query.parentCategoryId = id;
        } else {
            query.parentCategoryId = { $eq: null };
        }

        const data = await category.find();
        if (!data) {
            return createErrorResponse(
                RESPONSE_STATUS.RECORD_NOT_FOUND,
                req.t("LIST_NOT_FOUND")
            );
        }
        return createSuccessResponse(data, req.t("LIST_FETCHED_SUCCESSFULLY"))
    },

    getCategoryById: async (req: Request) => {
        const id = req.params.id;
        if (!id) {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("ID_NOT_FOUND")
            );
        }
        const data = await category.findById(id);
        if (!data) {
            return createErrorResponse(
                RESPONSE_STATUS.RECORD_NOT_FOUND,
                req.t("CATEGORY_NOT_FOUND")
            );
        }
        return createSuccessResponse(data, req.t("CATEGOGY_FETCHED_SUCCESSFULLY"))
    },

    updateCategory: async (req: Request) => {
        const id = req.params.id
        const body: updateCategory = req.body;
        if (!body) {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("MISSING_BODY_IN_REQUEST"),
            );
        }
        if (!id) {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("ID_NOT_FOUND")
            );
        }
        await category.findByIdAndUpdate(id, body, { new: true });
        return createSuccessResponse(req.t("CATEGORY_UPDATED_SUCCESSFULLY"))
    },

    deleteCategory: async (req: Request) => {
        const id = req.params.id
        if (!id) {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("ID_NOT_FOUND")
            );
        }
        await category.findOneAndDelete({ _id: id });
        return createSuccessResponse(req.t("CATEGORY_DELETED_SUCCESSFULLY"))
    }
} 
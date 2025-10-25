import { Request } from "express";
import { createErrorResponse, createSuccessResponse } from "@app/utils/common";
import { RESPONSE_STATUS, ROLES } from "@app/config/constants";
import { defaultPaginationConfig } from "@app/utils/pagination";
import { documentSchema } from "../validations/documents";
import { Documents } from "../models/documents";
import { validateUserAuth } from "@app/modules/onboarding/services/common";

export const DocumentService = {
    addDocuments: async (req: Request) => {
        const body = documentSchema.parse(req.body);

        const document = await Documents.create(body);
        return createSuccessResponse(document, req.t("DOCUMENT_CREATED_SUCCESSFULLY"));
    },

    updateDocument: async (req: Request) => {
        const body = documentSchema.partial().parse(req.body);
        const result = validateUserAuth(req);

        if (!("user" in result)) {
            return createErrorResponse(
                RESPONSE_STATUS.RECORD_NOT_FOUND,
                req.t("ACCOUNT_NOT_FOUND")
            );
        }

        const isUser = result.user.role == ROLES.USER;
        let document;

        if (isUser) {
            document = await Documents.findOneAndUpdate({ _id: req.params.id, userId: result.user.id }, body, { new: true });
        }

        document = await Documents.findByIdAndUpdate(req.params.id, body, { new: true });

        if (!document) {
            return createErrorResponse(
                RESPONSE_STATUS.RECORD_NOT_FOUND,
                req.t("DOCUMENT_NOT_FOUND")
            );
        }

        return createSuccessResponse(document, req.t("DOCUMENT_UPDATED_SUCCESSFULLY"));
    },

    getDocument: async (req: Request) => {
        const document = await Documents.findById(req.params.id);

        if (!document || document.isDeleted) {
            return createErrorResponse(
                RESPONSE_STATUS.RECORD_NOT_FOUND,
                req.t("DOCUMENT_NOT_FOUND")
            );
        }

        return createSuccessResponse(document, req.t("DOCUMENT_FETCHED_SUCCESSFULLY"));
    },

    deleteDocument: async (req: Request) => {
        const addon = await Documents.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );

        if (!addon) {
            return createErrorResponse(
                RESPONSE_STATUS.RECORD_NOT_FOUND,
                req.t("DOCUMENT_NOT_FOUND")
            );
        }

        return createSuccessResponse(addon, req.t("DOCUMENT_DELETED_SUCCESSFULLY"));
    },

    list: async (req: Request) => {
        const options = {
            page: Number(req.query.page) || defaultPaginationConfig.page,
            limit: Number(req.query.limit) || defaultPaginationConfig.limit,
            sort: req.query.sort || { createdAt: -1 },
        };

        const query: any = { isDeleted: false };

        if (req.query.userId) query.userId = req.query.userId;
        if (req.query.search)
            query.name = { $regex: new RegExp(req.query.search as string, "i") };
        if (req.query.financeType)
            query.financeType = Number(req.query.financeType);
        if (req.query.deliveryType)
            query.deliveryType = Number(req.query.deliveryType);

        const addons = await (Documents as any).paginate(query, options);
        return createSuccessResponse(addons, req.t("DOCUMENT_FETCHED_SUCCESSFULLY"));
    },
};

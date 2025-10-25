import { Request } from "express";
import { createErrorResponse, createSuccessResponse } from "@app/utils/common";
import { APPLICATION_STATUS_TYPES, RESPONSE_STATUS, ROLES } from "@app/config/constants";
import { defaultPaginationConfig } from "@app/utils/pagination";
import { ApplicationType } from "../validations/applilcation";
import { Application } from "../models/application";
import { validateUserAuth } from "@app/modules/onboarding/services/common";
import { Document } from "../models/applicationDocs";
import { Insurance } from "../models/insurance";
import { Documents } from "@app/modules/documents/models/documents";
import { TradeIn } from "@app/modules/tradein/models/tradein";

export const ApplicationService = {
    addApplication: async (req: Request) => {
        const body: ApplicationType = req.body;

        const exists = await Application.findOne({
            user: body.user,
            vehicle: body.vehicle,
            type: body.type,
            isDeleted: false,
        });

        if (exists) {
            return createErrorResponse(RESPONSE_STATUS.ALREADY_EXISTS, req.t("APPLICATION_ALREADY_EXISTS"));
        }

        if (body.document) {
            let response = await Document.create(body.document);
            body.document = response._id;
        }

        if (body.insurance) {
            let response = await Insurance.create(body.insurance);
            body.insurance = response._id;
        }

        if (body.tradeIn) {
            let response = await TradeIn.create({ ...body.tradeIn, userId: body.user });
            body.tradeIn = response._id;
        }

        const application = await Application.create(body);
        return createSuccessResponse(application, req.t("APPLICATION_SUBMITTED_SUCCESSFULLY"));
    },

    updateApplicationStatus: async (req: Request) => {
        const { status, type } = req.body;
        let application;
        if (type == APPLICATION_STATUS_TYPES.DOCUMENTS) {
            application = await Documents.findByIdAndUpdate(
                req.params.id,
                { status: status },
                { new: true }
            );
        }

        if (type == APPLICATION_STATUS_TYPES.INSURANCE) {
            application = await Insurance.findByIdAndUpdate(
                req.params.id,
                { status: status },
                { new: true }
            );
        }

        application = await Application.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!application) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("APPLICATION_NOT_FOUND"));
        }

        return createSuccessResponse(application, req.t("APPLICATION_STATUS_UPDATED"));
    },

    getApplication: async (req: Request) => {
        const application = await Application.findById(req.params.id)
            .populate("user")
            .populate("vehicle")
            .populate("document")
            .populate("insurance");

        if (!application) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("APPLICATION_NOT_FOUND"));
        }

        return createSuccessResponse(application, req.t("APPLICATION_FETCHED_SUCCESSFULLY"));
    },

    deleteApplication: async (req: Request) => {
        const application = await Application.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );

        if (!application) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("APPLICATION_NOT_FOUND"));
        }

        return createSuccessResponse(application, req.t("APPLICATION_DELETED_SUCCESSFULLY"));
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
            populate: ["user", "vehicle", "document", "insurance"],
        };

        const query: any = { isDeleted: false };

        const isUser = result.user.role == ROLES.USER

        if (isUser) {
            query.userId = result.user.id
        }

        if (!isUser && req.query.userId) query.userId = req.query.userId
        if (req.query.status) query.status = req.query.status;
        if (req.query.applicationType) query.applicationType = req.query.applicationType;

        const applications = await Application.paginate(query, options);
        return createSuccessResponse(applications, req.t("APPLICATION_LIST_FETCHED_SUCCESSFULLY"));
    },

    counterPrice: async (req: Request) => {
        const { counterPrice } = req.body;
        const { id: applicationId } = req.params;

        const application = await TradeIn.findByIdAndUpdate(
            applicationId,
            { counterPrice },
            { new: true }
        );
        if (!application) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("APPLICATION_NOT_FOUND"));
        }
        return createSuccessResponse(application, req.t("COUNTER_PRICE_UPDATED_SUCCESSFULLY"));
    },

    addDocument: async (req: Request) => {
        const { id: documentId } = req.params;
        const { name, url } = req.body;

        const application = await Document.findOneAndUpdate(
            { _id: documentId },
            { $push: { documents: { name, url } } },
            { new: true }
        );

        if (!application) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("APPLICATION_NOT_FOUND"));
        }
        return createSuccessResponse(application, req.t("DOCUMENT_ADDED_SUCCESSFULLY"));
    },

    removeDocument: async (req: Request) => {
        const { id: documentId, fileId } = req.params;

        const application = await Document.findOneAndUpdate(
            { _id: documentId },
            { $pull: { documents: { _id: fileId } } },
            { new: true }
        );

        if (!application) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("APPLICATION_NOT_FOUND"));
        }
        return createSuccessResponse(application, req.t("DOCUMENT_DELETED_SUCCESSFULLY"));
    },

    updateDocumentStatus: async (req: Request) => {
        const { status } = req.body;
        const { id: documentId, fileId } = req.params;

        const application = await Document.findOneAndUpdate(
            { _id: documentId, "documents._id": fileId },
            { $set: { "documents.$.status": status } },
            { new: true }
        );

        if (!application) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("APPLICATION_NOT_FOUND"));
        }
        return createSuccessResponse(application, req.t("DOCUMENT_STATUS_UPDATED_SUCCESSFULLY"));
    },

    sendMessage: async (req: Request) => {
        const result = validateUserAuth(req);

        if (!("user" in result)) {
            return createErrorResponse(
                RESPONSE_STATUS.RECORD_NOT_FOUND,
                req.t("ACCOUNT_NOT_FOUND"),
            );
        }

        const { message, documentUrl } = req.body;
        const { id: applicationId } = req.params;

        const application = await Document.findByIdAndUpdate(
            applicationId,
            {
                $push: {
                    conversation: {
                        senderId: result.user.id,
                        message,
                        documentUrl,
                        createdAt: new Date(),
                    },
                },
            },
            { new: true }
        );

        if (documentUrl) {
            await Document.findByIdAndUpdate(
                applicationId,
                { $push: { documents: { name: "Uploaded Document", url: documentUrl } } },
                { new: true }
            );
        }

        if (!application) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("APPLICATION_NOT_FOUND"));
        }
        return createSuccessResponse(application, req.t("MESSAGE_SENT_SUCCESSFULLY"));
    },
};

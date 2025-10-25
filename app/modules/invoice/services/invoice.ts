import { Request } from "express";
import { createErrorResponse, createSuccessResponse } from "@app/utils/common";
import { RESPONSE_STATUS, ROLES } from "@app/config/constants";
import { defaultPaginationConfig } from "@app/utils/pagination";
import { InvoiceType } from "../validations/invoice";
import { Invoice } from "../models/invoice";
import { validateUserAuth } from "@app/modules/onboarding/services/common";

export const InvoiceService = {
    createInvoice: async (req: Request) => {
        const body: InvoiceType = req.body;

        const invoice = await Invoice.create(body);
        return createSuccessResponse(invoice, req.t("INVOICE_CREATED_SUCCESSFULLY"));
    },

    updateInvoice: async (req: Request) => {
        const body: Partial<InvoiceType> = req.body;

        const invoice = await Invoice.findByIdAndUpdate(req.params.id, body, { new: true });
        if (!invoice) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("INVOICE_NOT_FOUND"));
        }
        return createSuccessResponse(invoice, req.t("INVOICE_UPDATED_SUCCESSFULLY"));
    },

    getInvoice: async (req: Request) => {
        const invoice = await Invoice.findById(req.params.id)
            .populate("userId")
            .populate("orderId");

        if (!invoice) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("INVOICE_NOT_FOUND"));
        }
        return createSuccessResponse(invoice, req.t("INVOICE_FETCHED_SUCCESSFULLY"));
    },

    deleteInvoice: async (req: Request) => {
        const invoice = await Invoice.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!invoice) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("INVOICE_NOT_FOUND"));
        }
        return createSuccessResponse(invoice, req.t("INVOICE_DELETED_SUCCESSFULLY"));
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
        };

        const query: any = { isDeleted: false };
        if (req.query.status) query.status = req.query.status;
        if (req.query.paymentMethod) query.paymentMethod = req.query.paymentMethod;

        const isUser = result.user.role == ROLES.USER;

        if (isUser) {
            query.userId = result.user.id;
        } else if (req.query.userId && !isUser) {
            query.userId = req.query.userId;
        }

        const invoices = await Invoice.paginate(query, options);
        return createSuccessResponse(invoices, req.t("INVOICE_LIST_FETCHED_SUCCESSFULLY"));
    },
};

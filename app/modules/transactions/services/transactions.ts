import { Request } from "express";
import { createErrorResponse, createSuccessResponse } from "@app/utils/common";
import { RESPONSE_STATUS, ROLES } from "@app/config/constants";
import { defaultPaginationConfig } from "@app/utils/pagination";
import { TransactionType } from "../validations/transaction";
import Transactions from "../models/transactions";
import { validateUserAuth } from "@app/modules/onboarding/services/common";

export const TransactionService = {
    addTransaction: async (req: Request) => {
        const body: TransactionType = req.body;

        const transaction = await Transactions.create(body);
        return createSuccessResponse(transaction, req.t("TRANSACTION_CREATED_SUCCESSFULLY"));
    },

    updateTransaction: async (req: Request) => {
        const body: Partial<TransactionType> = req.body;

        const transaction = await Transactions.findByIdAndUpdate(req.params.id, body, { new: true });
        if (!transaction) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("TRANSACTION_NOT_FOUND"));
        }

        return createSuccessResponse(transaction, req.t("TRANSACTION_UPDATED_SUCCESSFULLY"));
    },

    getTransaction: async (req: Request) => {
        const transaction = await Transactions.findById(req.params.id)
            .populate("userId")
            .populate("referenceId");

        if (!transaction) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("TRANSACTION_NOT_FOUND"));
        }

        return createSuccessResponse(transaction, req.t("TRANSACTION_FETCHED_SUCCESSFULLY"));
    },

    deleteTransaction: async (req: Request) => {
        const transaction = await Transactions.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );

        if (!transaction) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("TRANSACTION_NOT_FOUND"));
        }

        return createSuccessResponse(transaction, req.t("TRANSACTION_DELETED_SUCCESSFULLY"));
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
            populate: "referenceId"
        };

        const query: any = { isDeleted: false };

        const isUser = result.user.role == ROLES.USER

        if (isUser) {
            query.userId = result.user.id
        }

        if (!isUser && req.query.userId) query.userId = req.query.userId
        if (req.query.status) query.status = req.query.status;
        if (req.query.transactionType) query.transactionType = req.query.transactionType;

        if (req.query.startDate && req.query.endDate) {
            const start = new Date(req.query.startDate as string);
            start.setHours(0, 0, 0, 0);
            const end = new Date(req.query.endDate as string);
            end.setHours(23, 59, 59, 999);
            query.createdAt = { $gte: start, $lte: end };
        }

        const transactions = await Transactions.paginate(query, options);
        return createSuccessResponse(transactions, req.t("TRANSACTION_LIST_FETCHED_SUCCESSFULLY"));
    },
};

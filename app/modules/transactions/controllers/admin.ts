import { Request, Response } from "express";
import { sendResponse } from "@app/utils/common";
import { TransactionService } from "../services/transactions";
import { asyncHandler } from "@app/middleware/async";

const addTransaction = asyncHandler(async (req: Request, res: Response) => {
    const response = await TransactionService.addTransaction(req);
    return sendResponse(res, response);
});

const updateTransaction = asyncHandler(async (req: Request, res: Response) => {
    const response = await TransactionService.updateTransaction(req);
    return sendResponse(res, response);
});

const getTransaction = asyncHandler(async (req: Request, res: Response) => {
    const response = await TransactionService.getTransaction(req);
    return sendResponse(res, response);
});

const deleteTransaction = asyncHandler(async (req: Request, res: Response) => {
    const response = await TransactionService.deleteTransaction(req);
    return sendResponse(res, response);
});

const getTransactionList = asyncHandler(async (req: Request, res: Response) => {
    const response = await TransactionService.list(req);
    return sendResponse(res, response);
});

export default {
    addTransaction,
    updateTransaction,
    getTransaction,
    deleteTransaction,
    getTransactionList,
};

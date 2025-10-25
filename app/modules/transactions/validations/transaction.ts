import { z } from "zod";
import { TRANSACTION_TYPE, PAYMENT_METHOD, COMMON_STATUS } from "@app/config/constants";

export const transaction = z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid userId"),
    referenceId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid referenceId"),
    referenceModel: z.enum(["Booking", "SubscriptionPlan"]),
    transactionType: z.enum(TRANSACTION_TYPE).optional(),
    paymentMethod: z.enum(PAYMENT_METHOD).optional(),
    paymentId: z.string().optional(),
    status: z.enum(COMMON_STATUS).optional(),
    amount: z.number().min(0, "Amount is required"),
});

export type TransactionType = z.infer<typeof transaction>;

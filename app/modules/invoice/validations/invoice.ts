import { PAYMENT_STATUS, PAYMENT_TYPE } from "@app/config/constants";
import { z } from "zod";

export const invoice = z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid userId"),
    bookingId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid bookingId"),
    applicationId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid applicationId").optional(),
    amount: z.number().min(0, "Amount must be greater than or equal to 0"),
    tax: z.number().min(0, "Tax must be greater than or equal to 0").optional(),
    totalAmount: z.number().min(0, "Total amount is required"),
    paymentMethod: z.enum(PAYMENT_TYPE).optional(),
    paymentStatus: z
        .enum(PAYMENT_STATUS)
        .default(PAYMENT_STATUS.PENDING)
        .optional(),
    items: z
        .array(
            z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid VehicleId"),
        )
        .optional(),
    notes: z.string().optional(),
});

export type InvoiceType = z.infer<typeof invoice>;

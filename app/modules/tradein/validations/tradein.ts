import { z } from "zod";

export const tradeIn = z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid userId").optional(),
    evaluationBooking: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid evaluationBookingId").optional(),
    counterPrice: z.number().optional(),
    status: z.number().optional(),
});

export type TradeInType = z.infer<typeof tradeIn>;

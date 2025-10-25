import { BOOKING_STATUS } from "@app/config/constants";
import { z } from "zod";

export const booking = z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid userId"),
    vehicleId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid vehicleId"),
    documentsId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid documentsId"),
    notes: z.string().optional(),
    status: z
        .nativeEnum(BOOKING_STATUS)
        .optional(),
});

export type BookingType = z.infer<typeof booking>;
